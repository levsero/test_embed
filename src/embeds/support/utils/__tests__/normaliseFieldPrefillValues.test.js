import normaliseFieldPrefillValues from 'embeds/support/utils/normaliseFieldPrefillValues'

describe('normaliseFieldPrefillValues', () => {
  it('returns an object where field Values are nested under locale rather than field', () => {
    const result = normaliseFieldPrefillValues([
      {
        id: 1337,
        prefill: {
          '*': 'email@example.com',
          fr: 'french-email@example.com'
        }
      },
      {
        id: 666,
        prefill: {
          '*': 'Name',
          fr: 'French name'
        }
      },
      {
        id: 2001
      }
    ])

    expect(result).toEqual({
      '*': {
        1337: 'email@example.com',
        666: 'Name'
      },
      fr: {
        1337: 'french-email@example.com',
        666: 'French name'
      }
    })
  })
})
