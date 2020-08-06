import normaliseDescriptionOverrideValues from 'embeds/support/utils/normaliseDescriptionOverrideValues'

describe('normaliseDescriptionOverrideValues', () => {
  it('returns an object where hints are placed under a keyed ID', () => {
    const result = normaliseDescriptionOverrideValues([
      {
        id: 4355,
        hint: {
          '*': 'email@example.com',
          es: 'el_correo@example.com'
        }
      },
      {
        id: 4356,
        hint: {
          '*': 'email@example.com',
          pt: 'o_correio@example.com'
        }
      }
    ])

    expect(result).toEqual({
      4355: {
        '*': 'email@example.com',
        es: 'el_correo@example.com'
      },
      4356: {
        '*': 'email@example.com',
        pt: 'o_correio@example.com'
      }
    })
  })
})
