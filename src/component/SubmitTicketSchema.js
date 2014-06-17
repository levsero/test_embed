/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';
import { MessageFieldset, EmailField } from 'component/ZdForm';

var { Schema, Property } = ReactForms.schema;

export var submitTicketSchema = (
  /* jshint quotmark:false */
  <Schema component={MessageFieldset}>
    <Property
      name='description'
      label='Message'
      ref='message'
      required
      input={<textarea rows='5' placeholder='Give us details here...' />}
    />
    <EmailField required />
  </Schema>
);

