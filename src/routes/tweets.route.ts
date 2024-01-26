import { Router } from 'express'
import { CreateTweetController, bookmarkController, likeController } from '~/controllers/tweets.controllers'
import { CheckTweetIdValidator, createTweetValidator } from '~/middlewares/Tweets.middleware'
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
  CheckTweetIdValidator,
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
  CheckTweetIdValidator,
  wrapRequestHandlers(likeController)
)

export default tweetsRouter
