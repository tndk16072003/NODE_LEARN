import { Request, Response } from 'express'
import { User } from '~/models/schemas/user.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
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

export const registerController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  try {
    const result = await usersService.register({ name, email, password })
    return res.json({
      message: 'Insert success!',
      result
    })
  } catch (error) {
    console.log(error)
  }
}
