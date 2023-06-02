import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "@prisma/client"
import requestIp from "request-ip"

import jwt from "@/lib/jwt"
import prisma from "@/lib/prisma"
import rateLimit from "@/lib/rate-limiter"
import { validateBalance } from "@/lib/utils"

type Data = {
  balance: Prisma.Decimal
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
    const identifier = requestIp.getClientIp(req) as string
    await limiter.check(res, 10, identifier)
  } catch (err) {
    res.status(429).end()
    return
  }

  jwt.authenticate(
    req,
    res,
    async (req: NextApiRequest, res: NextApiResponse, decoded: any) => {
      if (req.body.amount == null) {
        res.status(400).end()
        return
      }
      if (!validateBalance(req.body.amount)) {
        res.status(422).end()
        return
      }
      try {
        const newRecord = await prisma.bANK_USERS.update({
          where: { USER_NAME: decoded.username },
          data: {
            BALANCE: {
              increment: Number(req.body.amount),
            },
          },
        })
        res.status(200).json({ balance: Number(newRecord.BALANCE) })
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2025"
        ) {
          // user not found
          res.status(403).end()
        } else {
          res.status(500).end()
        }
      }
    }
  )
}
