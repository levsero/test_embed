/** @jsx React.DOM */
module React from 'react/addons';
module ReactForms from 'react-forms';

import { EmailField,
         CheckboxField,
         IconField,
         SelectField }     from 'component/FormField';
import { i18n }            from 'service/i18n';
import { isMobileBrowser } from 'utility/devices';

var { Schema } = ReactForms.schema,
    classSet = React.addons.classSet,
    fieldClasses = classSet({
      'Arrange-sizeFill u-vsizeAll': true,
      'u-textSize15': isMobileBrowser()
    }),
    getCustomFields;

export var submitTicketSchema = function(customFields) {
  var ticketFields = getCustomFields(customFields);

  return (
  /* jshint quotmark:false */

    <Schema>
      <IconField
        name='name'
        ref='name'
        icon='avatar'
        placeholder={i18n.t('embeddable_framework.submitTicket.field.name.label')}
      />
      <EmailField
        required
        icon='mail'
      />
      {ticketFields}
      <IconField
        name='description'
        ref='message'
        icon='msg u-alignTop'
        required
        input={
          <textarea
            rows='5'
            className={fieldClasses}
            placeholder={i18n.t('embeddable_framework.submitTicket.field.description.label')}
          />
        }
      />
    </Schema>
  );
};

getCustomFields = function(customFields) {
  return _.map(customFields, function(field) {
    if (field.variants) {
      _.forEach (field.variants, function(variant) {
        if (i18n.getLocaleId() === variant.id) {
          field.title = variant.content;
        }
      });
    }
    switch(field.type) {
      case 'text':
        return (
          <IconField
            name={'ze'+field.id}
            required={field.required}
            placeholder={field.title}
          />
        );
      case 'tagger':
        return (
          <SelectField
            name={'ze'+field.id}
            required={field.required}
            placeholder={field.title}
            options={field.options}
          />
        );
      case 'integer':
        return (
          <IconField
            name={'ze'+field.id}
            placeholder={field.title}
            required={field.required}
            validate={function(v) {return /^\d+$/.test(v); }}
          />
        );
      case 'decimal':
        return (
          <IconField
            name={'ze'+field.id}
            required={field.required}
            placeholder={field.title}
            validate={function(v) {return /^\d*\.\d+$/.test(v); }}
          />
        );
      case 'textarea':
        /* jshint quotmark:false */
        return (
          <IconField
            name={'ze'+field.id}
            required={field.required}
            input={
              <textarea
                rows='2'
                className={fieldClasses}
                placeholder={field.title}
              />
            }
          />
        );
      case 'checkbox':
        return (
          <CheckboxField
            name={'ze'+field.id}
            label={field.title}
            required={field.required}
          />
        );
      default:
        break;
    }
  });
};
