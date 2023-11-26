import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
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
    name: {
      errorMessage: 'Tên người dùng phải từ 2 ký tự trở lên',
      isLength: {
        options: {
          min: 2,
          max: 100
        }
      },
      notEmpty: true,
      trim: true,
      isString: true
    },
    email: {
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
    },
    confirm_password: {
      errorMessage: 'Mật khẩu xác nhận không trùng khớp',
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Mật khẩu xác nhận không giống') 
          }
          return true
        }
      },
      notEmpty: true,
      isStrongPassword: {
        options: {
          minLength: 6,
          minUppercase: 1,
          minSymbols: 1,
          minNumbers: 1
        }
      }
    },
    date_of_birth: {
      errorMessage: 'Ngày sinh chưa đúng định dạng',
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)
