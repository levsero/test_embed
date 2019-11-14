import _ from 'lodash'

const getCheckboxFields = fields => fields.filter(field => field.type === 'checkbox')

const getNonCheckboxFields = fields => fields.filter(field => field.type !== 'checkbox')

const convertFieldValue = (type, value) => {
  switch (type) {
    case 'checkbox':
      return value ? Number(value) : 0
    default:
      return value
  }
}

const getSortedFields = fields => getNonCheckboxFields(fields).concat(getCheckboxFields(fields))

const getFieldIdFromKeyID = (ticketFields, keyID) => {
  let outKey = null
  ticketFields.forEach(field => {
    if (field.keyID === keyID) outKey = `${field.id}`
  })

  return outKey
}

const getParsedValues = (values, ticketFields) =>
  _.mapKeys(values, (_value, key) => {
    const parsedID = getFieldIdFromKeyID(ticketFields, key)
    return parsedID ? parsedID : key
  })

const mapKeyFields = ticketFields => {
  return ticketFields.map(field => {
    return {
      ...field,
      keyID: field.keyID ? field.keyID : `${field.id}${field.title_in_portal}`
    }
  })
}

export {
  convertFieldValue,
  getCheckboxFields,
  getNonCheckboxFields,
  getFieldIdFromKeyID,
  getSortedFields,
  getParsedValues,
  mapKeyFields
}
