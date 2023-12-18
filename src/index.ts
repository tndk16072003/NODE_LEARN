import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/DefaultErrorHandler.middlewares'

const app = express()
const port = 3000
databaseService.connect()

app.use(express.json())

app.use('/users', usersRouter)

app.use(defaultErrorHandler) // Error Handlers
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
