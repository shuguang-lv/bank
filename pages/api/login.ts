import type { NextApiRequest, NextApiResponse } from "next"
import * as argon2 from "argon2"

import jwt from "@/lib/jwt"
import prisma from "@/lib/prisma"
import { validateName, validatePassword } from "@/lib/utils"

type Data = {
  username: string
  token: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return new Promise<void>(async (resolve, reject) => {
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
  })
}
