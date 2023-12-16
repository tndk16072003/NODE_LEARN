import { User } from '~/models/schemas/user.schema'
import databaseService from './database.services'
import { registerReqBody } from '~/models/requests/user.requests'
import { hashPassword } from '~/utils/cryptos'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums.constants'

class UsersService {
  async register(payload: registerReqBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const userId = result.insertedId.toString()
    const [accessToken, refreshToken] = await Promise.all([this.signAccessToken(userId), this.signFreshToken(userId)])
    return { accessToken, refreshToken }
  }

  async checkEmailExist(email: string) {
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
}

const usersService = new UsersService()
export default usersService
