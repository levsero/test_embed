import React from 'react';
import _ from 'lodash';

import { i18n } from 'service/i18n';
import { Field } from 'component/field/Field';
import { SelectField } from 'component/field/SelectField';

const geti18nContent = (field) => {
  const title = _.find(field.variants, (variant) => {
    return variant.localeId === i18n.getLocaleId();
  });

  return title ? title.content : field.title;
};

const getCustomFields = (customFields, formState, disableAutoComplete) => {
  const isCheckbox = (field) => {
    return field && field.props && field.props.type === 'checkbox';
  };
  const fields = _.map(customFields, (field) => {
    const isRequired = _.isNil(field.required_in_portal) ? field.required : field.required_in_portal;
    const title = field.title_in_portal || field.title;
    const sharedProps = {
      name: field.id,
      value: formState[field.id],
      required: isRequired,
      placeholder: title,
      key: title,
      disableAutoComplete
    };

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
        return <SelectField {...sharedProps} options={field.options} />;
      case 'integer':
        return <Field {...sharedProps} pattern='\d+' type='number' />;
      case 'decimal':
        return <Field {...sharedProps} pattern='\d*([.,]\d+)?' type='number' step='any' />;
      case 'textarea':
      case 'description':
        return <Field {...sharedProps} input={<textarea rows='5' />} />;
      case 'checkbox':
        return <Field {...sharedProps} label={field.title} type='checkbox' />;
    }
  });

  return {
    fields: _.reject(fields, isCheckbox),
    checkboxes: _.filter(fields, isCheckbox),
    allFields: fields
  };
};

export { getCustomFields };
