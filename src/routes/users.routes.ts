import { Request, Router } from 'express'
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
  resetPasswordController,
  followController,
  unfollowController,
  changePasswordController,
  oauthGoogleController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  getMeValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { updateReqBody } from '~/models/requests/user.requests'
import { wrapRequestHandlers } from '~/utils/handlers'

const usersRouter = Router()

/**
 * Description: Verify email when user client click on the link verify email
 * Path: /verify-email
 * Methods: POST
 * Body: { 'email_verify_token': string }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandlers(verifyEmailController))

/**
 * Description: Resend verify email when user client click resend email
 * Path: /resend-verify-email
 * Methods: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandlers(resendEmailVerifyTokenController))

/**
 * Description: Form input email to forgot password & Resend email forgot password
 * Path: /forgot-password
 * Methods: POST
 * Body: { email: string }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandlers(forgotPasswordController))

/**
 * Description: Verify forgot_password_token
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
 * Description: Follow someone
 * Path: /follow
 * Methods: POST
 * Header: { authorization: Bearer { access_token } }
 * Body: { followed_user_id: string }
 */
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandlers(followController)
)

/**
 * Description: unFollow someone
 * Path: /follow/:user_id
 * Methods: DELETE
 * Header: { authorization: Bearer { access_token }, followed_user_id: string }
 */
usersRouter.delete('/follow/:user_id', accessTokenValidator, unfollowValidator, wrapRequestHandlers(unfollowController))

/**
 * Description: Resend verify email when user client click resend email
 * Path: /resend-verify-email
 * Methods: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandlers(resendEmailVerifyTokenController))

/**
 * Description: Reset password
 * Path: /reset-password
 * Methods: POST
 * Header: {}
 * Body: { forgot_password_token: string, password: string, confirm_password: string }
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandlers(resetPasswordController))

/**
 * Description: Change password
 * Path: /reset-password
 * Methods: POST
 * Header: { authorization: Bearer { access_token } }
 * Body: { old_password: string, password: string, confirm_password: string }
 */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandlers(changePasswordController)
)

/**
 * Description: Update my profile
 * Path: /me
 * Methods: PATH
 * Header: {}
 * Body: UserSchema
 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateValidator,
  filterMiddleware<updateReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'username',
    'website',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandlers(updateController)
)

/**
 * Description: OAuth Google
 * Path: /oauth/google
 * Methods: GET
 * Header: {}
 * Body: {}
 * Query: { code: string }
 */
usersRouter.get('/oauth/google', wrapRequestHandlers(oauthGoogleController))

usersRouter.get('/me', getMeValidator, wrapRequestHandlers(getMeController))
usersRouter.post('/login', loginValidator, wrapRequestHandlers(loginController))

usersRouter.post('/register', registerValidator, wrapRequestHandlers(registerController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandlers(logoutController))

export default usersRouter
