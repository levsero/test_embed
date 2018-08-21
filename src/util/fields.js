import React from 'react';
import _ from 'lodash';

import { i18n } from 'service/i18n';
import { NestedDropdown } from 'component/field/NestedDropdown';
import { isMobileBrowser,
  isLandscape } from 'utility/devices';
import { TextField, Textarea, Label, Input, Hint, Message } from '@zendeskgarden/react-textfields';
import {
  Checkbox,
  Label as CheckboxLabel,
  Hint as CheckboxHint,
  Message as CheckboxMessage } from '@zendeskgarden/react-checkboxes';

const getDefaultFieldValues = (elementType, existingValue) => {
  switch (elementType) {
    case 'text':
    case 'subject':
    case 'integer':
    case 'decimal':
    case 'textarea':
    case 'description':
      return existingValue || '';
    case 'checkbox':
      return existingValue || false;
    default:
      return existingValue;
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
        <Label>
          {renderLabelText(sharedProps.label, sharedProps.required)}
        </Label>
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
      getFrameDimensions: options.getFrameDimensions,
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
      value: getDefaultFieldValues(field.type, formState[field.id])
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
          label: renderLabelText(sharedProps.label, sharedProps.required)
        };

        return <NestedDropdown {...dropdownProps} />;

      case 'integer':
        const integerFieldProps = {
          ...sharedProps,
          pattern: /\d+/,
          type: 'number'
        };

        return renderField(integerFieldProps);

      case 'decimal':
        const decimalFieldProps = {
          ...sharedProps,
          pattern: /\d*([.,]\d+)?/,
          type: 'number',
          step: 'any'
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
            <Label>
              {renderLabelText(sharedProps.label, sharedProps.required)}
            </Label>
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
            <CheckboxLabel>{renderLabelText(title, sharedProps.required)}</CheckboxLabel>
            {description}
            {checkboxError}
          </Checkbox>
        );
    }
  };

  const fields = _.chain(customFields)
    .map(mapFields)
    .compact()
    .value();

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

const renderLabelText = (label, required) => {
  return (required || !label) ? label : i18n.t('embeddable_framework.validation.label.optional', { label });
};

export {
  getCustomFields,
  shouldRenderErrorMessage,
  renderLabelText,

  // Exported for testing
  getDefaultFieldValues
};
