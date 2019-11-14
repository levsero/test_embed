import { getValidate } from '../formFieldRules'

const runValidate = (ticketFields, values, showErrors = true) => {
  const validate = getValidate(ticketFields, value => value) // translations will not work, we're testing keys here

  return validate(values, showErrors)
}

describe('validate', () => {
  describe('required fields', () => {
    describe('when showErrors is true', () => {
      it('returns the field name and a field required error', () => {
        const result = runValidate([{ required_in_portal: true, keyID: 'name' }], {
          name: ''
        })

        expect(result).toEqual({ name: 'embeddable_framework.validation.error.input' })
      })
    })

    describe('showErrors is false', () => {
      it('does not return an object', () => {
        const result = runValidate(
          [{ required_in_portal: true, keyID: 'name' }],
          { name: '' },
          false
        )

        expect(result).toEqual(null)
      })
    })
  })

  describe('custom validation', () => {
    describe('email', () => {
      describe('when showErrors is true', () => {
        it('returns an object with an email validation error when value is invalid', () => {
          const result = runValidate(
            [{ required_in_portal: true, keyID: 'email', validation: 'email' }],
            { email: 'Bob Saget' },
            true
          )

          expect(result).toEqual({ email: 'embeddable_framework.validation.error.email' })
        })

        it('returns an object with an email validation error when value is empty', () => {
          const result = runValidate(
            [{ required_in_portal: true, keyID: 'email', validation: 'email' }],
            { email: '' },
            true
          )

          expect(result).toEqual({ email: 'embeddable_framework.validation.error.input' })
        })
      })
      describe('when showErrors is false', () => {
        it('does not return an object', () => {
          const result = runValidate(
            [{ required_in_portal: true, keyID: 'email', validation: 'email' }],
            { email: 'Bob Saget' },
            false
          )
          expect(result).toEqual(null)
        })
      })
    })
  })

  describe('required fields and custom validation', () => {
    describe('when showErrors is true', () => {
      it('returns an object with an email validation error and a required field error', () => {
        const result = runValidate(
          [
            { required_in_portal: true, keyID: 'email', validation: 'email' },
            { required_in_portal: true, keyID: 'name' }
          ],
          { email: 'Bob Saget', name: '' },
          true
        )

        expect(result).toEqual({
          name: 'embeddable_framework.validation.error.input',
          email: 'embeddable_framework.validation.error.email'
        })
      })
    })
  })
})
