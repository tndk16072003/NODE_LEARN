export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_2_TO_30: 'Name must be 2-30 characters long',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_OR_PASSWORD_IS_WRONG: 'Email or password is wrong',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_MUST_BE_STRONG:
    'Password must be 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_IS_THE_SAME_AS_THE_PASSWORD: 'Confirm password must be the same as the password',
  DATE_OF_BIRTH_IS_INVALID: 'Date of birth is invalid',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Refresh token is used or does not exist',
  LOGOUT_SUCCESS: 'Logout success',
  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'Register success',
  GET_ME_SUCCESS: 'Get profile success',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  USED_EMAIL_VERIFY_TOKEN_OR_NOT_EXIST: 'Email verify token is used or does not exist',
  USER_NOT_FOUND: 'User not found',
  FOLLOWED_USER_NOT_FOUND: 'Followed user not found',
  EMAIL_ALREADY_VERIFY_BEFORE: 'Email already verify before',
  EMAIL_VERIFY_SUCCESS: 'Email verify success',
  RESEND_EMAIL_VERIFY_SUCCESS: 'Resend email verify success',
  CHECK_EMAIL_TO_RESET_PASSWORD_SUCCESS: 'Check email to reset password success',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  FORGOT_PASSWORD_TOKEN_IS_INVALID: 'Forgot password token is invalid',
  RESET_PASSWORD_IS_SUCCESS: 'Reset password is success',
  USER_NOT_VERIFIED: 'User not verified',
  FOLLOWED_USER_NOT_VERIFIED: 'Followed User not verified',
  BIO_MUST_BE_STRING: 'Bio must be string',
  BIO_LENGTH: 'Bio length must be from 1 to 200 characters',
  LOCATION_MUST_BE_STRING: 'Location must be string',
  LOCATION_LENGTH: 'Location length must be from 1 to 200 characters',
  WEBSITE_MUST_BE_STRING: 'Website must be string',
  WEBSITE_LENGTH: 'Website length must be from 1 to 200 characters',
  USERNAME_MUST_BE_STRING: 'Username must be string',
  USERNAME_LENGTH: 'Username length must be from 4 to 50 characters',
  IMAGE_MUST_BE_STRING: 'Image must be string',
  IMAGE_LENGTH: 'Image length must be from 1 to 400 characters',
  UPDATE_PROFILE_SUCCESS: 'Update profile success',
  USER_ID_IS_INVALID: 'Followed user id is invalid',
  FOLLOW_SUCCESS: 'Follow success',
  UNFOLLOW_SUCCESS: 'Unfollow success',
  USERNAME_IS_INVALID: 'Username is invalid',
  USERNAME_ALREADY_EXISTS: 'Username already exists',
  OLD_PASSWORD_NOT_MATCH: 'Old password not match',
  CHANGE_PASSWORD_SUCCESS: 'Change password success',
  GMAIL_NOT_VERIFIED: 'Gmail not verified'
} as const