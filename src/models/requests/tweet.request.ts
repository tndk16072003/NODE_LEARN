import { TweetAudience, TweetType } from '~/constants/enums.constants'
import Media from '../Others/Medias.others'

export interface TweetReqBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string
  hashtags: string[]
  mentions: string[]
  medias: Media[]
}

export interface BookmarkReqBody {
  tweet_id: string
}

export interface LikeReqBody {
  tweet_id: string
}
