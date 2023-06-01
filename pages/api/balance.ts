import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "@prisma/client"

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return new Promise<void>(async (resolve, reject) => {
    try{
      await limiter.check(res, 10, req.body.username)
    }catch(err){
      res.status(429).end()
      resolve()
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
            resolve()
          } else {
            res.status(200).json({ balance: exists.BALANCE })
            resolve()
          }
          resolve()
        } catch (error) {
          res.status(500).end()
          resolve()
        }
      }
    )
  })
}
