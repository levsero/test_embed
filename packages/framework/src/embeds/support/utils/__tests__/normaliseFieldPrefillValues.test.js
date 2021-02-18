import normaliseFieldPrefillValues from 'embeds/support/utils/normaliseFieldPrefillValues'

describe('normaliseFieldPrefillValues', () => {
  it('returns an object where field Values are nested under locale rather than field', () => {
    const result = normaliseFieldPrefillValues([
      {
        id: 1337,
        prefill: {
          '*': 'email@example.com',
          fr: 'french-email@example.com',
        },
      },
      {
        id: 666,
        prefill: {
          '*': 'Name',
          fr: 'French name',
        },
      },
      {
        id: 'description',
        prefill: {
          '*': 'Descrição',
          it: 'Descrizione',
        },
      },
      {
        id: 'age',
        prefill: {
          '*': 'Edad',
          de: 'Beschreibung',
        },
      },
      {
        id: 2001,
      },
      {
        id: 'Surname',
      },
    ])

    expect(result).toEqual({
      '*': {
        1337: 'email@example.com',
        666: 'Name',
        age: 'Edad',
        description: 'Descrição',
      },
      fr: {
        1337: 'french-email@example.com',
        666: 'French name',
      },
      de: {
        age: 'Beschreibung',
      },
      it: {
        description: 'Descrizione',
      },
    })
  })
})
