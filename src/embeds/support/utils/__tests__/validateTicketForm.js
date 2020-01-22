import validateTicketForm from '../validateTicketForm'

const mockTranslate = value => value

const runValidate = (ticketFields, values, attachments, conditions = []) => {
  return validateTicketForm(ticketFields, mockTranslate, values, attachments, conditions)
}

const nameField = { required_in_portal: true, visible_in_portal: true, keyID: 'name' }
const invisibleField = {
  required_in_portal: true,
  visible_in_portal: false,
  keyID: 'invisibleField'
}
const emailField = {
  visible_in_portal: true,
  required_in_portal: true,
  keyID: 'email',
  validation: 'email'
}
const attachmentField = {
  visible_in_portal: true,
  required_in_portal: true,
  keyID: 'attachments',
  validation: 'attachments',
  id: 1
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
        const result = runValidate([emailField], { email: 'Bob Saget' })

        expect(result).toEqual({ email: 'embeddable_framework.validation.error.email' })
      })

      it('returns an object with an email validation error when value is empty', () => {
        const result = runValidate([emailField], { email: '' })

        expect(result).toEqual({ email: 'embeddable_framework.validation.error.input' })
      })
    })

    describe('attachments', () => {
      it('returns an attachments validation error when there is a non valid attachment', () => {
        const result = runValidate([attachmentField], { attachments: { ids: [1] } }, [
          { id: 1, name: 'test' },
          { id: 2, name: 'real', uploadToken: '1234' }
        ])

        expect(result).toEqual({ attachments: 'error' })
      })

      it('returns an empty error object when attachments are valid', () => {
        const result = runValidate([attachmentField], { attachments: { ids: [2] } }, [
          { id: 1, name: 'test' },
          { id: 2, name: 'real', uploadToken: '1234' }
        ])

        expect(result).toEqual({})
      })
    })
  })

  describe('required fields and custom validations', () => {
    it('returns an object with a custom validations and required field error', () => {
      const result = runValidate(
        [emailField, nameField, attachmentField],
        {
          email: 'Bob Saget',
          name: '',
          attachments: { ids: [1] }
        },
        [{ id: 1, name: 'test' }]
      )

      expect(result).toEqual({
        name: 'embeddable_framework.validation.error.input',
        email: 'embeddable_framework.validation.error.email',
        attachments: 'error'
      })
    })
  })

  it('does not validate fields that are not visible', () => {
    const result = runValidate([nameField, invisibleField], { name: '', invisibleField: '' })

    expect(result).toEqual({
      name: 'embeddable_framework.validation.error.input'
    })
  })
})
