import { TweetReqBody } from '~/models/requests/tweet.request'
import databaseService from './database.services'
import { ObjectId, WithId } from 'mongodb'
import Tweet from '~/models/schemas/tweets.schema'
import Hashtag from '~/models/schemas/hashtags.schema'
import { BookMark } from '~/models/schemas/bookMark.schema'
import { TWEETS_MESSAGES } from '~/constants/messages.constants'
import { Like } from '~/models/schemas/likes.schema'
import { TweetType } from '~/constants/enums.constants'

class TweetsServices {
  async CheckToGetOrCreatHashTag(hashtags: string[]) {
    const result = await Promise.all(
      hashtags.map(async (item) => {
        const hashtagDocuments = await databaseService.hashtags.findOneAndUpdate(
          {
            name: item
          },
          {
            $setOnInsert: new Hashtag({ name: item })
          },
          {
            upsert: true, // cho phép thực hiện cập nhật (nếu có) hoặc thêm mới (nếu không)
            returnDocument: 'after' // Lấy dữ liệu từ object vừa tạo xong
          }
        )
        return new ObjectId((hashtagDocuments as WithId<Hashtag>)._id)
      })
    )
    return result
  }

  async CreateTweets(userId: string, body: TweetReqBody) {
    const hashtags = await this.CheckToGetOrCreatHashTag(body.hashtags)
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        user_id: new ObjectId(userId),
        type: body.type,
        audience: body.audience,
        content: body.content,
        parent_id: body.parent_id ? new ObjectId(body.parent_id) : null,
        hashtags,
        mentions: body.mentions.map((item) => new ObjectId(item)),
        medias: body.medias
      })
    )
    const tweet = await databaseService.tweets.findOne({ _id: result.insertedId })
    return tweet
  }

  async bookmark(user_id: string, tweet_id: string) {
    const objectIdTweetId = new ObjectId(tweet_id)
    const objectIdUserId = new ObjectId(user_id)
    // Nếu chưa có thì tạo. Có rồi thì xóa
    const checkBookmarkExist = await databaseService.bookmarks.findOne({
      tweet_id: objectIdTweetId,
      user_id: objectIdUserId
    })
    console.log(checkBookmarkExist)
    if (checkBookmarkExist !== null) {
      await databaseService.bookmarks.deleteOne({
        tweet_id: objectIdTweetId,
        user_id: objectIdUserId
      })
      return { message: TWEETS_MESSAGES.UNBOOKMARK_SUCCESSFULLY }
    } else {
      const data = await databaseService.bookmarks.insertOne(
        new BookMark({ tweet_id: objectIdTweetId, user_id: objectIdUserId })
      )
      const bookmark = await databaseService.bookmarks.findOne({ _id: data.insertedId })
      return { message: TWEETS_MESSAGES.BOOKMARK_SUCCESSFULLY, bookmark }
    }
  }

  async like(user_id: string, tweet_id: string) {
    const objectIdTweetId = new ObjectId(tweet_id)
    const objectIdUserId = new ObjectId(user_id)
    // Nếu chưa có thì tạo. Có rồi thì xóa
    const checkLikeExist = await databaseService.likes.findOne({
      tweet_id: objectIdTweetId,
      user_id: objectIdUserId
    })
    if (checkLikeExist !== null) {
      await databaseService.likes.deleteOne({
        tweet_id: objectIdTweetId,
        user_id: objectIdUserId
      })
      return { message: TWEETS_MESSAGES.UNLIKE_SUCCESSFULLY }
    } else {
      const data = await databaseService.likes.insertOne(
        new Like({ tweet_id: objectIdTweetId, user_id: objectIdUserId })
      )
      const like = await databaseService.likes.findOne({ _id: data.insertedId })
      return { message: TWEETS_MESSAGES.LIKE_SUCCESSFULLY, like }
    }
  }

  async increaseViews(tweet_id: string, user_id?: string) {
    const increase = user_id ? { user_views: 1 } : { guest_views: 1 }
    const resurlt = await databaseService.tweets.findOneAndUpdate(
      { _id: new ObjectId(tweet_id) },
      {
        $inc: increase,
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          user_views: true,
          guest_views: true,
          updated_at: true
        }
      }
    )
    return resurlt as WithId<{ user_views: number; guest_views: number; updated_at: Date }>
  }

  async getTweetChildren({
    limit,
    page,
    tweet_type,
    tweet_id,
    userId
  }: {
    limit: number
    page: number
    tweet_type: TweetType
    tweet_id: string
    userId?: string
  }) {
    const tweet_childrens = await databaseService.tweets
      .aggregate<Tweet>([
        {
          $match: {
            parent_id: new ObjectId(tweet_id),
            type: tweet_type
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
                    $eq: ['$$children.type', TweetType.Retweet]
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
                    $eq: ['$$children.type', TweetType.Comment]
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
                    $eq: ['$$children.type', TweetType.QuoteTweet]
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
        },
        {
          $skip: limit * (page - 1)
        },
        {
          $limit: limit
        }
      ])
      .toArray()
    const ids = tweet_childrens.map((item) => item._id)
    const date = new Date()
    const inc = userId ? { user_views: 1 } : { guest_views: 1 }
    const [total] = await Promise.all([
      databaseService.tweets.countDocuments({ parent_id: new ObjectId(tweet_id), type: tweet_type }),
      databaseService.tweets.updateMany(
        {
          _id: {
            $in: ids
          }
        },
        {
          $inc: inc,
          $set: {
            updated_at: date
          }
        }
      )
    ])
    tweet_childrens.forEach((element) => {
      element.updated_at = date
      if (userId) element.user_views += 1
      else element.guest_views += 1
    })
    return { tweet_childrens, total }
  }
}

const tweetsServices = new TweetsServices()
export default tweetsServices
