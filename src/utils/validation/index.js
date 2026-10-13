const yup = require('yup')

const errorCodes = require('./error-codes.json')
const DOMAIN_BAN_LIST = require('../../config/banned/domain.json')

yup.addMethod(yup.string, 'emailDomain', function () {
    return this.test('emailDomain', function (email) {
        const { path, createError } = this
        const atIndex = email.indexOf('@')
        const emailDomain = email.slice(atIndex + 1, email.length)

        for (let i = 0; i < DOMAIN_BAN_LIST.length; i++) {
            if (emailDomain.toLowerCase() === DOMAIN_BAN_LIST[i].toLowerCase()) {
                return createError({
                    path,
                    message: errorCodes.InvalidEmail.frontendCode
                })
            }
        }

        return true
    })
})

const string = yup
    .string(errorCodes.RequiredInput.frontendCode)

const requiredString = yup
    .string(errorCodes.InvalidInput.frontendCode)
    .required(errorCodes.RequiredInput.frontendCode)

const boolean = yup
    .boolean(errorCodes.RequiredInput.frontendCode)
const requiredBoolean = yup
    .boolean(errorCodes.RequiredInput.frontendCode)
    .required(errorCodes.RequiredInput.frontendCode)

const requiredBooleanTrue = yup
    .boolean(errorCodes.RequiredInput.frontendCode)
    .oneOf([true])
    .required(errorCodes.RequiredInput.frontendCode)

const types = {
    string,
    requiredString,
    boolean,
    requiredBooleanTrue
}

const attributes = {
    firstName: string,
    lastName: string,
    email: yup.string().emailDomain(),
    optIn: requiredBoolean,
    token: requiredString,
    title: requiredString,
    message: requiredString
}

const defineSchema = yup.object

module.exports = {
    defineSchema,
    attributes,
    types
}