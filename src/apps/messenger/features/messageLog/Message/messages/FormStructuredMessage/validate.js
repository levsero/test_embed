// Email regular expression from http://emailregex.com/
export const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line

const validate = (fields, values) => {
  const errors = {}

  fields.forEach(field => {
    const value = values[field._id]

    if (!value) {
      errors[field._id] = 'This field is required.'
      return
    }

    if (field.type === 'email') {
      if (!EMAIL_PATTERN.test(value)) {
        errors[field._id] = 'Please enter a valid email address.'
      }
    }
  })

  return errors
}

export default validate
