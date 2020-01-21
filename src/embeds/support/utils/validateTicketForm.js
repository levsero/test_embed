import { EMAIL_PATTERN } from 'constants/shared'
import getFields from 'embeds/support/utils/getFields'

const fieldRuleTypes = {
  email: (value, translate) => {
    return !EMAIL_PATTERN.test(value)
      ? translate('embeddable_framework.validation.error.email')
      : undefined
  }
}

const validateTicketForm = (ticketFields, translate, values, conditions) => {
  const errors = {}

  getFields(values, conditions, ticketFields).forEach(field => {
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

export default validateTicketForm
