const getCheckboxFields = fields => fields.filter(field => field.type === 'checkbox')

const getNonCheckboxFields = fields => fields.filter(field => field.type !== 'checkbox')

const convertFieldValue = (type, value) => {
  switch (type) {
    case 'checkbox':
      return value ? Number(value) : 0
    case 'attachments':
      return value === '' ? { limitExceeded: false, ids: [] } : value
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

export {
  convertFieldValue,
  getCheckboxFields,
  getNonCheckboxFields,
  getFieldIdFromKeyID,
  getSortedFields
}
