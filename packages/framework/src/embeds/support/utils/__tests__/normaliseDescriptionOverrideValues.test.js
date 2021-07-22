import normaliseDescriptionOverrideValues from 'src/embeds/support/utils/normaliseDescriptionOverrideValues'

describe('normaliseDescriptionOverrideValues', () => {
  it('returns an object where hints/hideHint status are placed under a keyed ID', () => {
    const result = normaliseDescriptionOverrideValues([
      {
        id: 4355,
        hint: {
          '*': 'email@example.com',
          es: 'el_correo@example.com',
        },
      },
      {
        id: 4356,
        hint: {
          '*': 'email@example.com',
          pt: 'o_correio@example.com',
        },
      },
      {
        id: 4357,
        hint: 'im not an object',
      },
      {
        id: 4348,
        hint: {},
      },
      {
        hint: {
          '*': 'email@example.com',
          pt: 'o_correio@example.com',
        },
      },
      {
        id: 4359,
        hideHint: true,
      },
      {
        id: 4360,
        hint: {
          '*': 'email@example.com',
          pt: 'o_correio@example.com',
        },
        hideHint: true,
      },
      {
        id: 4361,
        hint: {
          '*': 'email@example.com',
          pt: 'o_correio@example.com',
        },
        hideHint: 'im truthy but not true',
      },
    ])

    expect(result).toEqual({
      4355: {
        '*': 'email@example.com',
        es: 'el_correo@example.com',
      },
      4356: {
        '*': 'email@example.com',
        pt: 'o_correio@example.com',
      },
      4359: {
        hideHint: true,
      },
      4360: {
        hideHint: true,
      },
      4361: {
        '*': 'email@example.com',
        pt: 'o_correio@example.com',
      },
    })
  })
})
