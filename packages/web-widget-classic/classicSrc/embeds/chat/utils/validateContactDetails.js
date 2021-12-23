import { nameValid, emailValid } from '@zendesk/widget-shared-services'

export default (values, requiredFormData) => {
  const nameError = !nameValid(values.display_name ?? '', {
    allowEmpty: !requiredFormData?.name?.required,
  })
  const emailError = !emailValid(values.email ?? '', {
    allowEmpty: !requiredFormData?.email?.required,
  })

  if (nameError || emailError) {
    const errors = {}

    if (emailError) {
      errors['email'] = 'embeddable_framework.validation.error.email'
    }
    if (nameError) {
      errors['display_name'] = 'embeddable_framework.validation.error.name'
    }

    return errors
  }

  return null
}
