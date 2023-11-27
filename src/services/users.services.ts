import { User } from '~/models/schemas/user.schema'
import databaseService from './database.services'
import { registerReqBody } from '~/models/requests/user.requests'
import { hashPassword } from '~/utils/cryptos'

class UsersService {
  async register(payload: registerReqBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    return result
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
}

const usersService = new UsersService()
export default usersService
