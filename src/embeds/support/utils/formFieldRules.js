import { EMAIL_PATTERN } from 'constants/shared'

const fieldRuleTypes = {
  email: (value, translate) => {
    return !EMAIL_PATTERN.test(value)
      ? translate('embeddable_framework.validation.error.email')
      : undefined
  }
}

export const getValidate = (ticketFields, translate) => {
  return (values, showErrors) => {
    if (!showErrors) return null

    let errors = {}

    ticketFields.forEach(field => {
      if (field.required_in_portal && !values[field.keyID]) {
        errors[field.keyID] = translate('embeddable_framework.validation.error.input')
        return
      }

      const validator = fieldRuleTypes[field.validation]
      if (validator) {
        const errorMessage = validator(values[field.keyID], translate)
        if (errorMessage) {
          errors[field.keyID] = errorMessage
        }
      }
    })

    return errors
  }
}
