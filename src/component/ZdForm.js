/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';
import { validation } from 'mixin/validation.js';

var Form = ReactForms.Form,
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
        <input
          type='submit'
          className='Button Button--default Button--cta u-pullRight'
        />
      </form>
    );
  }
});

export function EmailField(props) {
  props = props || {};
  return (
    <Property
      name={props.name || 'email'}
      label={props.name || 'Email'}
      required={props.required ? true : false}
      validate={function(v) {
        validation.validateEmail(v);
      }}
    />
  );
}
