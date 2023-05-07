import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "@prisma/client"
import * as bcrypt from "bcrypt"

import jwt from "@/lib/jwt"
import prisma from "@/lib/prisma"
import { validateBalance } from "@/lib/utils"

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
        if (req.body.amount == null) {
          res.status(400).end()
          resolve()
          return
        }
        if (!validateBalance(req.body.amount)) {
          res.status(422).end()
          resolve()
          return
        }
        const exists = await prisma.bANK_USERS.findFirst({
          where: {
            USER_NAME: decoded.username,
          },
        })
        if (!exists) {
          res.status(403).end()
          resolve
          return
        }
        let newBalance = Number(exists.BALANCE) - Number(req.body.amount)
        if (newBalance < 0) {
          res.status(422).end()
          resolve()
          return
        }
        await prisma.bANK_USERS.update({
          where: { USER_NAME: decoded.username },
          data: {
            BALANCE: {
              decrement: Number(req.body.amount), //TODO: the calculation from MySQL may be different from the calculation from JavaScript
            },
          },
        })
        let dbNewBalance = await prisma.bANK_USERS.findFirst({
          where: { USER_NAME: decoded.username },
        })
        if (Number(dbNewBalance?.BALANCE) < 0) {
          res.status(422).end()
          resolve()
          return
        }
        res.status(200).json({ balance: Number(dbNewBalance?.BALANCE) })
        resolve()
        return
      }
    )
  })
}
