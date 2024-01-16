import { User } from '~/models/schemas/user.schema'
import databaseService from './database.services'
import { registerReqBody, updateReqBody } from '~/models/requests/user.requests'
import { hashPassword } from '~/utils/cryptos'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enums.constants'
import RefreshToken from '~/models/schemas/refreshToken.schema'
import { ObjectId } from 'mongodb'
import dotenv from 'dotenv'
import { USERS_MESSAGES } from '~/constants/messages'
import Follower from '~/models/schemas/follower.schema'
dotenv.config()

// verify: Xác định rằng USER đã được verify hay chưa

class UsersService {
  async login({ userId, verify }: { userId: string; verify: UserVerifyStatus }) {
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken({ userId, verify })
    await databaseService.refresh_tokens.insertOne(
      new RefreshToken({ token: refreshToken, user_id: new ObjectId(userId) })
    )
    return { accessToken, refreshToken }
  }

  async register(payload: registerReqBody) {
    const _id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      userId: _id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken({
      userId: _id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    console.log('Email_verify_token', email_verify_token)
    await databaseService.refresh_tokens.insertOne(
      new RefreshToken({ token: refreshToken, user_id: new ObjectId(_id.toString()) })
    )
    return { accessToken, refreshToken }
  }

  private signAccessTokenAndRefreshToken({ userId, verify }: { userId: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ userId, verify }), this.signRefreshToken({ userId, verify })])
  }

  async emailIsAlreadyExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  private signEmailVerifyToken({ userId, verify }: { userId: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        userId,
        token_type: TokenType.EmailVerifyToken,
        verify
      },
      secretOrPrivateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  private signForgotPasswordToken({ userId, verify }: { userId: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        userId,
        token_type: TokenType.ForgotPasswordToken,
        verify
      },
      secretOrPrivateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
      }
    })
  }

  private signAccessToken({ userId, verify }: { userId: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        userId,
        token_type: TokenType.AccessToken,
        verify
      },
      secretOrPrivateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken({ userId, verify }: { userId: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        userId,
        token_type: TokenType.RefreshToken,
        verify
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

  async verifyEmail(userId: string) {
    const [result] = await Promise.all([
      this.signAccessTokenAndRefreshToken({ userId, verify: UserVerifyStatus.Verified }),
      databaseService.users.updateOne(
        { _id: new ObjectId(userId) },
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
    await databaseService.refresh_tokens.insertOne(
      new RefreshToken({ token: refreshToken, user_id: new ObjectId(userId.toString()) })
    )
    return {
      accessToken,
      refreshToken
    }
  }

  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken({ userId: user_id, verify: UserVerifyStatus.Unverified })
    console.log('Email verify resend: ', email_verify_token)

    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      { $set: { email_verify_token }, $currentDate: { updated_at: true } }
    )

    return {
      message: USERS_MESSAGES.RESEND_EMAIL_VERIFY_SUCCESS
    }
  }

  async forgotPassword({ userId, verify }: { userId: string; verify: UserVerifyStatus }) {
    const forgot_password_token = await this.signForgotPasswordToken({ userId, verify })

    await databaseService.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { forgot_password_token }, $currentDate: { updated_at: true } }
    )
    // Gửi email forgot password kèm forgot_password_token đến email người dùng: https://twitter.com/forgot-password?token=token
    console.log('Forgot password token: ', forgot_password_token)

    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD_SUCCESS
    }
  }

  async resetPassword(user_id: string, password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      { $set: { forgot_password_token: '', password: hashPassword(password) }, $currentDate: { updated_at: true } }
    )
    return { message: USERS_MESSAGES.RESET_PASSWORD_IS_SUCCESS }
  }

  async updateProfile(user_id: string, payload: updateReqBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      { $set: { ...(_payload as updateReqBody & { date_of_birth?: Date }) }, $currentDate: { updated_at: true } },
      { returnDocument: 'after', projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
    )

    return user
  }

  async follow(user_id: string, followed_user_id: string) {
    await databaseService.followers.insertOne(
      new Follower({
        user_id: new ObjectId(user_id),
        followed_user_id: new ObjectId(followed_user_id)
      })
    )
    return { message: USERS_MESSAGES.FOLLOW_SUCCESS }
  }

  async unfollow(user_id: string, followed_user_id: string) {
    await databaseService.followers.findOneAndDelete({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    return { message: USERS_MESSAGES.UNFOLLOW_SUCCESS }
  }

  async changePassword(user_id: string, password: string) {
    await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      { $set: { password: hashPassword(password) }, $currentDate: { updated_at: true } }
    )
    return { message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS }
  }
}

const usersService = new UsersService()
export default usersService
