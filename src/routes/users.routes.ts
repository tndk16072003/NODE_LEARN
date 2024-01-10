import { Router } from 'express'
import {
  emailVerifyController,
  getMeController,
  loginController,
  logoutController,
  registerController,
  updateController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  getMeValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandlers } from '~/utils/handlers'

const usersRouter = Router()

/**
 * Description. Verify email when user client click on the link verify email
 * Path: /verify-email
 * Methods: POST
 * Body: { 'email_verify_token': string }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandlers(emailVerifyController))

usersRouter.patch('/update', accessTokenValidator, wrapRequestHandlers(updateController))
usersRouter.get('/me', getMeValidator, wrapRequestHandlers(getMeController))
usersRouter.post('/login', loginValidator, wrapRequestHandlers(loginController))
usersRouter.post('/register', registerValidator, wrapRequestHandlers(registerController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandlers(logoutController))

export default usersRouter
