import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma";
import * as bcrypt from 'bcrypt';
import jwt from "@/lib/jwt";

type Data = {
  userId: string,
  email: string,
  token: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return new Promise<void>(async (resolve, reject) => {
    if (req.method !== 'POST' || !req.body.email || !req.body.password) {
      res.status(400).end();
      resolve();
    } else {
      const EMAIL = req.body.email;
      // bcrypt.hash(req.body.password,10,(err,hash)=>{console.log(hash);});
      // console.log(uuidv4());
      const exists = await prisma.bANK_USERS.findFirst({
        where: {
          EMAIL
        },
      });
      if (!exists) {
        res.status(403).end();
        resolve();
      } else {
        bcrypt.compare(req.body.password, exists.PWD_HASH, function (err, result) {
          if (result) {
            let token = jwt.sign({ userId: exists.USER_ID, email: EMAIL }, { expiresIn: '1h' });
            res.status(200).json({ email: EMAIL, userId: exists.USER_ID, token: token })
            resolve();
          } else {
            res.status(403).end();
            resolve();
          }
        });
      }
    }
  });
}
