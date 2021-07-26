import createKeyID from 'src/embeds/support/utils/createKeyID'
import getFields from '../getFields'

describe('getFields', () => {
  let currentId = 0

  const field = (options = {}) => {
    const { id, ...overrides } = options
    const idToUse = id ?? ++currentId
    const keyID = createKeyID(idToUse)

    return {
      id: keyID,
      originalId: idToUse,
      visible: true,
      required: true,
      type: 'text',
      ...overrides,
    }
  }

  it('does not include a field if it is not visible', () => {
    const field1 = field({ id: 1 })
    const field2 = field({ id: 2, visible: false })

    const result = getFields({}, [], [field1, field2])

    expect(result).toEqual([field1])
  })

  it('does not include fields which are unsupported', () => {
    const field1 = field({ id: 1, type: 'partialcreditcard' })
    const field2 = field({ id: 2, type: 'date' })
    const field3 = field({ id: 3, type: 'regex' })
    const field4 = field({ id: 4, type: 'multiselect' })
    const field5 = field({ id: 5, type: 'text' })

    const result = getFields({}, [], [field1, field2, field3, field4, field5])

    expect(result).toEqual([field5])
  })

  it('throws an error if conditions conflict with each other', () => {
    const field1 = field({ id: 1 })
    const field2 = field({ id: 2 })

    const condition = {
      parent_field_id: field1.originalId,
      value: 'match',
      child_fields: [
        {
          id: field2.originalId,
          is_required: true,
        },
      ],
    }
    const condition2 = {
      parent_field_id: field2.originalId,
      value: 'match',
      child_fields: [
        {
          id: field1.originalId,
          is_required: true,
        },
      ],
    }

    expect(() =>
      getFields(
        { [field1.id]: 'match', [field2.id]: 'match' },
        [condition, condition2],
        [field1, field2]
      )
    ).toThrow('Failed to display form due to conditions having inter-dependencies')
  })

  describe('when conditions are nested', () => {
    const condition = (parent, child) => ({
      parent_field_id: parent.originalId,
      value: 'match',
      child_fields: [
        {
          id: child.originalId,
          is_required: true,
        },
      ],
    })

    const field1a = field({ id: '1a' })
    const field1b = field({ id: '1b' })
    const field2a = field({ id: '2a' })
    const field2b = field({ id: '2b' })
    const field3 = field({ id: '3' })

    const conditions = [
      condition(field1a, field1b),
      condition(field1b, field3),
      condition(field2a, field2b),
      condition(field2b, field3),
    ]

    it('does not show the child field if at least one of its parents are not visible', () => {
      const result = getFields(
        {
          [field1a.id]: 'not match',
          [field1b.id]: 'match',
          [field2a.id]: 'match',
          [field2b.id]: 'not match',
        },
        conditions,
        [field1a, field1b, field2a, field2b, field3]
      )

      expect(result).toEqual([field1a, field2a, field2b])
    })

    it('shows the conditional field when at least one of its parents are visible', () => {
      const result = getFields({ [field1a.keyID]: 'match', [field2a.keyID]: 'match' }, conditions, [
        field1a,
        field2a,
        field3,
      ])

      expect(result).toEqual([field1a, field2a, field3])
    })
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
          is_required: true,
        },
      ],
    }
    const condition2 = {
      parent_field_id: 2,
      value: 'one',
      child_fields: [
        {
          id: 3,
          is_required: true,
        },
      ],
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
      const result = getFields({ [field1.id]: 'one' }, [condition], [field1, field2])

      expect(result).toEqual([field1, field2])
    })

    it('marks a field as required if the condition is marked as required', () => {
      const field2 = field({ id: 2, required: false })

      const result = getFields({ [field1.id]: 'one' }, [condition], [field1, field2])

      expect(result).toEqual([field1, field({ id: 2, required: true })])
    })

    it('keeps the field as required if the condition is marked as not required but the field is', () => {
      const field2 = field({ id: 2, required: true })
      const condition = {
        parent_field_id: 1,
        value: 'one',
        child_fields: [
          {
            id: 2,
            is_required: false,
          },
        ],
      }

      const result = getFields({ [field1.id]: 'one' }, [condition], [field1, field2])

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
              is_required: false,
            },
          ],
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
              is_required: false,
            },
          ],
        }

        const result = getFields({ [field1.id]: 1 }, [condition], [field1, field2])

        expect(result).toEqual([field1, field2])
      })
    })
  })
})
