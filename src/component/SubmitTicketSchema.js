/** @jsx React.DOM */
module React from 'react/addons';
module ReactForms from 'react-forms';

import { EmailField, IconField } from 'component/FormField';
import { i18n }                  from 'service/i18n';

i18n.init();

var { Schema } = ReactForms.schema;

export var submitTicketSchema = (
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
    <IconField
      name='description'
      ref='message'
      icon='msg u-alignTop'
      required
      input={
        <textarea
          rows='5'
          className='Arrange-sizeFill u-vsizeAll'
          placeholder={i18n.t('embeddable_framework.submitTicket.field.description.label')}
        />
      }
    />
  </Schema>
);

