import { TweetReqBody } from '~/models/requests/tweet.request'
import databaseService from './database.services'
import { ObjectId, WithId } from 'mongodb'
import Tweet from '~/models/schemas/tweets.schema'
import Hashtag from '~/models/schemas/hashtags.schema'
import { BookMark } from '~/models/schemas/bookMark.schema'
import { TWEETS_MESSAGES } from '~/constants/messages.constants'
import { Like } from '~/models/schemas/likes.schema'

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
}

const tweetsServices = new TweetsServices()
export default tweetsServices
