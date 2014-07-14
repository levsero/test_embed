/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';
import { MessageFieldset, EmailField, IconField } from 'component/ZdForm';

var { Schema } = ReactForms.schema;

export var submitTicketSchema = (
  /* jshint quotmark:false */
  <Schema component={MessageFieldset}>
    <IconField
      name='fullname'
      ref='fullname'
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
      icon='foo u-alignTop'
      required
      input={
        <textarea
          rows='5'
          className='Arrange-sizeFill'
          placeholder='Give us details here...'
        />
      }
    />
  </Schema>
);

