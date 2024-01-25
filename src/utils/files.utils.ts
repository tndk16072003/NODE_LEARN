import { Request } from 'express'
import { File } from 'formidable'
import fs from 'fs'
import { UPLOAD_IMAGE_DIR, UPLOAD_TEMP_DIR, UPLOAD_VIDEO_DIR } from '~/constants/_dir.constants'

export const initFolder = () => {
  const uploadFolderPaths: string[] = [UPLOAD_TEMP_DIR, UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR]
  uploadFolderPaths.forEach((uploadFolderPath) => {
    if (!fs.existsSync(uploadFolderPath)) fs.mkdirSync(uploadFolderPath, { recursive: true })
  })
}

export const handleUploadImage = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR, // Thư mục lưu file
    maxFiles: 5, // Số file tối đa được up cùng lúc
    keepExtensions: true, // Lấy cả đuôi mở rộng
    maxFileSize: 1000 * 1024, // Dung lượng tối đa cả 1 file
    maxTotalFileSize: 1000 * 1024 * 5,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = Boolean(name === 'image' && mimetype && mimetype.includes('image/'))
      if (!valid) form.emit('error' as any, new Error('Type file is not valid') as any)
      return valid
    }
  })

  // Để có thể đưa lỗi từ callback trong sang errorhandler nên dùng promise
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      if (files.image === undefined) return reject(new Error('File is empty'))
      resolve(files.image as File[])
    })
  })
}

export const getNameFile = (fullName: string) => {
  const nameArr = fullName.split('.')
  nameArr.pop()
  const newName = nameArr.join('')
  return newName
}
