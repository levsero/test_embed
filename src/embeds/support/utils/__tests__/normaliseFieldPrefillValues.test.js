import normaliseFieldPrefillValues from 'embeds/support/utils/normaliseFieldPrefillValues'

describe('normaliseFieldPrefillValues', () => {
  it('returns an object where field Values are nested under locale rather than field', () => {
    const result = normaliseFieldPrefillValues([
      {
        id: 'email',
        prefill: {
          '*': 'email@example.com',
          fr: 'french-email@example.com'
        }
      },
      {
        id: 'name',
        prefill: {
          '*': 'Name',
          fr: 'French name'
        }
      }
    ])

    expect(result).toEqual({
      '*': {
        email: 'email@example.com',
        name: 'Name'
      },
      fr: {
        email: 'french-email@example.com',
        name: 'French name'
      }
    })
  })
})
