import React from 'react';
import _ from 'lodash';

import { Field } from 'component/field/Field';
import { Dropdown } from 'component/field/Dropdown';
import { isMobileBrowser,
  isLandscape } from 'utility/devices';
import { Checkbox } from 'component/field/Checkbox';

const getCustomFields = (customFields, formState, options = {}) => {
  const isCheckbox = (field) => {
    return field && field.props && field.props.type === 'checkbox';
  };
  const mapFields = (field) => {
    const title = field.title_in_portal || '';
    const sharedProps = {
      ...options,
      getFrameDimensions: options.getFrameDimensions,
      description: field.description,
      fullscreen: isMobileBrowser(),
      key: title,
      landscape: isLandscape(),
      name: field.id,
      label: title,
      required: !!field.required_in_portal,
      value: formState[field.id]
    };
    const { clearCheckboxes } = formState;
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
        return <Field {...sharedProps} />;
      case 'tagger':
        const defaultOption = _.find(field.custom_field_options, (option) => option.default);

        return <Dropdown {...sharedProps} options={field.custom_field_options} value={defaultOption} />;

      case 'integer':
        return <Field {...sharedProps} pattern='\d+' type='number' />;
      case 'decimal':
        return <Field {...sharedProps} pattern='\d*([.,]\d+)?' type='number' step='any' />;
      case 'textarea':
      case 'description':
        return <Field {...sharedProps} input={<textarea rows='5' />} />;
      case 'checkbox':
        return <Checkbox {...sharedProps} uncheck={!!clearCheckboxes} label={title} type='checkbox' />;
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
