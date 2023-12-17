import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import usersService from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      error: 'Thiếu dữ liệu'
    })
  }
  next()
}

// sử dụng validate làm công cụ thông báo lỗi do checkSchema tìm thấy
export const registerValidator = validate(
  checkSchema({
    email: {
      custom: {
        options: async (value) => {
          if (await usersService.checkEmailExist(value)) throw new Error('Email đã tồn tại')
          return true
        }
      },
      errorMessage: 'Vui lòng nhập email đúng định dạng',
      notEmpty: true,
      isEmail: true,
      trim: true
    },
    password: {
      errorMessage: 'Mật khẩu ít nhất 6 ký tự ít nhất 1 ký tự in hoa, 1 ký tự đặc biệt và 1 chữ số',
      notEmpty: true,
      isStrongPassword: {
        options: {
          minLength: 6,
          minUppercase: 1,
          minSymbols: 1,
          minNumbers: 1
        }
      }
    }
  })
)
