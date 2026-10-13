const bcrypt = require('bcryptjs')
const {
  EncryptedField,
  BlindIndex,
  CipherSweet,
  StringProvider,
} = require('ciphersweet-js')

const TABLE = 'STRING'

let engine

const getEngine = () => {
  if (!engine) {
    const provider = new StringProvider(process.env.EncryptSecret)
    engine = new CipherSweet(provider)
  }
  return engine
}

const getField = (field) => new EncryptedField(getEngine(), TABLE, field)

const getFieldWithIndex = (field) =>
  new EncryptedField(getEngine(), TABLE, field)
    .addBlindIndex(new BlindIndex(field, [], 32))

const encryptWithIndex = async (plainText, field) => {
  const [encryptedText, indexes] = await getFieldWithIndex(field).prepareForStorage(plainText)
  return { encryptedText, index: indexes[field] }
}

const encrypt = async (plainText, field) => {
  if (!plainText) return { encryptedText: null }
  const [encryptedText] = await getField(field).prepareForStorage(plainText)
  return { encryptedText }
}

const decrypt = async (encryptedText, field) => {
  if (!encryptedText) return { plainText: null }
  const decrypted = await getField(field).decryptValue(encryptedText)
  return { plainText: decrypted.toString() }
}

const hashString = (plainText) => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(plainText, salt)
}

const verifyHash = (plainText, hash) => bcrypt.compareSync(plainText, hash)

module.exports = { encryptWithIndex, encrypt, decrypt, hashString, verifyHash }