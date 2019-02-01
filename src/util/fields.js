import React from 'react';
import _ from 'lodash';
import sanitizeHtml from 'sanitize-html';

import { i18n } from 'service/i18n';
import { NestedDropdown } from 'component/field/Dropdown/NestedDropdown';
import { isMobileBrowser,
  isLandscape } from 'utility/devices';
import { TextField, Textarea, Label, Input, Hint, Message } from '@zendeskgarden/react-textfields';
import {
  Checkbox,
  Label as CheckboxLabel,
  Hint as CheckboxHint,
  Message as CheckboxMessage } from '@zendeskgarden/react-checkboxes';
import { Label as DropdownLabel } from '@zendeskgarden/react-select';

const getDefaultFieldValues = (elementType, existingValue) => {
  switch (elementType) {
    case 'text':
    case 'subject':
    case 'integer':
    case 'decimal':
    case 'textarea':
    case 'description':
      return { value: existingValue || '' };
    case 'checkbox':
      return { checked: existingValue || false };
    default:
      return { value: existingValue };
  }
};

const getCustomFields = (customFields, formState, options = {}) => {
  const renderField = (sharedProps) => {
    const error = renderErrorMessage(sharedProps, formState);
    const props = {
      ...sharedProps,
      validation: error ? 'error': 'none'
    };

    return (
      <TextField key={sharedProps.key}>
        {renderLabel(Label, sharedProps.label, sharedProps.required)}
        {renderDescription(sharedProps)}
        <Input {...props} />
        {error}
      </TextField>
    );
  };
  const renderDescription = (field) => {
    return field.description
      ? <Hint>{field.description}</Hint>
      : '';
  };
  const isCheckbox = (field) => {
    return field && field.type === Checkbox;
  };
  const renderErrorMessage = (fieldProps, formState) => {
    const { required, showErrors, pattern } = fieldProps;
    const value = formState[fieldProps.name];

    return shouldRenderErrorMessage(value, required, showErrors, pattern)
      ? <Message validation='error'>{i18n.t(fieldProps.errorString)}</Message>
      : null;
  };
  const mapFields = (field) => {
    const title = field.title_in_portal || '';
    const sharedProps = {
      ...options,
      getFrameContentDocument: options.getFrameContentDocument,
      description: field.description,
      fullscreen: isMobileBrowser(),
      key: title,
      landscape: isLandscape(),
      name: _.toString(field.id),
      label: title,
      errorString: 'embeddable_framework.validation.error.input',
      required: !!field.required_in_portal,
      'aria-required': !!field.required_in_portal,
      ...getDefaultFieldValues(field.type, formState[field.id])
    };
    const { visible_in_portal: visible, editable_in_portal: editable } = field; // eslint-disable-line camelcase

    // embeddable/ticket_fields.json will omit the visible_in_portal and editable_in_portal props for valid fields.
    // While the ticket_forms/show_many.json endpoint will always have them present even for invalid ones. This means
    // we must check if either are undefined or if both are true.
    if (!(_.isUndefined(editable) || (editable && visible))) {
      return null;
    }

    const renderError = shouldRenderErrorMessage(
      formState[sharedProps.name],
      sharedProps.required,
      sharedProps.showErrors
    );

    switch (field.type) {
      case 'text':
      case 'subject':
        return renderField(sharedProps);

      case 'tagger':
        const defaultOption = _.find(field.custom_field_options, (option) => option.default);
        const dropdownProps = {
          ...sharedProps,
          showError: renderError,
          options: field.custom_field_options,
          defaultOption,
          label: renderLabel(DropdownLabel, sharedProps.label, sharedProps.required),
          formState
        };

        return <NestedDropdown {...dropdownProps} />;

      case 'integer':
        const integerFieldProps = {
          ...sharedProps,
          pattern: /\d+/,
          type: 'number',
          errorString: 'embeddable_framework.validation.error.number'
        };

        return renderField(integerFieldProps);

      case 'decimal':
        const decimalFieldProps = {
          ...sharedProps,
          pattern: /\d*([.,]\d+)?/,
          type: 'number',
          step: 'any',
          errorString: 'embeddable_framework.validation.error.number'
        };

        return renderField(decimalFieldProps);

      case 'textarea':
      case 'description':
        const descError = renderErrorMessage(sharedProps, formState);
        const descProps = {
          ...sharedProps,
          validation: descError ? 'error': 'none'
        };

        return (
          <TextField key={sharedProps.key}>
            {renderLabel(Label, sharedProps.label, sharedProps.required)}
            {renderDescription(sharedProps)}
            <Textarea {...descProps} rows='5' />
            {descError}
          </TextField>
        );

      case 'checkbox':
        const description = field.description
          ? <CheckboxHint>{field.description}</CheckboxHint>
          : '';
        const checkboxError = renderError
          ? (
            <CheckboxMessage validation='error'>
              {i18n.t('embeddable_framework.validation.error.checkbox')}
            </CheckboxMessage>
          )
          : null;
        const checkboxProps = {
          ...sharedProps,
          validation: checkboxError ? 'error': 'none'
        };

        return (
          <Checkbox {...checkboxProps}>
            {renderLabel(CheckboxLabel, title, sharedProps.required, { style: 'margin-top: 1px !important;' })}
            {description}
            {checkboxError}
          </Checkbox>
        );
    }
  };

  const fields = _.compact(_.map(customFields, mapFields));

  return {
    fields: _.reject(fields, isCheckbox),
    checkboxes: _.filter(fields, isCheckbox),
    allFields: fields
  };
};

const shouldRenderErrorMessage = (value, required, showErrors, pattern) => {
  const isRequiredCheckValid = !required || value;
  const isPatternCheckValid = !value || (pattern ? pattern.test(value) : true);
  const isValid = isRequiredCheckValid && isPatternCheckValid;

  return !isValid && showErrors;
};

const getStyledLabelText = (label, required) => {
  if (!label) return null;

  // Disallow all HTML elements in label argument, it will render as pure text
  const sanitizedLabel = sanitizeHtml(label, { allowedTags: [] });

  return (required)
    ? `<strong>${sanitizedLabel}</strong>`
    : i18n.t('embeddable_framework.validation.label.new_optional', { label: sanitizedLabel });
};

const renderLabel = (Component, label, required) => {
  const labelText = getStyledLabelText(label, required);

  return (
    <Component dangerouslySetInnerHTML={{ __html: labelText }} />
  );
};

export {
  getCustomFields,
  shouldRenderErrorMessage,
  renderLabel,
  getStyledLabelText,

  // Exported for testing
  getDefaultFieldValues
};
