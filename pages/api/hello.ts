import type { NextApiRequest, NextApiResponse } from "next"

import prisma from "@/lib/prisma"

type Data = {
  connect: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const EMAIL = "siyaoh4@uci.edu"
  const exists = await prisma.bANK_USERS.findFirst({
    where: {
      EMAIL,
    },
  })
  if (exists) {
    res.status(200).json({ connect: true })
  } else {
    res.status(401).json({ connect: false })
  }
}
