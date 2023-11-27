import { User } from '~/models/schemas/user.schema'
import databaseService from './database.services'

class UsersService {
  async register(payload: { name: string; email: string; password: string }) {
    const { name, email, password } = payload
    const result = await databaseService.users.insertOne(new User({ name, email, password }))
    return result
  }
}

const usersService = new UsersService()
export default usersService
