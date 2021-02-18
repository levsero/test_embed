import _ from 'lodash'

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
//
// if the field has a hideHint property set to true,
// (even if it also contains overrides) then it adds that instead
// {
//   id: 2142225,
//   hint: {
//     '*': 'Fallback text',
//     'fr': 'French text',
//   },
//   hideHint: true
// }
// becomes
// {
//   90210: { // <-- form ID
//     2001: { // <-- field ID
//       hideHint: true
//     }
//   }
// }

const normaliseDescriptionOverrideValues = (fields) => {
  if (!Array.isArray(fields)) return {}

  return fields.reduce((normalisedValues, field) => {
    if (!field.id) {
      return normalisedValues
    } else if (field.hideHint === true) {
      normalisedValues[field.id] = { hideHint: true }
    } else if (_.isPlainObject(field.hint) && !_.isEmpty(field.hint)) {
      normalisedValues[field.id] = field.hint
    }

    return normalisedValues
  }, {})
}

export default normaliseDescriptionOverrideValues
