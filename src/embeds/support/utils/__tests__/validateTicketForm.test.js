import validateTicketForm from '../validateTicketForm'

const runValidate = (ticketFields, values, attachments, conditions = []) => {
  return validateTicketForm(ticketFields, values, attachments, conditions)
}

const nameField = {
  required_in_portal: true,
  visible_in_portal: true,
  keyID: 'name',
  type: 'text',
  validation: 'name'
}
const invisibleField = {
  required_in_portal: true,
  visible_in_portal: false,
  keyID: 'invisibleField',
  type: 'text'
}
const emailField = {
  visible_in_portal: true,
  required_in_portal: true,
  keyID: 'email',
  validation: 'email',
  type: 'text'
}
const attachmentField = {
  visible_in_portal: true,
  required_in_portal: true,
  keyID: 'attachments',
  validation: 'attachments',
  id: 1,
  type: 'attachments'
}
const taggerField = {
  required_in_portal: true,
  visible_in_portal: true,
  keyID: 'someTagger',
  type: 'tagger'
}
const selectField = {
  required_in_portal: true,
  visible_in_portal: true,
  keyID: 'someSelect',
  type: 'select'
}
const decimalField = {
  required_in_portal: true,
  visible_in_portal: true,
  keyID: 'someDecimal',
  type: 'decimal'
}
const numberField = {
  required_in_portal: true,
  visible_in_portal: true,
  keyID: 'someNumber',
  type: 'number'
}
const integerField = {
  required_in_portal: true,
  visible_in_portal: true,
  keyID: 'someInteger',
  type: 'integer'
}
const checkboxField = {
  required_in_portal: true,
  visible_in_portal: true,
  keyID: 'someCheckbox',
  type: 'checkbox'
}
const subjectField = {
  required_in_portal: true,
  visible_in_portal: true,
  keyID: 'someSubject',
  type: 'subject'
}
const descriptionField = {
  required_in_portal: true,
  visible_in_portal: true,
  keyID: 'someDescription',
  type: 'description'
}
const textAreaField = {
  required_in_portal: true,
  visible_in_portal: true,
  keyID: 'someTextarea',
  type: 'textarea'
}

describe('validateTicketForm', () => {
  describe('required fields', () => {
    it('returns the field name and a field required error', () => {
      const result = runValidate([nameField], {
        name: ''
      })

      expect(result).toEqual({ name: 'embeddable_framework.validation.error.name' })
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

        expect(result).toEqual({ email: 'embeddable_framework.validation.error.email' })
      })
    })

    describe('attachments', () => {
      it('returns an attachments validation error when there is a non valid attachment', () => {
        const result = runValidate([attachmentField], { attachments: { ids: [1] } }, [
          { id: 1, uploading: false, name: 'test' },
          { id: 1, uploading: false, name: 'real', errorMessage: '1234' }
        ])

        expect(result).toEqual({
          attachments: 'embeddable_framework.validation.error.attachments.singular'
        })
      })

      it('returns an attachments validation error when there are multiple non valid attachments', () => {
        const result = runValidate([attachmentField], { attachments: { ids: [1] } }, [
          { id: 1, uploading: true, name: 'test' },
          { id: 1, name: 'test2', errorMessage: '1234' },
          { id: 1, name: 'real', errorMessage: '1234' }
        ])

        expect(result).toEqual({
          attachments: 'embeddable_framework.validation.error.attachments.plural'
        })
      })

      it('returns an attachment uploading error when there are attachments uploading', () => {
        const result = runValidate([attachmentField], { attachments: { ids: [1] } }, [
          { id: 1, uploading: true, name: 'test' },
          { id: 1, name: 'test2' },
          { id: 1, name: 'real' }
        ])

        expect(result).toEqual({
          attachments: 'embeddable_framework.validation.error.attachments.upload_in_progress'
        })
      })

      it('returns an empty error object when attachments for form are valid', () => {
        const result = runValidate([attachmentField], { attachments: { ids: [2] } }, [
          { id: 1, uploading: false, name: 'test' },
          { id: 2, uploading: false, name: 'real' }
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
        [{ id: 1, uploading: false, name: 'test', errorMessage: '1234' }]
      )

      expect(result).toEqual({
        name: 'embeddable_framework.validation.error.name',
        email: 'embeddable_framework.validation.error.email',
        attachments: 'embeddable_framework.validation.error.attachments.singular'
      })
    })
  })

  it('does not validate fields that are not visible', () => {
    const result = runValidate([nameField, invisibleField], { name: '', invisibleField: '' })

    expect(result).toEqual({
      name: 'embeddable_framework.validation.error.name'
    })
  })

  describe('other ticket field error types', () => {
    it('returns email error for emails', () => {
      const result = runValidate([emailField], { email: '' })

      expect(result).toEqual({
        email: 'embeddable_framework.validation.error.email'
      })
    })

    it('returns name error for name fields', () => {
      const result = runValidate([nameField], { name: '' })

      expect(result).toEqual({
        name: 'embeddable_framework.validation.error.name'
      })
    })

    it('returns checkbox error for checkbox fields', () => {
      const result = runValidate([checkboxField], { someCheckbox: false })

      expect(result).toEqual({
        someCheckbox: 'embeddable_framework.validation.error.checkbox'
      })
    })

    it('returns number error for decimal, number, and integer fields', () => {
      const result = runValidate([decimalField, numberField, integerField], {
        someDecimal: '',
        someNumber: '',
        someInteger: ''
      })

      expect(result).toEqual({
        someDecimal: 'embeddable_framework.validation.error.number',
        someInteger: 'embeddable_framework.validation.error.number',
        someNumber: 'embeddable_framework.validation.error.number'
      })
    })

    it('returns input error for subject, description, and textarea fields', () => {
      const result = runValidate([subjectField, descriptionField, textAreaField], {
        someSubject: '',
        someDescription: '',
        someTextarea: ''
      })

      expect(result).toEqual({
        someDescription: 'embeddable_framework.validation.error.input',
        someSubject: 'embeddable_framework.validation.error.input',
        someTextarea: 'embeddable_framework.validation.error.input'
      })
    })

    it('returns Select related error for tagger and select', () => {
      const result = runValidate([taggerField, selectField], { someTagger: '', someSelect: '' })

      expect(result).toEqual({
        someSelect: 'embeddable_framework.validation.error.select',
        someTagger: 'embeddable_framework.validation.error.select'
      })
    })
  })
})
