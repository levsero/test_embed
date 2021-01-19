const maxEmailSize = 128

// Email regular expression from http://emailregex.com/
export const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line

const validateType = {
  text: ({ field, value, errorLabels }) => {
    if (field.minSize !== undefined) {
      if (value.length < field.minSize) {
        return errorLabels.fieldMinSize(field.minSize)
      }
    }

    if (field.maxSize !== undefined) {
      if (value.length > field.maxSize) {
        return errorLabels.fieldMaxSize(field.maxSize)
      }
    }
  },
  email: ({ value, errorLabels }) => {
    if (!EMAIL_PATTERN.test(value)) {
      return errorLabels.invalidEmail
    }

    if (value.length > maxEmailSize) {
      return errorLabels.invalidEmail
    }
  }
}

const validateFields = (fields, values, errorLabels) => {
  const errors = {}

  fields.forEach(field => {
    const value = values[field._id]

    if (!value) {
      errors[field._id] = errorLabels.requiredField
      return
    }

    if (typeof value === 'string' && value.trim() === '') {
      errors[field._id] = errorLabels.requiredField
      return
    }

    const error = validateType[field.type]?.({ field, value, errorLabels })
    if (error) {
      errors[field._id] = error
    }
  })

  return errors
}

export default validateFields
