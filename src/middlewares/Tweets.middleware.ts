import { checkSchema } from 'express-validator'
import { TWEETS_MESSAGES } from '~/constants/messages.constants'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType } from '~/constants/enums.constants'
import { getArrayNumberEnum } from '~/utils/others.utils'
import { validate } from '~/utils/validation.utils'
import { ErrorWithStatus } from '~/models/Errors'
import { HTTP_STATUS } from '~/constants/ErrorStatus.constants'

const tweetTypes: number[] = getArrayNumberEnum(TweetType)
const tweetAudiences: number[] = getArrayNumberEnum(TweetAudience)
const tweetMedias: number[] = getArrayNumberEnum(MediaType)

export const CheckTweetIdValidator = validate(
  checkSchema({
    tweet_id: {
      isString: true,
      custom: {
        options: (value) => {
          if (!ObjectId.isValid(value))
            throw new ErrorWithStatus({ message: TWEETS_MESSAGES.TWEET_ID_IS_VALID, status: HTTP_STATUS.UNAUTHORIZED })
          return true
        }
      }
    }
  })
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
            console.log(value)
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
            if (value.some((item: any) => ObjectId.isValid(item))) {
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
