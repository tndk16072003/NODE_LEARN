import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { TWEETS_MESSAGES, USERS_MESSAGES } from '~/constants/messages.constants'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType, UserVerifyStatus } from '~/constants/enums.constants'
import { getArrayNumberEnum } from '~/utils/others.utils'
import { validate } from '~/utils/validation.utils'
import { ErrorWithStatus } from '~/models/Errors'
import { HTTP_STATUS } from '~/constants/ErrorStatus.constants'
import databaseService from '~/services/database.services'
import Tweet from '~/models/schemas/tweets.schema'
import { wrapRequestHandlers } from '~/utils/handlers.utils'
import { TokenPayload } from '~/models/requests/user.request'

const tweetTypes: number[] = getArrayNumberEnum(TweetType)
const tweetAudiences: number[] = getArrayNumberEnum(TweetAudience)
const tweetMedias: number[] = getArrayNumberEnum(MediaType)

export const isUserLoggedInValidator = (nextMiddleware: (req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) return nextMiddleware(req, res, next)
    next()
  }
}

export const checkTweetIdValidator = validate(
  checkSchema(
    {
      tweet_id: {
        isString: true,
        custom: {
          options: async (value, { req }) => {
            if (!ObjectId.isValid(value))
              throw new ErrorWithStatus({
                message: TWEETS_MESSAGES.TWEET_ID_IS_VALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            const [tweet] = await databaseService.tweets
              .aggregate<Tweet>([
                {
                  $match: {
                    _id: new ObjectId(value)
                  }
                },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'mentions',
                    foreignField: '_id',
                    as: 'mentions'
                  }
                },
                {
                  $lookup: {
                    from: 'hashtags',
                    localField: 'hashtags',
                    foreignField: '_id',
                    as: 'hashtags'
                  }
                },
                {
                  $lookup: {
                    from: 'tweets',
                    localField: '_id',
                    foreignField: 'parent_id',
                    as: 'tweet_children'
                  }
                },
                {
                  $addFields: {
                    mentions: {
                      $map: {
                        input: '$mentions',
                        as: 'mention',
                        in: {
                          name: '$$mention.name',
                          email: '$$mention.email'
                        }
                      }
                    },
                    retweet_count: {
                      $size: {
                        $filter: {
                          input: '$tweet_children',
                          as: 'children',
                          cond: {
                            $eq: ['$$children.type', 1]
                          }
                        }
                      }
                    },
                    comment_count: {
                      $size: {
                        $filter: {
                          input: '$tweet_children',
                          as: 'children',
                          cond: {
                            $eq: ['$$children.type', 2]
                          }
                        }
                      }
                    },
                    quote_count: {
                      $size: {
                        $filter: {
                          input: '$tweet_children',
                          as: 'children',
                          cond: {
                            $eq: ['$$children.type', 3]
                          }
                        }
                      }
                    },
                    sum_tweet: {
                      $add: ['$guest_views', '$user_views']
                    }
                  }
                },
                {
                  $project: {
                    tweet_children: 0
                  }
                }
              ])
              .toArray()
            if (!tweet)
              throw new ErrorWithStatus({ message: TWEETS_MESSAGES.TWEET_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
            ;(req as Request).tweet = tweet
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)

export const createTweetValidator = validate(
  checkSchema(
    {
      type: {
        isIn: {
          options: [tweetTypes],
          errorMessage: TWEETS_MESSAGES.INVALID_TYPE
        }
      },
      audience: {
        isIn: {
          options: [tweetAudiences],
          errorMessage: TWEETS_MESSAGES.INVALID_AUDICENCE
        }
      },
      parent_id: {
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as TweetType
            const parent_id = req.body.parent_id
            // Nếu 'type' là retweet, comment và quotetweet thì 'parent_id' phải là '_id' của tweet cha
            if (
              [TweetType.Retweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) &&
              !ObjectId.isValid(value)
            ) {
              throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_A_VALID_TWEET_ID)
            }
            // nếu 'type' là tweet thì 'parent_id' phải là null
            if (type === TweetType.Tweet && parent_id !== null) throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_NULL)
            return true
          }
        }
      },
      content: {
        // trim: true,
        isString: true,
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as TweetType
            const mentions = req.body.mentions as string[]
            const hashtags = req.body.hashtags as string[]
            // Nếu 'type' là comment, quotetweet, tweet và không có 'mentions' và 'hashtags'
            // thì 'content' phải là string và không được rỗng
            if (
              [TweetType.Tweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) &&
              isEmpty(mentions) &&
              isEmpty(hashtags) &&
              value === ''
            )
              throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_A_NON_EMPTY_STRING)
            // Nếu type là 'retweet' thì 'content' phải là ''
            if (type === TweetType.Retweet && value !== '')
              throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_EMPTY_STRING)
            return true
          }
        }
      },
      hashtags: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            if (value.some((item: any) => typeof item !== 'string')) {
              throw new Error(TWEETS_MESSAGES.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING)
            }
            return true
          }
        }
      },
      mentions: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            if (!value.some((item: any) => ObjectId.isValid(item))) {
              throw new Error(TWEETS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
            }
            return true
          }
        }
      },
      medias: {
        isArray: true,
        custom: {
          options: (value) => {
            // Yêu cầu mỗi phần tử trong array là một Media Object
            if (value.some((item: any) => typeof item.url !== 'string' || !tweetMedias.includes(item.type))) {
              throw new Error(TWEETS_MESSAGES.MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const checkAudienceValidator = async (req: Request, res: Response, next: NextFunction) => {
  const tweet = req.tweet as Tweet
  if (tweet.audience === TweetAudience.TwitterCircle) {
    // Kiểm tra người xem đăng nhập
    if (!req.headers.authorization)
      throw new ErrorWithStatus({ message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED, status: HTTP_STATUS.UNAUTHORIZED })
    // Kiểm tra tình trạng tài khoản tác giả
    const author = await databaseService.users.findOne({ _id: new ObjectId(tweet.user_id) })
    if (!author || author.verify === UserVerifyStatus.Banned)
      throw new ErrorWithStatus({ message: USERS_MESSAGES.USER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    // Kiểm tra user đang yêu cầu có nằm trong twitter_circle không? Hoặc có phải là tác giả hay không
    const { userId } = req.decoded_authorization as TokenPayload
    const isInTweeterCircle = author.twitter_circle.some((twitter_circle_id) => twitter_circle_id.equals(userId))
    if (!isInTweeterCircle && !author._id.equals(userId))
      throw new ErrorWithStatus({ message: TWEETS_MESSAGES.TWEET_IS_NOT_PUBLIC, status: HTTP_STATUS.FORBIDDEN })
  }
  next()
}
