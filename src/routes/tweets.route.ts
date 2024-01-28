import { Router } from 'express'
import {
  CreateTweetController,
  bookmarkController,
  getTweetController,
  likeController
} from '~/controllers/tweets.controllers'
import {
  checkAudienceValidator,
  checkTweetIdValidator,
  createTweetValidator,
  isUserLoggedInValidator
} from '~/middlewares/Tweets.middleware'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandlers } from '~/utils/handlers.utils'

const tweetsRouter = Router()

/**
 * Description: Create tweet
 * Path: /
 * Methods: POST
 * Body: { TweetReqBody }
 */
tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createTweetValidator,
  wrapRequestHandlers(CreateTweetController)
)

/**
 * Description: Create Bookmark or delete Bookmark (if exist)
 * Path: /
 * Methods: POST
 * HeaderL { Authentication: { access_token: string } }
 * Body: { tweet_id: string }
 */
tweetsRouter.post(
  '/bookmark',
  accessTokenValidator,
  verifiedUserValidator,
  checkTweetIdValidator,
  wrapRequestHandlers(bookmarkController)
)

/**
 * Description: Create Like or delete Like (if exist)
 * Path: /
 * Methods: POST
 * HeaderL { Authentication: { access_token: string } }
 * Body: { tweet_id: string }
 */
tweetsRouter.post(
  '/like',
  accessTokenValidator,
  verifiedUserValidator,
  checkTweetIdValidator,
  wrapRequestHandlers(likeController)
)

/**
 * Description: Get tweet infomation
 * Path: /
 * Methods: POST
 * HeaderL { Authentication: { access_token: string } }
 * param: { tweet_id: string }
 */
tweetsRouter.get(
  '/:tweet_id',
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  checkTweetIdValidator,
  // checkAudienceValidator là một middleware function nên cần sử dụng wrapRequestHandlers để thông báo lỗi
  wrapRequestHandlers(checkAudienceValidator),
  wrapRequestHandlers(getTweetController)
)

export default tweetsRouter
