import React from 'react'
import _ from 'lodash'
import sanitizeHtml from 'sanitize-html'

import { i18n } from 'service/i18n'
import { isMobileBrowser, isLandscape } from 'utility/devices'
import { Label } from '@zendeskgarden/react-textfields'
import { Label as DropdownLabel } from '@zendeskgarden/react-select'
import { Checkbox, Text, TextArea, Dropdown } from 'src/component/field'
import { SlideAppear } from 'component/transition/SlideAppear'

const TICKET_FIELD_TRANSITION_DURATION = 150

const getDefaultFieldValues = (elementType, existingValue) => {
  switch (elementType) {
    case 'text':
    case 'subject':
    case 'integer':
    case 'decimal':
    case 'textarea':
    case 'description':
      return { value: existingValue || '' }
    case 'checkbox':
      return { checked: existingValue || 0 }
    default:
      return { value: existingValue }
  }
}

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
  const renderField = sharedProps => {
    const props = {
      ...sharedProps,
      Component: Label
    }

    return <Text key={sharedProps.key} {...props} inputProps={props} />
  }

  const isCheckbox = field => {
    return _.get(field, 'props.children.type') === Checkbox
  }

  const mapFields = field => {
    const title = field.title_in_portal || ''
    const sharedProps = {
      ...options,
      getFrameContentDocument: options.getFrameContentDocument,
      description: field.description,
      fullscreen: isMobileBrowser(),
      key: title,
      landscape: isLandscape(),
      name: _.toString(field.id),
      label: title,
      errorString: i18n.t('embeddable_framework.validation.error.input'),
      required: !!field.required_in_portal,
      'aria-required': !!field.required_in_portal,
      ...getDefaultFieldValues(field.type, formState[field.id])
    }

    const { visible_in_portal: visible, editable_in_portal: editable } = field // eslint-disable-line camelcase

    const showError = shouldRenderErrorMessage(
      formState[sharedProps.name],
      sharedProps.required,
      sharedProps.showErrors
    )

    // embeddable/ticket_fields.json will omit the visible_in_portal and editable_in_portal props for valid fields.
    // While the ticket_forms/show_many.json endpoint will always have them present even for invalid ones. This means
    // we must check if either are undefined or if both are true.
    const shouldShow = _.isUndefined(editable) || _.isUndefined(visible) || (editable && visible),
      duration = TICKET_FIELD_TRANSITION_DURATION

    sharedProps.showError = showError

    switch (field.type) {
      case 'text':
      case 'subject':
        return (
          <SlideAppear key={field.id} duration={duration} trigger={shouldShow}>
            {renderField(sharedProps)}
          </SlideAppear>
        )

      case 'tagger':
        const defaultOption = _.find(field.custom_field_options, option => option.default)
        const dropdownProps = {
          ...sharedProps,
          options: field.custom_field_options,
          defaultOption,
          label: renderLabel(DropdownLabel, sharedProps.label, sharedProps.required),
          formState
        }

        return (
          <SlideAppear key={field.id} duration={duration} trigger={shouldShow}>
            <Dropdown {...dropdownProps} />
          </SlideAppear>
        )

      case 'integer':
        const integerFieldProps = {
          ...sharedProps,
          pattern: /\d+/,
          type: 'number',
          errorString: i18n.t('embeddable_framework.validation.error.number')
        }

        return (
          <SlideAppear key={field.id} duration={duration} trigger={shouldShow}>
            {renderField(integerFieldProps)}
          </SlideAppear>
        )

      case 'decimal':
        const decimalFieldProps = {
          ...sharedProps,
          pattern: /\d*([.,]\d+)?/,
          type: 'number',
          step: 'any',
          errorString: i18n.t('embeddable_framework.validation.error.number')
        }

        return (
          <SlideAppear key={field.id} duration={duration} trigger={shouldShow}>
            {renderField(decimalFieldProps)}
          </SlideAppear>
        )

      case 'textarea':
      case 'description':
        const textAreaProps = {
          ...sharedProps
        }

        return (
          <SlideAppear key={field.id} duration={duration} trigger={shouldShow}>
            <TextArea {...textAreaProps} textareaProps={textAreaProps} />
          </SlideAppear>
        )

      case 'checkbox':
        return (
          <SlideAppear key={field.id} duration={duration} trigger={shouldShow}>
            <Checkbox
              key={sharedProps.key}
              errorString={i18n.t('embeddable_framework.validation.error.checkbox')}
              showError={showError}
              description={field.description}
              label={getStyledLabelText(title, sharedProps.required)}
              checkboxProps={sharedProps}
            />
          </SlideAppear>
        )
    }
  }

  const fields = _.compact(_.map(customFields, mapFields))

  return {
    fields: _.reject(fields, isCheckbox),
    checkboxes: _.filter(fields, isCheckbox),
    allFields: fields
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

export {
  getCustomFields,
  shouldRenderErrorMessage,
  renderLabel,
  getStyledLabelText,
  // Exported for testing
  getDefaultFieldValues
}
