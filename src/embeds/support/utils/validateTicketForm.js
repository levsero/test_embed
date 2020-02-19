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
    case 'attachment':
      return 'embeddable_framework.validation.error.attachments.singular'
    case 'attachments':
      return 'embeddable_framework.validation.error.attachments.plural'
    case 'attachment_uploading':
      return 'embeddable_framework.validation.error.attachments.upload_in_progress'
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
    const errorCount = attachmentsForForm.filter(attachment => attachment.errorMessage).length
    const stillUploading = attachmentsForForm.filter(attachment => attachment.uploading).length
    if (errorCount === 0 && stillUploading === 0) return undefined
    if (errorCount) {
      return errorCount === 1
        ? getFieldValidationError('attachment')
        : getFieldValidationError('attachments')
    }
    return getFieldValidationError('attachment_uploading')
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
