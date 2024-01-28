import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TWEETS_MESSAGES } from '~/constants/messages.constants'
import { BookmarkReqBody, LikeReqBody, TweetReqBody } from '~/models/requests/tweet.request'
import { TokenPayload } from '~/models/requests/user.request'
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

export const getTweetController = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ result: req.tweet })
}
