import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { ErrorWithStatus } from '~/models/Errors'
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
    name: {
      notEmpty: true,
      isLength: {
        options: {
          min: 2,
          max: 30
        },
        errorMessage: 'Name length from 2 to 30 characters'
      }
    },
    email: {
      isEmail: true,
      notEmpty: true,
      trim: true,
      custom: {
        options: async (value) => {
          const error = await usersService.emailIsAlreadyExist(value)
          if (error) throw new Error('Email already exist')
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isLength: {
        options: {
          min: 6,
          max: 15
        },
        errorMessage: 'Password length from 6 to 15 characters'
      },
      isStrongPassword: {
        options: {
          minUppercase: 1,
          minSymbols: 1,
          minNumbers: 1,
          minLowercase: 1
        },
        errorMessage: 'Password must have at least 1 uppercase, 1 lowercase, 1 symbol and 1 number'
      }
    },
    confirm_password: {
      notEmpty: true,
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Passwords do not same')
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)
