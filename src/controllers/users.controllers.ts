import { NextFunction, Request, Response } from 'express'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { loginReqBody, logoutReqBody, registerReqBody } from '~/models/requests/user.requests'
import { ObjectId } from 'mongodb'
import { User } from '~/models/schemas/user.schema'
import { USERS_MESSAGES } from '~/constants/messages'

export const loginController = async (req: Request<ParamsDictionary, any, loginReqBody>, res: Response) => {
  const user = req.user as User
  const { _id } = user
  const result = await usersService.login(_id.toString())
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result: result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, logoutReqBody>, res: Response) => {
  const { refresh_token }: any = req.body
  const result = await usersService.logout(refresh_token)
  return res.json({
    message: result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, registerReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result: result
  })
}
