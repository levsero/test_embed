import React from 'react'
import _ from 'lodash'
import sanitizeHtml from 'sanitize-html'

import { i18n } from 'src/apps/webWidget/services/i18n'

const setupConditionCheck = (customFields, formState) => {
  return (fieldId, value) => {
    const field = _.find(customFields, (field) => field.id === fieldId)

    if (!field) return false

    if (field.type === 'checkbox') {
      // classic wants 0 and 1 so we use those as the values but conditions give us true and false
      return value === !!formState[fieldId]
    }

    return value === formState[fieldId]
  }
}

const getConditionOverrides = (conditions, conditionCheck) =>
  _.reduce(
    conditions,
    (memo, condition) => {
      const isFulfilled = conditionCheck(condition.parent_field_id, condition.value)

      condition.child_fields.forEach((child) => {
        // need to check if already set to false in case multiple conditions on the same element
        const isVisible = memo[child.id]
          ? memo[child.id].visible_in_portal || isFulfilled
          : isFulfilled
        const isRequired =
          (memo[child.id] ? memo[child.id].required_in_portal : false) ||
          (child.is_required && isFulfilled)

        memo[child.id] = {
          visible_in_portal: isVisible, // eslint-disable-line camelcase
          required_in_portal: isRequired, // eslint-disable-line camelcase
        }
      })
      return memo
    },
    {}
  )

export const updateConditionalVisibility = (customFields, formState, conditions) => {
  const conditionCheck = setupConditionCheck(customFields, formState)
  const conditionOverrides = getConditionOverrides(conditions, conditionCheck)

  const fields = _.map(customFields, (field) => {
    return { ...field, ...conditionOverrides[field.id] }
  })

  return fields
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
        label: sanitizedLabel,
      })
}

const renderLabel = (Component, label, required) => {
  const labelText = getStyledLabelText(label, required)

  return <Component dangerouslySetInnerHTML={{ __html: labelText }} />
}

export { shouldRenderErrorMessage, renderLabel, getStyledLabelText }
