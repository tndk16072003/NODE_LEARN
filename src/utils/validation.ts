import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { isEmpty } from 'lodash'
import { HTTP_STATUS } from '~/constants/ErrorStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

// Nếu checkSchema có lỗi thì sẽ dừng lại và validate chạy để thông báo lỗi
// RunnableValidationChains<ValidationChain> để đồng bộ với checkSchema
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req) // xác định lỗi và lưu vào req
    const errors = validationResult(req)
    const errObject = errors.mapped()
    if (isEmpty(errObject)) return next() // nếu không có lỗi
    const entityErr = new EntityError({ errors: {} })
    for (const key in errObject) {
      const { msg } = errObject[key]
      // nếu không phải lỗi validate
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) return next(msg)
      entityErr.errors[key] = errObject[key]
    }
    return next(entityErr)
  }
}
