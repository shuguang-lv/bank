import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "@prisma/client"

import jwt from "@/lib/jwt"
import prisma from "@/lib/prisma"

type Data = {
  balance: Prisma.Decimal
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return new Promise<void>(async (resolve, reject) => {
    jwt.authenticate(
      req,
      res,
      async (req: NextApiRequest, res: NextApiResponse, decoded: any) => {
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
      }
    )
  })
}
