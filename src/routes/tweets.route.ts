import { Router } from 'express'
import { CreateBookmarkController, CreateTweetController } from '~/controllers/tweets.controllers'
import { createBookmarkValidator, createTweetValidator } from '~/middlewares/Tweets.middleware'
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
 * Description: Create Bookmark
 * Path: /
 * Methods: POST
 * HeaderL { Authentication: { access_token: string } }
 * Body: { tweet_id: string }
 */
tweetsRouter.post(
  '/bookmark',
  accessTokenValidator,
  verifiedUserValidator,
  createBookmarkValidator,
  wrapRequestHandlers(CreateBookmarkController)
)

export default tweetsRouter
