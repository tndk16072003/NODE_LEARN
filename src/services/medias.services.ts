import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/_dir.constants'
import { getNameFile, handleUploadSingleImage } from '~/utils/files'
import fsPromise from 'fs/promises'
import fs from 'fs'
import { isProductions } from '~/constants/config.constants'
import { config } from 'dotenv'
config()

class MediasService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newName = getNameFile(file.newFilename)
    const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
    await sharp(file.filepath).clone().jpeg().toFile(newPath)
    // try {
    //   fs.unlinkSync(file.filepath)
    // } catch (e) {
    //   console.log(e)
    // }
    return isProductions
      ? `${process.env.HOST}${process.env.UPLOAD_IMAGE_DIR}${newName}.jpg`
      : `http://localhost:${process.env.PORT}${process.env.UPLOAD_IMAGE_DIR}${newName}.jpg`
  }
}

const mediasService = new MediasService()

export default mediasService
