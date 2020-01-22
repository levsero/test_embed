import { EMAIL_PATTERN } from 'constants/shared'
import getFields from 'embeds/support/utils/getFields'

const fieldRuleTypes = {
  email: (value, translate) => {
    return !EMAIL_PATTERN.test(value)
      ? translate('embeddable_framework.validation.error.email')
      : undefined
  },
  attachments: (value, translate, attachments) => {
    const attachmentsForForm = attachments.filter(attachment => value.ids.includes(attachment.id))
    const hasNoErrors =
      attachmentsForForm.filter(attachment => !attachment.uploadToken).length === 0
    return hasNoErrors ? undefined : 'error'
  }
}

const validateTicketForm = (ticketFields, translate, values, attachments, conditions) => {
  const errors = {}

  getFields(values, conditions, ticketFields).forEach(field => {
    if (field.required_in_portal && !values[field.keyID]) {
      errors[field.keyID] = translate('embeddable_framework.validation.error.input')
      return
    }
    const validator = fieldRuleTypes[field.validation]
    if (validator) {
      const errorMessage = validator(values[field.keyID], translate, attachments)
      if (errorMessage) {
        errors[field.keyID] = errorMessage
      }
    }
  })

  return errors
}

export default validateTicketForm
