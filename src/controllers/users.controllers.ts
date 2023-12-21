import { NextFunction, Request, Response } from 'express'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { registerReqBody } from '~/models/requests/user.requests'
import { ObjectId } from 'mongodb'
import { User } from '~/models/schemas/user.schema'

export const loginController = async (req: Request, res: Response) => {
  console.log(req.user)
  const user = req.user as User
  const { _id } = user
  const result = await usersService.login(_id.toString())
  return res.json({
    message: 'Login success!',
    result: result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, registerReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)
  return res.json({
    message: 'Register success!',
    result: result
  })
}
