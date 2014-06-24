/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';

var { Schema, Property } = ReactForms.schema;

 export var helpCenterSchema = (
  /* jshint quotmark:false */
  <Schema >
    <Property
      name='description'
      label='Message'
      ref='message'
      input={<textarea rows='5' placeholder='Give us details here...' />}
    />
  </Schema>
);

