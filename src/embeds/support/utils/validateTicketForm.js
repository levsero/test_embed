import { EMAIL_PATTERN } from 'constants/shared'
import getFields from 'embeds/support/utils/getFields'

const getFieldValidationError = type => {
  switch (type) {
    case 'select':
    case 'tagger':
      return 'embeddable_framework.validation.error.select'
    case 'email':
      return 'embeddable_framework.validation.error.email'
    case 'phone':
      return 'embeddable_framework.validation.error.phone'
    case 'name':
      return 'embeddable_framework.validation.error.name'
    case 'decimal':
    case 'number':
    case 'integer':
      return 'embeddable_framework.validation.error.number'
    case 'checkbox':
      return 'embeddable_framework.validation.error.checkbox'
    case 'subject':
    case 'description':
    case 'textarea':
      return 'embeddable_framework.validation.error.input'
    default:
      return 'embeddable_framework.validation.error.input'
  }
}

const fieldRuleTypes = {
  email: value => {
    return !EMAIL_PATTERN.test(value) ? getFieldValidationError('email') : undefined
  },
  attachments: (value, attachments) => {
    const attachmentsForForm = attachments.filter(attachment => value.ids.includes(attachment.id))
    const hasNoErrors =
      attachmentsForForm.filter(attachment => !attachment.uploadToken).length === 0
    return hasNoErrors ? undefined : 'error'
  }
}

const validateTicketForm = (ticketFields, values, attachments, conditions) => {
  const errors = {}

  getFields(values, conditions, ticketFields).forEach(field => {
    if (field.required_in_portal && !values[field.keyID]) {
      errors[field.keyID] = getFieldValidationError(field.validation || field.type)
      return
    }
    const validator = fieldRuleTypes[field.validation]
    if (validator) {
      const errorMessage = validator(values[field.keyID], attachments)
      if (errorMessage) {
        errors[field.keyID] = errorMessage
      }
    }
  })

  return errors
}

export default validateTicketForm
