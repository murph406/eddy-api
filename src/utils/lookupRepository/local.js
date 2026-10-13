import fs from 'fs/promises'
import path from 'path'

const READ_PATH = path.resolve(process.cwd(), 'data')
const WRITE_PATH = path.resolve(process.cwd(), 'data')

export const readJSON = async (key) => {
  try {
    const filePath = path.join(READ_PATH, key)
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    if (err.code === 'ENOENT') return null
    throw err
  }
}

export const writeJSON = async (key, data) => {
  const filePath = path.join(WRITE_PATH, key)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

export const invalidate = async (paths) => {
  console.log('[local] CloudFront invalidation skipped for:', paths)
}