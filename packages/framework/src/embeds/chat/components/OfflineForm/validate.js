import { EMAIL_PATTERN, PHONE_PATTERN } from 'constants/shared'

const fieldValidation = {
  name: ({ field, value }) => {
    if (field.required && !value) {
      return 'embeddable_framework.validation.error.name'
    }
  },
  email: ({ field, value }) => {
    if (field.required && !value) {
      return 'embeddable_framework.validation.error.email'
    }

    if (!value) {
      return
    }

    if (!EMAIL_PATTERN.test(value)) {
      return 'embeddable_framework.validation.error.email'
    }
  },
  phone: ({ field, value }) => {
    if (field.required && !value) {
      return 'embeddable_framework.validation.error.phone'
    }

    if (!value) {
      return
    }

    if (!PHONE_PATTERN.test(value)) {
      return 'embeddable_framework.validation.error.phone'
    }
  },
  message: ({ field, value }) => {
    if (field.required && !value) {
      return 'embeddable_framework.validation.error.message'
    }
  },
}

const validate = ({ values, fields }) => {
  const errors = {}

  fields.forEach((field) => {
    const errorMessage = fieldValidation[field.id]?.({
      value: values[field.id],
      field,
    })

    if (errorMessage) {
      errors[field.id] = errorMessage
    }
  })

  if (Object.keys(errors).length > 0) return errors
}

export default validate
