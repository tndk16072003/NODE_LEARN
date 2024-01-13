import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums.constants'

export interface verifyEmailTokenReqBody {
  email_verify_token: string
}

export interface verifyForgotPasswordTokenReqBody {
  forgot_password_token: string
}

export interface resetPasswordTokenReqBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}

export interface forgotPasswordReqBody {
  email: string
}

export interface registerReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}
export interface loginReqBody {
  email: string
  password: string
}

export interface logoutReqBody {
  refresh_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}
