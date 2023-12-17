import { NextFunction, Request, Response } from 'express'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { registerReqBody } from '~/models/requests/user.requests'

export const loginController = (req: Request, res: Response) => {
  const { password } = req.body
  if (password === '123123') {
    res.status(500).json({
      message: 'Mật khẩu quá đơn giản. Vui lòng nhập lại mật khẩu phức tạp hơn!'
    })
  }
  res.json({
    message: 'Success',
    data: req.body
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, registerReqBody>,
  res: Response,
  next: NextFunction
) => {
  throw new Error('Lỗi rồi nè!')
  const result = usersService.register(req.body)
  return res.json({
    message: 'Insert success!',
    result
  })
}
