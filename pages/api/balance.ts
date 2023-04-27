import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import jwt from "@/lib/jwt";

type Data = {
  balance: Prisma.Decimal;
};

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
            USER_ID: decoded.userId,
          },
        });
        if (!exists) {
          res.status(403).end();
          resolve();
        } else {
          res.status(200).json({ balance: exists.BALANCE });
          resolve();
        }
        resolve();
      }
    );
  });
}
