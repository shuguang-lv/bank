import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "@prisma/client"
import requestIp from "request-ip"

import { csrf } from "@/lib/csrf"
import jwt from "@/lib/jwt"
import prisma from "@/lib/prisma"
import rateLimit from "@/lib/rate-limiter"

type Data = {
  balance: Prisma.Decimal
}

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
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
      try {
        const exists = await prisma.bANK_USERS.findFirst({
          where: {
            USER_NAME: decoded.username,
          },
        })
        if (!exists) {
          res.status(403).end()
        } else {
          res.status(200).json({ balance: exists.BALANCE })
        }
      } catch (error) {
        res.status(500).end()
      }
    }
  )
}

export default csrf(handler)
