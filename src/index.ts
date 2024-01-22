import express from 'express'
import usersRouter from './routes/users.routes'
import mediasRouter from './routes/medias.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/DefaultErrorHandler.middlewares'
import { initFolder } from './utils/files'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/_dir.constants'
import { config } from 'dotenv'
import staticsRouter from './routes/statics.routes'
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
app.use(`/${process.env.PREFIX_PATH_STATIC}`, staticsRouter)

app.use(defaultErrorHandler) // Error Handlers
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
