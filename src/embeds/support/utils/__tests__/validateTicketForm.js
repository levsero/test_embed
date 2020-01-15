import validateTicketForm from '../validateTicketForm'

const mockTranslate = value => value

const runValidate = (ticketFields, values, showErrors = true, conditions = []) => {
  return validateTicketForm(ticketFields, mockTranslate, values, showErrors, conditions)
}

const nameField = { required_in_portal: true, visible_in_portal: true, keyID: 'name' }
const emailField = {
  visible_in_portal: true,
  required_in_portal: true,
  keyID: 'email',
  validation: 'email'
}

describe('validateTicketForm', () => {
  describe('required fields', () => {
    it('returns the field name and a field required error', () => {
      const result = runValidate([nameField], {
        name: ''
      })

      expect(result).toEqual({ name: 'embeddable_framework.validation.error.input' })
    })
  })

  describe('custom validation', () => {
    describe('email', () => {
      it('returns an object with an email validation error when value is invalid', () => {
        const result = runValidate([emailField], { email: 'Bob Saget' }, true)

        expect(result).toEqual({ email: 'embeddable_framework.validation.error.email' })
      })

      it('returns an object with an email validation error when value is empty', () => {
        const result = runValidate([emailField], { email: '' }, true)

        expect(result).toEqual({ email: 'embeddable_framework.validation.error.input' })
      })
    })
  })

  describe('required fields and custom validation', () => {
    it('returns an object with an email validation error and a required field error', () => {
      const result = runValidate([emailField, nameField], { email: 'Bob Saget', name: '' }, true)

      expect(result).toEqual({
        name: 'embeddable_framework.validation.error.input',
        email: 'embeddable_framework.validation.error.email'
      })
    })
  })
})
