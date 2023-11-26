import { Request, Response } from 'express'

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

export const registerController = (req: Request, res: Response) => {
  res.json({
    message: 'Success',
    data: req.body
  })
}
