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

const getCustomFields = (customFields, formState) => {
  const isCheckbox = (field) => field.props.type === 'checkbox';
  const fields = _.map(customFields, (field) => {
    const sharedProps = {
      name: field.id,
      value: formState[field.id],
      required: field.required,
      placeholder: field.title,
      key: field.title
    };

    if (field.variants) {
      sharedProps.placeholder = geti18nContent(field);
    }

    switch (field.type) {
    case 'text':
      return <Field {...sharedProps} />;
    case 'tagger':
      _.forEach(field.options, (option) => {
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
      return <Field {...sharedProps} input={<textarea rows='5' />} />;
    case 'checkbox':
      return <Field {...sharedProps} label={field.title} type='checkbox' />;
    }
  });

  return {
    fields: _.reject(fields, isCheckbox),
    checkboxes: _.filter(fields, isCheckbox)
  };
};

export { getCustomFields };
