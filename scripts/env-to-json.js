const fs = require('fs')

const dotenv = require('dotenv')
const env = dotenv.parse(fs.readFileSync('.env'))

const functions = [
]

const output = functions.reduce((acc, fn) => {
  acc[fn] = env
  return acc
}, {})

fs.writeFileSync('env.json', JSON.stringify(output, null, 2))