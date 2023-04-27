import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import jwt from "@/lib/jwt";
import { v4 as uuidv4 } from "uuid";

type Data = {
  userId: string;
  email: string;
  token: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return new Promise<void>(async (resolve, reject) => {
    if (req.method !== "POST" || !req.body.email || !req.body.password) {
      res.status(400).end();
      resolve();
    } else {
      const exists = await prisma.bANK_USERS.findFirst({
        where: {
          EMAIL: req.body.email,
        },
      });
      if (exists) {
        // user with this email already exists
        res.status(422).end();
        resolve();
      } else {
        let newUserId = uuidv4();
        let hash = await bcrypt.hash(req.body.password, 10);
        let balance = req.body.balance ? req.body.balance : 0;
        await prisma.bANK_USERS.create({
          data: {
            USER_ID: newUserId,
            EMAIL: req.body.email,
            PWD_HASH: hash,
            BALANCE: balance,
          },
        });
        let token = jwt.sign(
          { userId: newUserId, email: req.body.email },
          { expiresIn: "1h" }
        );

        res
          .status(200)
          .json({ email: req.body.email, userId: newUserId, token: token });
        resolve();
      }
    }
  });
}
