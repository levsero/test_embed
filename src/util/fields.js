import React from 'react';
import _ from 'lodash';

import { i18n } from 'service/i18n';
import { Field } from 'component/field/Field';
import { SelectField } from 'component/field/SelectField';
import { Dropdown } from 'component/field/Dropdown';
import { isMobileBrowser,
         isLandscape } from 'utility/devices';
import { Checkbox } from 'component/field/Checkbox';
import { document } from 'utility/globals';

const geti18nContent = (field) => {
  const title = _.find(field.variants, (variant) => {
    return variant.localeId === i18n.getLocaleId();
  });

  return title ? title.content : field.title;
};

const getCustomFields = (customFields, formState, options = {}) => {
  const isCheckbox = (field) => {
    return field && field.props && field.props.type === 'checkbox';
  };
  const mapFields = (field) => {
    const isRequired = _.isNil(field.required_in_portal) ? field.required : field.required_in_portal;
    const title = field.title_in_portal || field.title;
    const frameHeight = options.frameHeight === '100%'
                      ? document.documentElement.clientHeight
                      : options.frameHeight;
    const sharedProps = {
      name: field.id,
      value: formState[field.id],
      required: isRequired,
      placeholder: title,
      key: title,
      frameHeight,
      ...options,
      description: field.description,
      fullscreen: isMobileBrowser(),
      landscape: isLandscape()
    };
    const { clearCheckboxes } = formState;
    const { visible_in_portal: visible, editable_in_portal: editable } = field; // eslint-disable-line camelcase

    // embeddable/ticket_fields.json will omit the visible_in_portal and editable_in_portal props for valid fields.
    // While the ticket_forms/show_many.json endpoint will always have them present even for invalid ones. This means
    // we must check if either are undefined or if both are true.
    if (!(_.isUndefined(editable) || (editable && visible))) {
      return null;
    }

    if (field.variants) {
      sharedProps.placeholder = geti18nContent(field);
    }

    switch (field.type) {
      case 'text':
      case 'subject':
        return <Field {...sharedProps} />;
      case 'tagger':
        if (field.custom_field_options) {
          field.options = field.custom_field_options;
        }

        _.forEach(field.options, (option) => {
          if (option.name) {
            option.title = option.name;
          }

          if (option.variants) {
            option.title = geti18nContent(option);
          }
        });

        const defaultOption = _.find(field.options, (option) => option.default) || '';

        return options.showNewDropdown
             ? <Dropdown {...sharedProps} options={field.options} value={defaultOption} />
             : <SelectField {...sharedProps} options={field.options} />;

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
