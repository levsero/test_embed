/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';
import { EmailField, IconField } from 'component/FormField';

var { Schema } = ReactForms.schema;

export var submitTicketSchema = (
  /* jshint quotmark:false */
  <Schema>
    <IconField
      name='name'
      ref='name'
      icon='avatar'
      placeholder='Your name'
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
          placeholder='How can we help you?'
        />
      }
    />
  </Schema>
);

