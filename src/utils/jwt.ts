import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { TokenPayload } from '~/models/requests/user.requests'
dotenv.config()

export const signToken = ({
  payload,
  secretOrPrivateKey = process.env.JWT_SECRET as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  secretOrPrivateKey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secretOrPrivateKey, options, (err, token) => {
      if (err) throw reject(err)
      resolve(token as string)
    })
  })
}
export const verifyToken = ({
  token,
  secretOrPublicKey = process.env.JWT_SECRET as string
}: {
  token: string
  secretOrPublicKey?: string
}) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) throw reject(error)
      resolve(decoded as TokenPayload)
    })
  })
}
