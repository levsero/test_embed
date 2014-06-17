/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';
import { validation } from 'mixin/validation.js';

var { FormFor, Form } = ReactForms,
    Property = ReactForms.schema.Property;

export var ZdForm = React.createClass({
  handleSubmit(e) {
    var form = this.refs.form,
        formValue = form.value();

    this.props.submit(e, {
      isFormInvalid: ReactForms.validation.isFailure(formValue.validation),
      value: formValue.value
    });
  },

  render() {
    /* jshint quotmark:false */
    var form = this.transferPropsTo(
      <Form ref='form' component={React.DOM.div} />
    );

    return (
      <form onSubmit={this.handleSubmit} className={'Form ' + this.props.className}>
        {form}
        <div className='Arrange Arrange--middle'>
          <strong
            className='Arrange-sizeFill u-isActionable u-textSecondary'>
              Cancel
          </strong>
          <input
            type='submit'
            value='Submit Ticket'
            className='Button Button--default Button--cta Arrange-sizeFit u-textNoWrap'
          />
        </div>
      </form>
    );
  }
});

export var MessageFieldset = React.createClass({
  mixins: [ReactForms.FieldsetMixin],

  messageLength: function(name) {
    var val = this.value().value[name];
    return val && val.length >= 5;
  },

  showEmail: function() {
    /* jshint quotmark:false */
    return this.messageLength('description') && <FormFor name='email' />;
  },

  render: function() {
    /* jshint quotmark:false */
    return (
      <div>
        <FormFor name='description' />
        {this.showEmail()}
      </div>
    );
  }
});

export function EmailField(props) {
  /* jshint quotmark:false */
  props = props || {};
  return (
    <Property
      name={props.name || 'email'}
      label={props.name || 'Email'}
      required={props.required ? true : false}
      input={<input type='email' />}
      validate={function(v) {
        validation.validateEmail(v);
      }}
    />
  );
}
