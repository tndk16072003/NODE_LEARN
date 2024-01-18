import { NextFunction, Request, Response } from 'express'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  return res.json({ message: 'Hello' })
}
