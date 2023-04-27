import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma";
import { Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt';
import jwt from "@/lib/jwt";

type Data = {
    balance: Prisma.Decimal
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    return new Promise<void>(async (resolve, reject) => {
        jwt.authenticate(req, res, async (req: NextApiRequest, res: NextApiResponse, decoded: any) => {
            const exists = await prisma.bANK_USERS.findFirst({
                where: {
                    USER_ID: decoded.userId
                },
            });
            if (!exists) {
                res.status(403).end();
            } else {
                if (!req.body.amount) {
                    res.status(400).end();
                } else {
                    let newBalance = Number(exists.BALANCE) + Number(req.body.amount);
                    await prisma.bANK_USERS.update({ where: { USER_ID: decoded.userId }, data: { BALANCE: newBalance } });
                    res.status(200).json({ balance: newBalance })
                }
            }
            resolve();
        });
    });
}
