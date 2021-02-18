import { supportedFields } from 'src/components/DynamicForm/FormField/fields'
import errorTracker from 'src/framework/services/errorTracker'
import createKeyID from 'embeds/support/utils/createKeyID'

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

// fields in the shape of
// { id: <key-id for custom fields or normal id for hard coded fields>, origianlId: <id-if-overwritten> }
const getFields = (currentValues, conditions = [], fields = []) => {
  const fieldsById = fields.reduce(
    (prev, field) => ({
      ...prev,
      [field.id]: field,
    }),
    {}
  )

  if (!conditions) {
    return fields
  }

  const conditionalValues = {}
  const conditionalDependencies = {}

  conditions.forEach((condition) => {
    condition.child_fields.forEach((field) => {
      const parentId = createKeyID(condition.parent_field_id)
      const fieldId = createKeyID(field.id)

      const parentField = fieldsById[parentId]
      if (!parentField) return

      if (!conditionalValues[fieldId]) {
        conditionalValues[fieldId] = {
          visible: false,
          required: false,
          validParents: {},
        }
      }

      if (!conditionalDependencies[fieldId]) {
        conditionalDependencies[fieldId] = {}
      }

      conditionalDependencies[fieldId][parentId] = true

      // if the parent condition is matched, update the fields visible and required values
      if (isEqual(parentField, currentValues[parentId], condition.value)) {
        conditionalValues[fieldId].visible = true
        conditionalValues[fieldId].required =
          conditionalValues[fieldId].required || field.is_required
        conditionalValues[fieldId].validParents[parentId] = true
      }
    })
  })

  const isFieldVisible = (fieldId, seenFields = {}) => {
    if (seenFields[fieldId]) {
      const error = new Error('Failed to display form due to conditions having inter-dependencies')
      errorTracker.error(error)
      throw error
    }
    seenFields[fieldId] = true

    const field = fieldsById[fieldId]

    if (!conditionalValues[fieldId]) {
      return field.visible
    }

    // If the field has been marked as not visible, no other logic can make it visible again
    if (!conditionalValues[fieldId].visible) {
      return false
    }

    // If the field is visible, verify it has at least one visible parent
    const parentIds = Object.keys(conditionalDependencies[fieldId])
    if (parentIds.length === 0) {
      return true
    }
    const visibleAndValidParents = parentIds
      .filter((parentId) => isFieldVisible(parentId, { ...seenFields }))
      .filter((parentId) => conditionalValues[fieldId].validParents[parentId])

    return visibleAndValidParents.length > 0
  }

  return fields
    .map((field) => {
      if (!conditionalValues[field.id]) {
        return field
      }

      return {
        ...field,
        visible: field.visible && isFieldVisible(field.id),
        required: field.required || conditionalValues[field.id].required,
      }
    })
    .filter((field) => field.visible)
    .filter((field) => supportedFields[field.type])
}

export default getFields
