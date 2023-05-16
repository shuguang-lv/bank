import { NextApiRequest, NextApiResponse } from "next"

const jsonwebtoken = require("jsonwebtoken")

declare global {
  const jwt: any
}

const jwt = {
  sign: (payload: any, options: any) => {
    const secret = process.env.JWT_SECRET
    const token = jsonwebtoken.sign(payload, secret, options)
    console.log(token)
    return token
  },
  authenticate: (
    req: NextApiRequest,
    res: NextApiResponse,
    callback: Function
  ) => {
    // callback(req, res, decoded);
    const secret = process.env.JWT_SECRET
    const token = req.headers.authorization?.split(" ")[1]
    if (typeof token !== "string") {
      res.status(401).end()
      return
    }
    jsonwebtoken.verify(token, secret, (err: any, decoded: any) => {
      if (err) {
        res.status(403).end()
        return
      }
      callback(req, res, decoded)
    })
  },
}

export default jwt
