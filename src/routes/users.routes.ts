import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandlers } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginController)
usersRouter.post('/register', registerValidator, wrapRequestHandlers(registerController))

export default usersRouter
