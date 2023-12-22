import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandlers } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, wrapRequestHandlers(loginController))
usersRouter.post('/register', registerValidator, wrapRequestHandlers(registerController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandlers(logoutController))

export default usersRouter
