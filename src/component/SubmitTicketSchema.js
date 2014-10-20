/** @jsx React.DOM */
module React from 'react/addons';
module ReactForms from 'react-forms';

import { EmailField, IconField, SelectField } from 'component/FormField';
import { i18n }                  from 'service/i18n';
import { isMobileBrowser }       from 'utility/devices';

var { Schema } = ReactForms.schema,
    classSet = React.addons.classSet,
    fieldClasses = classSet({
      'Arrange-sizeFill u-vsizeAll': true,
      'u-textSize15': isMobileBrowser()
    });

export var submitTicketSchema = function(customFields) {
  var ticketFields = [];

  _.forEach(customFields, function(field) {
    switch(field.type) {
      case 'text':
        ticketFields.push(
          <IconField name={field.title} placeholder={field.title} />
        );
        break;
      case 'tagger':
        ticketFields.push(
          <SelectField name={field.title} placeholder={field.title} options={field.options} />
        );
      default:
        break;
    }
  });

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
