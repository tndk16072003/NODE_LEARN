import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR, UPLOAD_TEMP_DIR } from '~/constants/_dir.constants'
import { getNameFile, handleUploadImage } from '~/utils/files'
import fsPromise from 'fs/promises'
import fs from 'fs'
import { isProductions } from '~/constants/config.constants'
import { config } from 'dotenv'
import { MediaType } from '~/constants/enums.constants'
import Media from '~/models/Others/Medias.others'
config()

class MediasService {
  async handleUploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFile(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
        await sharp(file.filepath).clone().jpeg().toFile(newPath)
        // Bug delete file on directory temps
        return {
          url: isProductions
            ? `${process.env.HOST}/${process.env.PREFIX_PATH_STATIC}/${process.env.UPLOAD_IMAGE_DIR}/${newName}.jpg`
            : `http://localhost:${process.env.PORT}/${process.env.PREFIX_PATH_STATIC}/${process.env.UPLOAD_IMAGE_DIR}/${newName}.jpg`,
          type: MediaType.Image
        }
      })
    )
    return result
  }
}

const mediasService = new MediasService()

export default mediasService
