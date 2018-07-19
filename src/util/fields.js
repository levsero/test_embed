import React from 'react';
import _ from 'lodash';

import { Dropdown } from 'component/field/Dropdown';
import { isMobileBrowser,
  isLandscape } from 'utility/devices';
import { TextField, Textarea, Label, Input } from '@zendeskgarden/react-textfields';
import { Checkbox, Label as CheckboxLabel, Hint } from '@zendeskgarden/react-checkboxes';
import { locals as styles } from './fields.scss';
import classNames from 'classnames';

const getCustomFields = (customFields, formState, options = {}) => {
  const renderField = (sharedProps) => {
    return (
      <TextField className={styles.fieldContainer} key={sharedProps.key}>
        <Label className={labelStyle()}>
          {sharedProps.label}
        </Label>
        <Input className={styles.fieldInput} {...sharedProps} />
      </TextField>
    );
  };
  const isCheckbox = (field) => {
    return field && field.type === Checkbox;
  };
  const labelStyle = () => {
    return classNames(
      {
        [styles.fieldLabelMobile]: isMobileBrowser()
      }
    );
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

        return <Dropdown {...sharedProps} options={field.custom_field_options} value={defaultOption} />;

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
          <TextField className={styles.fieldContainer} key={sharedProps.key}>
            <Label className={labelStyle()}>
              {sharedProps.label}
            </Label>
            <Textarea className={styles.textareaInput} {...sharedProps} rows='5' />
          </TextField>
        );

      case 'checkbox':
        const descriptionClasses = classNames(
          {
            [styles.checkboxDescriptionMobile]: isMobileBrowser(),
            [styles.fieldLabelMobile]: isMobileBrowser()
          }
        );
        const labelClasses = isMobileBrowser() ? styles.hasCheckboxMobile : '';
        const description = field.description
          ? <Hint className={descriptionClasses}>{field.description}</Hint>
          : '';

        return (
          <Checkbox wrapperProps={{ className: styles.fieldContainer }} {...sharedProps}>
            <CheckboxLabel className={`${labelStyle()} ${labelClasses}`}>{title}</CheckboxLabel>
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
