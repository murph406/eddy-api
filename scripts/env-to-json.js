import fs from 'fs'

import dotenv from 'dotenv'

const env = dotenv.parse(fs.readFileSync('.env'))

const functions = [
  'HealthFunction',
  'ChatFunction',
]

const output = functions.reduce((acc, fn) => {
  acc[fn] = env
  return acc
}, {})

fs.writeFileSync('env.json', JSON.stringify(output, null, 2))