import getFields from '../getFields'

describe('getFields', () => {
  let currentId = 0

  const field = (options = {}) => {
    const id = options.id || ++currentId
    const keyID = `key:${id}`

    return {
      id,
      keyID,
      visible_in_portal: true,
      required_in_portal: true,
      ...options
    }
  }

  it('adds a keyID to each field since react final form does not support keys with only numbers', () => {
    const field1 = field({ id: 1, keyID: null })
    const field2 = field({ id: 2, keyID: null })

    const expectedField1 = {
      ...field1,
      keyID: 'key:1'
    }

    const expectedField2 = {
      ...field2,
      keyID: 'key:2'
    }

    const result = getFields({}, [], [field1, field2])

    expect(result).toEqual([expectedField1, expectedField2])
  })

  it('does not include a field if it is not visible', () => {
    const field1 = field({ id: 1 })
    const field2 = field({ id: 2, visible_in_portal: false })

    const result = getFields({}, [], [field1, field2])

    expect(result).toEqual([field1])
  })

  describe('when a field has a condition on it', () => {
    const field1 = field({ id: 1 })
    const field2 = field({ id: 2 })

    const condition = {
      parent_field_id: 1,
      value: 'one',
      child_fields: [
        {
          id: 2,
          is_required: true
        }
      ]
    }
    const condition2 = {
      parent_field_id: 2,
      value: 'one',
      child_fields: [
        {
          id: 3,
          is_required: true
        }
      ]
    }

    it('does not include the field if it fails meeting a condition', () => {
      const result = getFields({ 'key:1': 'not one' }, [condition], [field1, field2])

      expect(result).toEqual([field1])
    })

    it('correctly handles if the conditional field is not passed in', () => {
      const result = getFields({ 'key:1': 'not one' }, [condition, condition2], [field1])

      expect(result).toEqual([field1])
    })

    it('includes the field if it does meet a condition', () => {
      const result = getFields({ 'key:1': 'one' }, [condition], [field1, field2])

      expect(result).toEqual([field1, field2])
    })

    it('marks a field as required if the condition is marked as required', () => {
      const field2 = field({ id: 2, required_in_portal: false })

      const result = getFields({ 'key:1': 'one' }, [condition], [field1, field2])

      expect(result).toEqual([field1, field({ id: 2, required_in_portal: true })])
    })

    it('keeps the field as required if the condition is marked as not required but the field is', () => {
      const field2 = field({ id: 2, required_in_portal: true })
      const condition = {
        parent_field_id: 1,
        value: 'one',
        child_fields: [
          {
            id: 2,
            is_required: false
          }
        ]
      }

      const result = getFields({ 'key:1': 'one' }, [condition], [field1, field2])

      expect(result).toEqual([field1, field2])
    })

    describe('determine checkbox fields in conditions since conditions uses booleans and form uses 0 and 1', () => {
      it('can correctly determine when a checkbox is unchecked', () => {
        const field1 = field({ id: 1, type: 'checkbox' })
        const field2 = field({ id: 2 })

        const condition = {
          parent_field_id: 1,
          value: true,
          child_fields: [
            {
              id: 2,
              is_required: false
            }
          ]
        }

        const result = getFields({ [field1.keyID]: 0 }, [condition], [field1, field2])

        expect(result).toEqual([field1])
      })

      it('can correctly determine when a checkbox is checked', () => {
        const field1 = field({ id: 1, type: 'checkbox' })
        const field2 = field({ id: 2 })

        const condition = {
          parent_field_id: 1,
          value: true,
          child_fields: [
            {
              id: 2,
              is_required: false
            }
          ]
        }

        const result = getFields({ [field1.keyID]: 1 }, [condition], [field1, field2])

        expect(result).toEqual([field1, field2])
      })
    })
  })
})
