import { User } from '~/models/schemas/user.schema'
import databaseService from './database.services'
import { registerReqBody } from '~/models/requests/user.requests'
import { hashPassword } from '~/utils/cryptos'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enums.constants'
import RefreshToken from '~/models/schemas/refreshToken.schemas'
import { ObjectId } from 'mongodb'
import dotenv from 'dotenv'
import { USERS_MESSAGES } from '~/constants/messages'
dotenv.config()

// verify: Xác định rằng USER đã được verify hay chưa

class UsersService {
  async login(userId: string) {
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken(userId)
    await databaseService.refresh_tokens.insertOne(
      new RefreshToken({ token: refreshToken, user_id: new ObjectId(userId) })
    )
    return { accessToken, refreshToken }
  }

  async register(payload: registerReqBody) {
    const _id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken(_id.toString())
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken(_id.toString())
    console.log('Email_verify_token', email_verify_token)
    await databaseService.refresh_tokens.insertOne(
      new RefreshToken({ token: refreshToken, user_id: new ObjectId(_id.toString()) })
    )
    return { accessToken, refreshToken }
  }

  private signAccessTokenAndRefreshToken(userId: string) {
    return Promise.all([this.signAccessToken(userId), this.signRefreshToken(userId)])
  }

  async emailIsAlreadyExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  private signEmailVerifyToken(userId: string) {
    return signToken({
      payload: {
        userId,
        token_type: TokenType.AccessToken
      },
      secretOrPrivateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  private signAccessToken(userId: string) {
    return signToken({
      payload: {
        userId,
        token_type: TokenType.AccessToken
      },
      secretOrPrivateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken(userId: string) {
    return signToken({
      payload: {
        userId,
        token_type: TokenType.RefreshToken
      },
      secretOrPrivateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  async logout(refresh_token: string) {
    await databaseService.refresh_tokens.deleteOne({ token: refresh_token })
    return USERS_MESSAGES.LOGOUT_SUCCESS
  }

  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async verifyEmail(user_id: string) {
    const [result] = await Promise.all([
      this.signAccessTokenAndRefreshToken(user_id),
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    ])
    const [accessToken, refreshToken] = result
    return {
      accessToken,
      refreshToken
    }
  }
}

const usersService = new UsersService()
export default usersService
