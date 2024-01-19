import { NextFunction, Request, Response, request } from 'express'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  TokenPayload,
  followReqBody,
  forgotPasswordReqBody,
  loginReqBody,
  logoutReqBody,
  registerReqBody,
  resetPasswordTokenReqBody,
  UnfollowReqParams,
  verifyEmailTokenReqBody,
  verifyForgotPasswordTokenReqBody,
  changePasswordReqBody
} from '~/models/requests/user.requests'
import { User } from '~/models/schemas/user.schema'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { HTTP_STATUS } from '~/constants/ErrorStatus'
import { UserVerifyStatus } from '~/constants/enums.constants'
import { hashPassword } from '~/utils/cryptos'
import { config } from 'dotenv'
config()

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, changePasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const { password } = req.body
  const result = await usersService.changePassword(userId, password)
  return res.json(result)
}

export const unfollowController = async (req: Request<UnfollowReqParams>, res: Response, next: NextFunction) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const { user_id: followed_user_id } = req.params
  const result = await usersService.unfollow(userId, followed_user_id)
  return res.json(result)
}

export const followController = async (
  req: Request<ParamsDictionary, any, followReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const { followed_user_id } = req.body
  const result = await usersService.follow(userId, followed_user_id)
  return res.json(result)
}

export const updateController = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const { body } = req
  const result = await usersService.updateProfile(userId, body)
  return res.json({ message: USERS_MESSAGES.UPDATE_PROFILE_SUCCESS, result: result })
}
export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, resetPasswordTokenReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  const result = await usersService.resetPassword(userId, password)
  return res.json(result)
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, resetPasswordTokenReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.decoded_forgot_password_token as TokenPayload
  return res.json({
    message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD_SUCCESS
  })
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, forgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id, verify } = req.user as User
  const result = await usersService.forgotPassword({ userId: _id.toString(), verify })

  return res.json(result)
}

export const resendEmailVerifyTokenController = async (
  req: Request<ParamsDictionary, any, verifyEmailTokenReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(userId) })

  if (!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGES.USER_NOT_FOUND })

  if (user.verify === UserVerifyStatus.Verified)
    return res.json({ message: USERS_MESSAGES.EMAIL_ALREADY_VERIFY_BEFORE })

  const result = await usersService.resendVerifyEmail(userId)

  return res.json(result)
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, verifyForgotPasswordTokenReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(userId) })

  if (!user) return res.json({ message: USERS_MESSAGES.USER_NOT_FOUND })
  if (user.email_verify_token === '')
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFY_BEFORE
    })

  const result = await usersService.verifyEmail(user._id.toString())
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result: result
  })
}

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const user = await usersService.getMe(userId)
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    result: user
  })
}

export const oauthFacebookController = async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.query

  const result = await usersService.oauthFacebook(code as string)
  const urlCallBack = `${process.env.CLIENT_URL_CALL_BACK}?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}&newUser=${result.newUser}`
  console.log(urlCallBack)
  return res.redirect(urlCallBack)
}

export const oauthGoogleController = async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.query
  const result = await usersService.oauth(code as string)
  const urlCallBack = `${process.env.CLIENT_URL_CALL_BACK}?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}&newUser=${result.newUser}`
  console.log(urlCallBack)

  return res.redirect(urlCallBack)
}

export const loginController = async (
  req: Request<ParamsDictionary, any, loginReqBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User
  const { _id, verify } = user
  const { password } = req.body
  if (hashPassword(password) !== user.password) throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_WRONG)
  const result = await usersService.login({ userId: _id.toString(), verify })
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result: result
  })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, logoutReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token }: any = req.body
  const result = await usersService.logout(refresh_token)
  return res.json({
    message: result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, registerReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result: result
  })
}
