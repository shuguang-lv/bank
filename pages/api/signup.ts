import type { NextApiRequest, NextApiResponse } from "next"
import * as argon2 from "argon2"
import * as bcrypt from "bcrypt"
import requestIp from "request-ip"

import jwt from "@/lib/jwt"
import prisma from "@/lib/prisma"
import rateLimit from "@/lib/rate-limiter"
import { validateBalance, validateName, validatePassword } from "@/lib/utils"

type Data = {
  username: string
  token: string
}

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // maximum 10 requests per user every 60 seconds
    const identifier = requestIp.getClientIp(req) as string
    await limiter.check(res, 10, identifier)
    if (
      req.method !== "POST" ||
      !req.body.username ||
      !req.body.password ||
      req.body.balance == null
    ) {
      res.status(400).end()
      return
    }
    if (
      !validateName(req.body.username) ||
      !validatePassword(req.body.password) ||
      !validateBalance(req.body.balance)
    ) {
      res.status(422).end()
      return
    }
    const exists = await prisma.bANK_USERS.findUnique({
      where: {
        USER_NAME: req.body.username,
      },
    })
    if (exists) {
      // user with this email already exists
      res.status(422).end()
      return
    }
    const salt = new Buffer(await bcrypt.genSalt(10))
    const hash = await argon2.hash(req.body.password, { salt })
    const balance = req.body.balance ?? 0
    await prisma.bANK_USERS.create({
      data: {
        USER_NAME: req.body.username,
        PWD_HASH: hash,
        BALANCE: balance,
      },
    })
    const token = jwt.sign({ username: req.body.username }, { expiresIn: "1h" })
    res.status(200).json({ username: req.body.username, token: token })
  } catch (err) {
    if (err instanceof Error && err.message === "Rate limit exceeded") {
      res.status(429).end()
    } else {
      res.status(500).end()
    }
  }
}
