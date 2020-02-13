import React from 'react'
import _ from 'lodash'
import sanitizeHtml from 'sanitize-html'

import { i18n } from 'service/i18n'

import FormField from 'src/embeds/support/components/FormField'

const setupConditionCheck = (customFields, formState) => {
  return (fieldId, value) => {
    const field = _.find(customFields, field => field.id === fieldId)

    if (!field) return false

    if (field.type === 'checkbox') {
      // classic wants 0 and 1 so we use those as the values but conditions give us true and false
      return value === !!formState[fieldId]
    }

    return value === formState[fieldId]
  }
}

const getFieldValues = field => {
  switch (field.type) {
    case 'text':
    case 'subject':
      return {
        field: {
          ...field,
          type: 'text'
        },
        errorMessage: i18n.t('embeddable_framework.validation.error.input')
      }
    case 'tagger':
      return {
        field: {
          ...field,
          type: 'legacyDropdown'
        },
        errorMessage: i18n.t('embeddable_framework.validation.error.input')
      }
    case 'integer':
    case 'decimal':
      return {
        field,
        errorMessage: i18n.t('embeddable_framework.validation.error.number')
      }
    case 'textarea':
    case 'description':
      return {
        field: {
          ...field,
          type: 'textarea'
        },
        errorMessage: i18n.t('embeddable_framework.validation.error.input')
      }
    case 'checkbox':
      return {
        field,
        errorMessage: i18n.t('embeddable_framework.validation.error.checkbox')
      }
    default:
      return {}
  }
}

const getConditionOverrides = (conditions, conditionCheck) =>
  _.reduce(
    conditions,
    (memo, condition) => {
      const isFulfilled = conditionCheck(condition.parent_field_id, condition.value)

      condition.child_fields.forEach(child => {
        // need to check if already set to false in case multiple conditions on the same element
        const isVisible = memo[child.id]
          ? memo[child.id].visible_in_portal || isFulfilled
          : isFulfilled
        const isRequired =
          (memo[child.id] ? memo[child.id].required_in_portal : false) ||
          (child.is_required && isFulfilled)

        memo[child.id] = {
          visible_in_portal: isVisible, // eslint-disable-line camelcase
          required_in_portal: isRequired // eslint-disable-line camelcase
        }
      })
      return memo
    },
    {}
  )

export const updateConditionalVisibility = (customFields, formState, conditions) => {
  const conditionCheck = setupConditionCheck(customFields, formState)
  const conditionOverrides = getConditionOverrides(conditions, conditionCheck)

  const fields = _.map(customFields, field => {
    return { ...field, ...conditionOverrides[field.id] }
  })

  return fields
}

const getCustomFields = (customFields, formState, options, conditions = {}) => {
  const updatedFields = updateConditionalVisibility(customFields, formState, conditions)

  return getFields(updatedFields, formState, options)
}

const getFields = (customFields, formState, options) => {
  const mapFields = field => {
    // embeddable/ticket_fields.json will omit the visible_in_portal and editable_in_portal props for valid fields.
    // While the ticket_forms/show_many.json endpoint will always have them present even for invalid ones. This means
    // we must check if either are undefined or if both are true.
    const shouldShow =
      _.isUndefined(field.editable_in_portal) ||
      _.isUndefined(field.visible_in_portal) ||
      (field.editable_in_portal && field.visible_in_portal)
    if (!shouldShow) {
      return null
    }

    const showError = shouldRenderErrorMessage(
      formState[field.id],
      field.required_in_portal,
      options.showErrors
    )

    const { field: updatedField, errorMessage } = getFieldValues(field)
    updatedField.keyID = `${updatedField.id}`

    if (!updatedField) {
      return null
    }

    return (
      <FormField
        key={field.id}
        field={updatedField}
        errorMessage={showError ? errorMessage : null}
        value={formState[field.id]}
        onChange={() => {
          options.onChange()
        }}
      />
    )
  }

  const allFields = _.compact(_.map(customFields, mapFields))
  const withoutCheckboxes = _.compact(
    customFields.filter(field => field.type !== 'checkbox').map(mapFields)
  )
  const checkboxes = _.compact(
    customFields.filter(field => field.type === 'checkbox').map(mapFields)
  )

  return {
    fields: withoutCheckboxes,
    checkboxes: checkboxes,
    allFields
  }
}

const shouldRenderErrorMessage = (value, required, showErrors, pattern) => {
  const isRequiredCheckValid = !required || value
  const isPatternCheckValid = !value || (pattern ? pattern.test(value) : true)
  const isValid = isRequiredCheckValid && isPatternCheckValid

  return !isValid && showErrors
}

const getStyledLabelText = (label, required) => {
  if (!label) return null

  // Disallow all HTML elements in label argument, it will render as pure text
  const sanitizedLabel = sanitizeHtml(label, { allowedTags: [] })

  return required
    ? `<strong>${sanitizedLabel}</strong>`
    : i18n.t('embeddable_framework.validation.label.new_optional', {
        label: sanitizedLabel
      })
}

const renderLabel = (Component, label, required) => {
  const labelText = getStyledLabelText(label, required)

  return <Component dangerouslySetInnerHTML={{ __html: labelText }} />
}

export { getCustomFields, shouldRenderErrorMessage, renderLabel, getStyledLabelText }
