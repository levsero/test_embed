import React from 'react';
import _ from 'lodash';
import sanitizeHtml from 'sanitize-html';

import { i18n } from 'service/i18n';
import {
  isMobileBrowser,
  isLandscape
} from 'utility/devices';
import { Label } from '@zendeskgarden/react-textfields';
import { Label as DropdownLabel } from '@zendeskgarden/react-select';
import {
  Checkbox,
  Label as LabelComponent,
  Text,
  TextArea,
  Dropdown,
} from 'src/component/field';

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
      return { checked: existingValue || 0 };
    default:
      return { value: existingValue };
  }
};

const getCustomFields = (customFields, formState, options = {}) => {
  const renderField = (sharedProps) => {
    const { required, showErrors, pattern } = sharedProps;
    const showError = shouldRenderErrorMessage(formState[sharedProps.name], required, showErrors, pattern);

    const props = {
      ...sharedProps,
      Component: Label,
      errorString: i18n.t(sharedProps.errorString),
      showError,
    };

    return (
      <Text key={sharedProps.key} {...props} inputProps={props}/>
    );
  };

  const isCheckbox = (field) => {
    return field && field.type === Checkbox;
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

    sharedProps.showError = renderError;

    switch (field.type) {
      case 'text':
      case 'subject':
        return renderField(sharedProps);

      case 'tagger':
        const defaultOption = _.find(field.custom_field_options, (option) => option.default);
        const dropdownProps = {
          ...sharedProps,
          options: field.custom_field_options,
          defaultOption,
          label: renderLabel(DropdownLabel, sharedProps.label, sharedProps.required),
          formState
        };

        return <Dropdown {...dropdownProps} />;

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
        const textAreaProps = {
          ...sharedProps,
          showError: renderError,
        };

        return (
          <TextArea {...textAreaProps} textareaProps={textAreaProps} />
        );

      case 'checkbox':
        return (
          <Checkbox
            key={sharedProps.key}
            errorString={i18n.t('embeddable_framework.validation.error.checkbox')}
            showError={renderError}
            description={field.description}
            label={getStyledLabelText(title, sharedProps.required)}
            checkboxProps={sharedProps}
          />
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
  return (<LabelComponent Component={Component} label={label} required={required} />);
};

export {
  getCustomFields,
  shouldRenderErrorMessage,
  renderLabel,
  getStyledLabelText,

  // Exported for testing
  getDefaultFieldValues
};
