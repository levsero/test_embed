// takes fields in the shape of
// {
//   id: 2142225,
//   prefill: {
//     '*': 'Fallback text',
//     'fr': 'French text',
//   }
// }
// and converts to an object keyed by the locale
// {
//    '*': {
//      2142225: 'Fallback text
//    },
//    'fr': {
//      2142225: 'French text
//    }
// }
const normaliseFieldPrefillValues = fields => {
  const values = {}

  if (!Array.isArray(fields)) {
    return values
  }

  fields.forEach(field => {
    field.prefill &&
      Object.keys(field.prefill).forEach(locale => {
        if (!values[locale]) {
          values[locale] = {}
        }

        values[locale][field.id] = field.prefill[locale]
      })
  })

  return values
}

export default normaliseFieldPrefillValues
