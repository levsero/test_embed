// takes fields in the shape of
// {
//   id: 2142225,
//   hint: {
//     '*': 'Fallback text',
//     'fr': 'French text',
//   }
// }
// and converts to an object key-ed by form and field IDs like so:
// {
//   90210: { // <-- form ID
//     2001: { // <-- field ID
//       '*': 'Fallback text',
//       'fr': 'French Text'
//     }
//   }
// }
const normaliseDescriptionOverrideValues = fields => {
  const values = {}

  if (!Array.isArray(fields)) {
    return values
  }

  fields.forEach(field => {
    if (
      !field?.id ||
      !field?.hint ||
      !(field.hint === Object(field.hint)) ||
      Object.keys(field.hint).length === 0
    )
      return

    values[field.id] = field.hint
  })

  return values
}

export default normaliseDescriptionOverrideValues
