import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "@prisma/client"

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
        try {
          const newRecord = await prisma.bANK_USERS.update({
            where: { USER_NAME: decoded.username },
            data: {
              BALANCE: {
                decrement: Number(req.body.amount),
              },
            },
          })
          res.status(200).json({ balance: Number(newRecord.BALANCE) })
          resolve()
          return
        } catch (err) {
          if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === "P2025"
          ) {
            // user not found
            res.status(403).end()
            resolve()
            return
          } else if (
            err instanceof Prisma.PrismaClientUnknownRequestError &&
            err.message.includes("code: 3819")
          ) {
            // negative balance
            res.status(422).end()
            resolve()
            return
          } else {
            res.status(500).end()
            resolve()
            return
          }
        }
      }
    )
  })
}
