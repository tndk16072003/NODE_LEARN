import { NextFunction, Request, Response } from 'express'
import mediasService from '~/services/medias.services'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const data = await mediasService.handleUploadImage(req)
  res.json({ message: 'Upload file success', result: data })
}
