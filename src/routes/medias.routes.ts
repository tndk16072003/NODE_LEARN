import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controllers'
import { wrapRequestHandlers } from '~/utils/handlers'

const mediasRouter = Router()

mediasRouter.post('/upload-image', wrapRequestHandlers(uploadSingleImageController))

export default mediasRouter
