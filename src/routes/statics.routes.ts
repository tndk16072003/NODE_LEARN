import { Router } from 'express'
import { serveImageController } from '~/controllers/statics.controllers'

const staticsRouter = Router()

staticsRouter.get('/uploads/images/:name', serveImageController)

export default staticsRouter
