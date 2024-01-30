import express from 'express'
import usersRouter from './routes/users.route'
import mediasRouter from './routes/medias.route'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/DefaultErrorHandler.middlewares'
import { initFolder } from './utils/files.utils'
import { config } from 'dotenv'
import staticsRouter from './routes/statics.route'
import tweetsRouter from './routes/tweets.route'
import { MediaType, TweetAudience, TweetType } from './constants/enums.constants'
import { ObjectId } from 'mongodb'
import Tweet from './models/schemas/tweets.schema'
import Media from './models/Others/Medias.others'
config()

const app = express()
databaseService.connect()

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000') // Đổi thành địa chỉ trang web của bạn
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

initFolder()
// app.use(`/${process.env.PREFIX_PATH_STATIC}/${process.env.UPLOAD_IMAGE_DIR}/`, express.static(UPLOAD_IMAGE_DIR))
// app.use(`/${process.env.PREFIX_PATH_STATIC}/${process.env.UPLOAD_VIDEO_DIR}/`, express.static(UPLOAD_VIDEO_DIR))

app.use('/api/users', usersRouter)
app.use('/api/medias', mediasRouter)
app.use('/api/tweets', tweetsRouter)
app.use(`/${process.env.PREFIX_PATH_STATIC}`, staticsRouter)

app.use(defaultErrorHandler) // Error Handlers
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})

// for (let i: number = 0; i < 8; i++) {
//   databaseService.tweets.insertOne(
//     new Tweet({
//       user_id: new ObjectId('65b5bf3673b4355b1ddd4179'),
//       type: TweetType.QuoteTweet,
//       audience: TweetAudience.Everyone,
//       content: 'Quote tweet ' + (i + 1) + '',
//       parent_id: new ObjectId('65b5d8d559af548c8d44efcb'),
//       hashtags: [],
//       mentions: [],
//       medias: []
//     })
//   )
// }

// for (let i: number = 0; i < 13; i++) {
//   databaseService.tweets.insertOne(
//     new Tweet({
//       user_id: new ObjectId('65b5bf3673b4355b1ddd4179'),
//       type: TweetType.Retweet,
//       audience: TweetAudience.Everyone,
//       content: '',
//       parent_id: new ObjectId('65b5d8d559af548c8d44efcb'),
//       hashtags: [],
//       mentions: [],
//       medias: []
//     })
//   )
// }
// databaseService.tweets.insertOne(
//   new Tweet({
//     user_id: new ObjectId('65b5bf3673b4355b1ddd4179'),
//     type: TweetType.Comment,
//     audience: TweetAudience.Everyone,
//     content: 'Comment 11',
//     parent_id: new ObjectId('65b5d8d559af548c8d44efcb'),
//     hashtags: [],
//     mentions: [new ObjectId('65b5c1e83e98e8586590347e'), new ObjectId('65b5bf7f73b4355b1ddd417b')],
//     medias: [new Media({ url: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.mp4', type: MediaType.Video })]
//   })
// )
