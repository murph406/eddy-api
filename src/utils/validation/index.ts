import * as yup from 'yup'

import errorCodes from './error-codes.json'
import DOMAIN_BAN_LIST from '../../config/banned/domain.json'

declare module 'yup' {
    interface StringSchema<TType, TContext, TDefault, TFlags> {
        emailDomain(): this
    }
}

yup.addMethod(yup.string, 'emailDomain', function () {
    return this.test('emailDomain', function (email) {
        if (!email) return true

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
    .string()
    .typeError(errorCodes.RequiredInput.frontendCode)

const requiredString = yup
    .string()
    .typeError(errorCodes.InvalidInput.frontendCode)
    .required(errorCodes.RequiredInput.frontendCode)

const boolean = yup
    .boolean()
    .typeError(errorCodes.RequiredInput.frontendCode)

const requiredBoolean = yup
    .boolean()
    .typeError(errorCodes.RequiredInput.frontendCode)
    .required(errorCodes.RequiredInput.frontendCode)

const requiredBooleanTrue = yup
    .boolean()
    .typeError(errorCodes.RequiredInput.frontendCode)
    .oneOf([true])
    .required(errorCodes.RequiredInput.frontendCode)

export const types = {
    string,
    requiredString,
    boolean,
    requiredBooleanTrue
}

export const attributes = {
    firstName: string,
    lastName: string,
    email: yup.string().emailDomain(),
    optIn: requiredBoolean,
    token: requiredString,
    title: requiredString,
    message: requiredString
}

export const defineSchema = yup.object