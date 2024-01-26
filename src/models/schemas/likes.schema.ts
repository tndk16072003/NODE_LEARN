import { ObjectId } from 'mongodb'

interface LikeType {
  _id?: ObjectId
  tweet_id: ObjectId
  user_id: ObjectId
  created_at?: Date
}

export class Like {
  _id?: ObjectId
  tweet_id: ObjectId
  user_id: ObjectId
  created_at: Date

  constructor({ _id, tweet_id, user_id, created_at }: LikeType) {
    this._id = _id
    this.tweet_id = tweet_id
    this.user_id = user_id
    this.created_at = created_at || new Date()
  }
}
