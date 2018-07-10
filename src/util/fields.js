import React from 'react';
import _ from 'lodash';

import { NestedDropdown } from 'component/field/NestedDropdown';
import { isMobileBrowser,
  isLandscape } from 'utility/devices';
import { TextField, Textarea, Label, Input, Hint } from '@zendeskgarden/react-textfields';
import { Checkbox, Label as CheckboxLabel, Hint as CheckboxHint } from '@zendeskgarden/react-checkboxes';

const getCustomFields = (customFields, formState, options = {}) => {
  const renderField = (sharedProps) => {
    return (
      <TextField key={sharedProps.key}>
        <Label>
          {sharedProps.label}
        </Label>
        {renderDescription(sharedProps)}
        <Input {...sharedProps} />
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
      name: field.id,
      label: title,
      required: !!field.required_in_portal,
      'aria-required': !!field.required_in_portal,
      value: formState[field.id]
    };
    const { visible_in_portal: visible, editable_in_portal: editable } = field; // eslint-disable-line camelcase

    // embeddable/ticket_fields.json will omit the visible_in_portal and editable_in_portal props for valid fields.
    // While the ticket_forms/show_many.json endpoint will always have them present even for invalid ones. This means
    // we must check if either are undefined or if both are true.
    if (!(_.isUndefined(editable) || (editable && visible))) {
      return null;
    }

    switch (field.type) {
      case 'text':
      case 'subject':
        return renderField(sharedProps);

      case 'tagger':
        const defaultOption = _.find(field.custom_field_options, (option) => option.default);

        return <NestedDropdown {...sharedProps} options={field.custom_field_options} value={defaultOption} />;

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
        return (
          <TextField key={sharedProps.key}>
            <Label>
              {sharedProps.label}
            </Label>
            {renderDescription(sharedProps)}
            <Textarea {...sharedProps} rows='5' />
          </TextField>
        );

      case 'checkbox':
        const description = field.description
          ? <CheckboxHint>{field.description}</CheckboxHint>
          : '';

        return (
          <Checkbox {...sharedProps}>
            <CheckboxLabel>{title}</CheckboxLabel>
            {description}
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

export { getCustomFields };
