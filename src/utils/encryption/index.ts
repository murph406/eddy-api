import { createCipheriv, createDecipheriv, createHmac, hkdfSync, randomBytes } from 'node:crypto'

const secret = process.env.ENCRYPT_SECRET
if (!secret) throw new Error('ENCRYPT_SECRET is not set')

const master = Buffer.from(secret, 'hex')
const encKey = Buffer.from(hkdfSync('sha256', master, '', 'field-encryption', 32))
const idxKey = Buffer.from(hkdfSync('sha256', master, '', 'blind-index', 32))

export const encrypt = (plainText: string, field: string): string => {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', encKey, iv)
  cipher.setAAD(Buffer.from(field)) 

  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()])

  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64')
}

export const decrypt = (payload: string, field: string): string => {
  const buf = Buffer.from(payload, 'base64')
  const decipher = createDecipheriv('aes-256-gcm', encKey, buf.subarray(0, 12))

  decipher.setAAD(Buffer.from(field))
  decipher.setAuthTag(buf.subarray(12, 28))

  return Buffer.concat([decipher.update(buf.subarray(28)), decipher.final()]).toString('utf8')
}

export const blindIndex = (plainText: string, field: string): string => createHmac('sha256', idxKey).update(`${field}:${plainText.trim().toLowerCase()}`).digest('hex')
