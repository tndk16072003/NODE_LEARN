import express from 'express'
import usersRouter from './routes/users.routes'
import mediasRouter from './routes/medias.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/DefaultErrorHandler.middlewares'
import { initFolder } from './utils/files'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/_dir.constants'
import { config } from 'dotenv'
import path from 'path'
config()

const app = express()
const port = 4000
databaseService.connect()

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000') // Đổi thành địa chỉ trang web của bạn
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

initFolder()
app.use(process.env.UPLOAD_IMAGE_DIR as string, express.static(UPLOAD_IMAGE_DIR))
app.use(process.env.UPLOAD_VIDEO_DIR as string, express.static(UPLOAD_VIDEO_DIR))

app.use('/api/users', usersRouter)
app.use('/api/medias', mediasRouter)

app.use(defaultErrorHandler) // Error Handlers
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
