import { createHash } from 'node:crypto'

function sha256(content: string) {
  return createHash('sha3-256').update(content).digest('hex')
}

export function hashPassword(password: string) {
  return sha256(password + process.env.DB_SECRET_KEY)
}
