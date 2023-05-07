import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "@prisma/client"
import * as bcrypt from "bcrypt"

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
        } else {
          if (!req.body.amount) {
            res.status(400).end()
          } else {
            let newBalance = Number(exists.BALANCE) - Number(req.body.amount)
            if (newBalance < 0) {
              res.status(422).end()
            } else {
              await prisma.bANK_USERS.update({
                where: { USER_NAME: decoded.username },
                data: { BALANCE: newBalance },
              })
              res.status(200).json({ balance: newBalance })
            }
          }
        }
        resolve()
      }
    )
  })
}
