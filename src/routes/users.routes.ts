import { Router } from 'express'
import {
  verifyEmailController,
  getMeController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyTokenController,
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
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandlers(verifyEmailController))

/**
 * Description. Resend verify email when user client click resend email
 * Path: /resend-verify-email
 * Methods: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandlers(resendEmailVerifyTokenController))

usersRouter.patch('/update', accessTokenValidator, wrapRequestHandlers(updateController))
usersRouter.get('/me', getMeValidator, wrapRequestHandlers(getMeController))
usersRouter.post('/login', loginValidator, wrapRequestHandlers(loginController))
usersRouter.post('/register', registerValidator, wrapRequestHandlers(registerController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandlers(logoutController))

export default usersRouter
