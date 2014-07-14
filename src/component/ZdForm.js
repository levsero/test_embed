/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';
import { validation } from 'mixin/validation';
require('imports?_=lodash!lodash');

var { FormFor, Form, FieldMixin } = ReactForms,
    ZdFormBody = Form,
    Property = ReactForms.schema.Property,
    isFailure = ReactForms.validation.isFailure,
    classSet = React.addons.classSet;

var ZdForm = React.createClass({
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
    var formBody = this.transferPropsTo(
      <ZdFormBody ref='form' component={React.DOM.div} />
    );

    return (
      <form
        noValidate
        onSubmit={this.handleSubmit}
        className={'Form ' + this.props.className}>
        {formBody}
        {this.props.children}
      </form>
    );
  }
});

var MessageFieldset = React.createClass({
  mixins: [ReactForms.FieldsetMixin],

  getInitialState() {
    return {
      emailKey: _.uniqueId('email_')
    };
  },

  render() {
    /* jshint quotmark:false */
    return (
      <div>
        <FormFor name='fullname' />
        <FormFor name='description' />
        <FormFor name='email' />
      </div>
    );
  }
});

var FocusField = React.createClass({
  mixins: [FieldMixin],

  getInitialState() {
    return {
      focused: false
    };
  },

  onFocus() {
    this.setState({
      focused: true
    });
  },

  onBlur() {
    this.setState({
      focused: false
    });
  },

  render() {
    var value = this.value(),
        isInvalid = isFailure(value.validation),
        classNames = classSet({
          'Arrange Arrange--middle rf-Field': true,
          'rf-Field--focused': this.state.focused,
          'rf-Field--invalid': isInvalid,
          'rf-Field--dirty': !value.isUndefined
        });

console.log(this.input);
    return (
      <div className={classNames}>
        <i className={'Arrange-sizeFit Icon Icon--' + this.props.name} />
        {this.transferPropsTo(this.renderInputComponent({
          onFocus: this.onFocus,
          onBlur: this.onBlur
        }))}
      </div>
    );
  }
});

function IconField(props) {
  props = props || {};

  /* jshint quotmark:false */
  return (
    <Property
      name={props.name}
      ref={props.ref}
      required={!!props.required}
      icon={props.icon || ''}
      input={
        props.input ||
        <input placeholder={props.placeholder} className='Arrange-sizeFill' />
      }
      validate={props.validate || ''}
      component={FocusField}
    />
  );
}

function EmailField(props) {
  var type = 'email';

  return IconField({
    name: props.name || type,
    ref: props.ref || type,
    required: !!props.required,
    icon: props.icon,
    input: (
      /* jshint quotmark:false */
      <input
        type={type}
        placeholder='Email address'
        className='Arrange-sizeFill' />
    ),
    validate: function(value) {
      return validation.validateEmail(value);
    }
  });
}

export { ZdForm, MessageFieldset, FocusField, IconField, EmailField };

