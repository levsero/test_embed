// Email regular expression from http://emailregex.com/
export const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line

const validateType = {
  text: ({ field, value }) => {
    if (field.minSize !== undefined) {
      if (value.length < field.minSize) {
        return `Must be more than ${field.minSize} character${field.minSize === 1 ? '' : 's'}`
      }
    }

    if (field.maxSize !== undefined) {
      if (value.length > field.maxSize) {
        return `Must be less than ${field.maxSize} character${field.maxSize === 1 ? '' : 's'}`
      }
    }
  },
  email: ({ value }) => {
    if (!EMAIL_PATTERN.test(value)) {
      return 'Please enter a valid email address.'
    }
  }
}

const validate = (fields, values) => {
  const errors = {}

  fields.forEach(field => {
    const value = values[field._id]

    if (!value) {
      errors[field._id] = 'This field is required.'
      return
    }

    if (typeof value === 'string' && value.trim() === '') {
      errors[field._id] = 'This field is required.'
      return
    }

    const error = validateType[field.type]?.({ field, value })
    if (error) {
      errors[field._id] = error
    }
  })

  return errors
}

export default validate
