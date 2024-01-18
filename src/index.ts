import express from 'express'
import usersRouter from './routes/users.routes'
import mediasRouter from './routes/medias.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/DefaultErrorHandler.middlewares'

const app = express()
const port = 4000
databaseService.connect()

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/medias', mediasRouter)

app.use(defaultErrorHandler) // Error Handlers
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
