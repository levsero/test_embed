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
    });

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

var getCustomFields = function(customFields) {
  /* jshint camelcase:false */
  var ticketFields = [];

  _.forEach(customFields, function(field) {
    switch(field.type) {
      case 'text':
        ticketFields.push(
          <IconField
            name={'ze'+field.id}
            required={field.required}
            placeholder={field.title}
          />
        );
        break;
      case 'tagger':
        ticketFields.push(
          <SelectField
            name={'ze'+field.id}
            required={field.required}
            placeholder={field.title}
            options={field.options}
          />
        );
        break;
      case 'integer':
        ticketFields.push(
          <IconField
            name={'ze'+field.id}
            placeholder={field.title}
            required={field.required}
            validate={function(v) {return /^\d+$/.test(v); }}
          />
        );
        break;
      case 'decimal':
        ticketFields.push(
          <IconField
            name={'ze'+field.id}
            required={field.required}
            placeholder={field.title}
            validate={function(v) {return /^\d*\.\d+$/.test(v); }}
          />
        );
        break;
      case 'textarea':
        /* jshint quotmark:false */
        ticketFields.push(
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
        break;
      case 'date':
        /* jshint quotmark:false */
        ticketFields.push(
          <IconField
            name={'ze'+field.id}
            required={field.required}
            placeholder={field.title}
          />
        );
        break;
      case 'checkbox':
        ticketFields.push(
          <CheckboxField
            name={'ze'+field.id}
            label={field.title}
            required={field.required}
          />
        );
        break;
      case 'regexp':
        ticketFields.push(
          <IconField
            name={'ze'+field.id}
            placeholder={field.title}
            required={field.required_in_portal}
            validate={function(v) {
              var regExp = new RegExp(field.regex_for_validation);
              return regExp.test(v);
            }}
          />
        );
        break;
      default:
        break;
    }
  });
  return ticketFields;
};
