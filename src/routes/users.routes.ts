import { Router } from 'express'
import {
  verifyEmailController,
  getMeController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyTokenController,
  updateController,
  forgotPasswordController,
  verifyForgotPasswordController,
  resetPasswordController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  getMeValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator
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

/**
 * Description. Form input email to forgot password & Resend email forgot password
 * Path: /forgot-password
 * Methods: POST
 * Body: { email: string }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandlers(forgotPasswordController))

/**
 * Description. Verify forgot_password_token
 * Path: /verify-forgot-password
 * Methods: POST
 * Body: { forgot_password_token: string }
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandlers(verifyForgotPasswordController)
)

/**
 * Description. Resend verify email when user client click resend email
 * Path: /resend-verify-email
 * Methods: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandlers(resendEmailVerifyTokenController))

/**
 * Description. Reset password
 * Path: /reset-password
 * Methods: POST
 * Header: {}
 * Body: { forgot_password_token: string, password: string, confirm_password: string }
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandlers(resetPasswordController))

usersRouter.patch('/update', accessTokenValidator, wrapRequestHandlers(updateController))
usersRouter.get('/me', getMeValidator, wrapRequestHandlers(getMeController))
usersRouter.post('/login', loginValidator, wrapRequestHandlers(loginController))
usersRouter.post('/register', registerValidator, wrapRequestHandlers(registerController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandlers(logoutController))

export default usersRouter
