import validate from '../validate'

describe('PrechatForm validate', () => {
  describe('name', () => {
    it('returns an error if the field is required and there is no value', () => {
      const result = validate({
        values: {
          name: ''
        },
        fields: [
          {
            id: 'name',
            required: true
          }
        ]
      })

      expect(result).toEqual({ name: 'embeddable_framework.validation.error.name' })
    })

    it('does not return an error if the field is required and there is a value', () => {
      const result = validate({
        values: {
          name: 'Some name'
        },
        fields: [
          {
            id: 'name',
            required: false
          }
        ]
      })

      expect(result).toEqual(undefined)
    })
  })

  describe('email', () => {
    it('returns an error if the field is required and there is no value', () => {
      const result = validate({
        values: {
          email: ''
        },
        fields: [
          {
            id: 'email',
            required: true
          }
        ]
      })

      expect(result).toEqual({ email: 'embeddable_framework.validation.error.email' })
    })

    it('does not return an error if the field is required and there is a value', () => {
      const result = validate({
        values: {
          email: 'example@example.com'
        },
        fields: [
          {
            id: 'email',
            required: true
          }
        ]
      })

      expect(result).toEqual(undefined)
    })

    it('returns an error if the value is not a valid email address', () => {
      const result = validate({
        values: {
          email: 'invalid email'
        },
        fields: [
          {
            id: 'email',
            required: false
          }
        ]
      })

      expect(result).toEqual({ email: 'embeddable_framework.validation.error.email' })
    })
  })

  describe('department', () => {
    it('returns an error if the field is required and there is no value', () => {
      const result = validate({
        values: {
          department: null
        },
        fields: [
          {
            id: 'department',
            required: true,
            options: []
          }
        ]
      })

      expect(result).toEqual({ department: 'embeddable_framework.validation.error.department' })
    })

    it('returns an error if the field is required, but the value is not a valid option', () => {
      const result = validate({
        values: {
          department: 4
        },
        fields: [
          {
            id: 'department',
            required: true,
            options: [{ value: 1 }, { value: 2 }, { value: 3 }]
          }
        ]
      })

      expect(result).toEqual({ department: 'embeddable_framework.validation.error.department' })
    })

    it('does not return an error if the field is required and there is a value', () => {
      const result = validate({
        values: {
          department: null
        },
        fields: [
          {
            id: 'department',
            required: false,
            options: []
          }
        ]
      })

      expect(result).toEqual(undefined)
    })

    it('returns an error if the selected department is offline and the offline form is not enabled', () => {
      const result = validate({
        values: {
          department: 123
        },
        isOfflineFormEnabled: false,
        fields: [
          {
            id: 'department',
            required: false,
            options: [{ value: 123, disabled: true }]
          }
        ]
      })

      expect(result).toEqual({ department: 'embeddable_framework.validation.error.department' })
    })
  })

  describe('phone', () => {
    it('returns an error if the field is required and there is no value', () => {
      const result = validate({
        values: {
          phone: null
        },
        fields: [
          {
            id: 'phone',
            required: true
          }
        ]
      })

      expect(result).toEqual({ phone: 'embeddable_framework.validation.error.phone' })
    })

    it('does not return an error if the field is required and there is a value', () => {
      const result = validate({
        values: {
          phone: null
        },
        fields: [
          {
            id: 'phone',
            required: false
          }
        ]
      })

      expect(result).toEqual(undefined)
    })

    it('returns an error if the value is not a valid phone number', () => {
      const result = validate({
        values: {
          phone: 'invalid phone number'
        },
        fields: [
          {
            id: 'phone',
            required: false
          }
        ]
      })

      expect(result).toEqual({ phone: 'embeddable_framework.validation.error.phone' })
    })
  })

  describe('message', () => {
    it('returns an error if the field is required and there is no value', () => {
      const result = validate({
        values: {
          message: null
        },
        fields: [
          {
            id: 'message',
            required: true
          }
        ]
      })

      expect(result).toEqual({ message: 'embeddable_framework.validation.error.message' })
    })

    it('does not return an error if the field is required and there is a value', () => {
      const result = validate({
        values: {
          message: null
        },
        fields: [
          {
            id: 'message',
            required: false
          }
        ]
      })

      expect(result).toEqual(undefined)
    })
  })
})
