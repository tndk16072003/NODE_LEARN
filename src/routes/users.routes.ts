import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginController)
usersRouter.post('/register', registerValidator, async (req, res, next) => {
    console.log('Error Handler 1')
    // next(new Error('XUUUUUUUUUUUUUUUUUUUUUUUUUU')) // Cách 1
    // Cách 2
    // try {
    //   throw new Error('Xui thôi chế ơi!')
    // } catch (error) {
    //   next(error)
    // }
    // Cách 3
    // Promise.reject(new Error('Xui quá mấy ní3!')).catch(next)
  },
  (err, req, res, next) => {
    console.log('Lỗi là: ', err.message)
    res.status(400).json({ error: err.message })
  }
)

export default usersRouter
