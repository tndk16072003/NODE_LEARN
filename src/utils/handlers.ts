import { NextFunction, Request, RequestHandler, Response } from 'express'

export const wrapRequestHandlers = (fun: RequestHandler) => {
  // cần trả về requestHandlers phù hợp với quy định của methods
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fun(req, res, next)
    } catch (error) {
      next(error) // Nếu có lỗi đẩy thẳng đên Error Handler
    }
  }
}
