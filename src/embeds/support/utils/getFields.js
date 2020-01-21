// Some fields use different values for different apis
const isEqual = (field, value1, value2) => {
  // Checkbox fields use 0 and 1 to represent true and false when submitting the form, however use true and false
  // in the prefill api.
  if (field.type === 'checkbox') {
    return Boolean(value1) === Boolean(value2)
  }

  return value1 === value2
}

// getFields will return all of the fields that should be displayed to the user at the moment.
const getFields = (currentValues, conditions = [], fields = []) => {
  const result = {}

  // react final form does not allow keys to only be numbers due to a library they are relying on
  // for looking up nested fields.
  // For this reason, we need to create a custom id that contains the a string as well as numbers
  const fieldsWithkeyID = fields.map(field => ({
    ...field,
    keyID: field.keyID || `key:${field.id}`
  }))

  const fieldsById = fieldsWithkeyID.reduce(
    (prev, field) => ({
      ...prev,
      [field.id]: field
    }),
    {}
  )

  if (!conditions) {
    return fieldsWithkeyID
  }

  conditions.forEach(condition => {
    condition.child_fields.forEach(field => {
      const fieldDefinition = fieldsById[condition.parent_field_id]
      const parentKeyID = fieldDefinition.keyID

      if (!result[field.id]) {
        result[field.id] = {
          visible: false,
          required: false
        }
      }

      // if the parent condition is matched, update the fields visible and required values
      if (isEqual(fieldDefinition, currentValues[parentKeyID], condition.value)) {
        result[field.id] = {
          visible: true,
          required: result[field.id].required || field.is_required
        }
      }
    })
  })

  return fieldsWithkeyID
    .map(field => {
      if (!result[field.id]) {
        return field
      }

      return {
        ...field,
        visible_in_portal: field.visible_in_portal && result[field.id].visible,
        required_in_portal: field.required_in_portal || result[field.id].required
      }
    })
    .filter(field => field.visible_in_portal)
}

export default getFields
