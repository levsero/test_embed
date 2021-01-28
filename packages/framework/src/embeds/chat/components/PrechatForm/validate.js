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
  department: ({ field, value, isOfflineFormEnabled, isVisibleDepartmentsFeatureEnabled }) => {
    if (field.required && !value) {
      return 'embeddable_framework.validation.error.department'
    }

    const selectedOption = field.options.find(option => option.value === value)
    if (isVisibleDepartmentsFeatureEnabled) {
      if (!selectedOption && field.required) {
        return 'embeddable_framework.validation.error.department'
      }
    }

    if (!selectedOption) {
      return
    }

    if (selectedOption.disabled && !isOfflineFormEnabled) {
      return 'embeddable_framework.validation.error.department'
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
  }
}

const validate = ({ values, fields, isOfflineFormEnabled, isVisibleDepartmentsFeatureEnabled }) => {
  const errors = {}

  fields.forEach(field => {
    const errorMessage = fieldValidation[field.id]?.({
      value: values[field.id],
      field,
      isOfflineFormEnabled,
      isVisibleDepartmentsFeatureEnabled
    })

    if (errorMessage) {
      errors[field.id] = errorMessage
    }
  })

  if (Object.keys(errors).length > 0) {
    return errors
  }
}

export default validate
