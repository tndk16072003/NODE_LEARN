import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetType } from '~/constants/enums.constants'
import { TWEETS_MESSAGES } from '~/constants/messages.constants'
import {
  BookmarkReqBody,
  LikeReqBody,
  TweetReqBody,
  getTweetChildrenReqParams,
  getTweetChildrenReqQuerys
} from '~/models/requests/tweet.request'
import { TokenPayload } from '~/models/requests/user.request'
import Tweet from '~/models/schemas/tweets.schema'
import tweetsServices from '~/services/tweets.services'

export const CreateTweetController = async (
  req: Request<ParamsDictionary, any, TweetReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const body = req.body
  const result = await tweetsServices.CreateTweets(userId, body)
  res.json({ message: TWEETS_MESSAGES.CREATE_TWEET_SUCCESSFULLY, result })
}

export const bookmarkController = async (
  req: Request<ParamsDictionary, any, BookmarkReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const { tweet_id } = req.body
  const result = await tweetsServices.bookmark(userId, tweet_id)
  res.json(result)
}

export const likeController = async (
  req: Request<ParamsDictionary, any, LikeReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const { tweet_id } = req.body
  const result = await tweetsServices.like(userId, tweet_id)
  res.json(result)
}

export const getTweetChildrenController = async (
  req: Request<getTweetChildrenReqParams, any, any, getTweetChildrenReqQuerys>,
  res: Response,
  next: NextFunction
) => {
  const tweet_id = req.params.tweet_id
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const tweet_type = Number(req.query.tweet_type) as TweetType
  const { userId } = req.decoded_authorization as TokenPayload
  const result = await tweetsServices.getTweetChildren({ limit, page, tweet_type, tweet_id, userId })
  return res.json({
    tweet_childrens: result.tweet_childrens,
    total: result.total,
    limit,
    page,
    tweet_type
  })
}

export const getTweetController = async (req: Request, res: Response, next: NextFunction) => {
  const tweet = req.tweet as Tweet
  const increaseResult = await tweetsServices.increaseViews(tweet._id.toString(), req.decoded_authorization?.userId)
  const result = {
    ...tweet,
    guest_views: increaseResult.guest_views,
    user_views: increaseResult.user_views,
    updated_at: increaseResult.updated_at
  }
  res.json({ result })
}
