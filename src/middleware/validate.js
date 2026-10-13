const { badRequest } = require('../utils/response')

const validate = (schema) => async (event) => {
  try {
    const body = JSON.parse(event.body || '{}')

    await schema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
      strict: true
    })

  } catch (validationError) {
    const errors = {}

    for (const error of validationError.inner) {
      errors[error.path] = error.errors[0]
    }

    return badRequest(errors)
  }
}

module.exports = validate