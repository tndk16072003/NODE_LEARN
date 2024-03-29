import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

export const wrapRequestHandlers = (fun: RequestHandler<any, any, any, any>) => {
  // cần trả về requestHandlers phù hợp với quy định của methods
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fun(req, res, next)
    } catch (error) {
      next(error) // Nếu có lỗi đẩy thẳng đên Error Handler
    }
  }
}
