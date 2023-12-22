import { User } from '~/models/schemas/user.schema'
import databaseService from './database.services'
import { loginReqBody, registerReqBody } from '~/models/requests/user.requests'
import { hashPassword } from '~/utils/cryptos'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums.constants'
import RefreshToken from '~/models/schemas/refreshToken.schemas'
import { ObjectId } from 'mongodb'
import dotenv from 'dotenv'
import { USERS_MESSAGES } from '~/constants/messages'
dotenv.config()

class UsersService {
  async login(userId: string) {
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken(userId)
    await databaseService.refresh_tokens.insertOne(
      new RefreshToken({ token: refreshToken, user_id: new ObjectId(userId) })
    )
    return { accessToken, refreshToken }
  }

  async register(payload: registerReqBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const userId = result.insertedId.toString()
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken(userId)
    await databaseService.refresh_tokens.insertOne(
      new RefreshToken({ token: refreshToken, user_id: new ObjectId(userId) })
    )
    return { accessToken, refreshToken }
  }

  private signAccessTokenAndRefreshToken(userId: string) {
    return Promise.all([this.signAccessToken(userId), this.signFreshToken(userId)])
  }

  async emailIsAlreadyExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  private signAccessToken(userId: string) {
    return signToken({
      payload: {
        userId,
        token_type: TokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signFreshToken(userId: string) {
    return signToken({
      payload: {
        userId,
        token_type: TokenType.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  async logout(refresh_token: string) {
    await databaseService.refresh_tokens.deleteOne({ token: refresh_token })
    return USERS_MESSAGES.LOGOUT_SUCCESS
  }
}

const usersService = new UsersService()
export default usersService
