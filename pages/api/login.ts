import type { NextApiRequest, NextApiResponse } from "next"
import * as argon2 from "argon2"

import jwt from "@/lib/jwt"
import prisma from "@/lib/prisma"
import rateLimit from "@/lib/rate-limiter"
import { validateName, validatePassword } from "@/lib/utils"
import requestIp from "request-ip";

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
  return new Promise<void>(async (resolve, reject) => {
    try {
      // maximum 10 requests per user every 60 seconds
      const identifier = requestIp.getClientIp(req) as string
      await limiter.check(res, 10, identifier)
      if (req.method !== "POST" || !req.body.username || !req.body.password) {
        res.status(400).end()
        resolve()
        return
      }
      if (
        !validateName(req.body.username) ||
        !validatePassword(req.body.password)
      ) {
        res.status(403).end()
        resolve()
        return
      }
      const username = req.body.username
      const exists = await prisma.bANK_USERS.findFirst({
        where: {
          USER_NAME: username,
        },
      })
      if (!exists) {
        res.status(403).end()
        resolve()
        return
      }
      argon2.verify(exists.PWD_HASH, req.body.password).then((result) => {
        if (result) {
          const token = jwt.sign({ username: username }, { expiresIn: "1h" })
          res.status(200).json({ username: username, token: token })
          resolve()
        } else {
          res.status(403).end()
          resolve()
        }
      })
    } catch (error) {
      if (error instanceof Error && error.message === "Rate limit exceeded") {
        res.status(429).end()
        resolve()
        return
      } else {
        res.status(500).end()
        resolve()
      }
    }
  })
}
