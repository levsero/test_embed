/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';
import { validation } from 'mixin/validation';
import { submitTicketSchema } from 'component/SubmitTicketSchema';
require('imports?_=lodash!lodash');

var { Form, FieldMixin } = ReactForms,
    SubmitTicketFormBody = Form,
    Property = ReactForms.schema.Property,
    isFailure = ReactForms.validation.isFailure,
    classSet = React.addons.classSet;

    console.log(submitTicketSchema)

var SubmitTicketForm = React.createClass({
  getInitialState() {
    return {
      isValid: false
    };
  },

  handleSubmit(e) {
    var form = this.refs.form,
        formValue = form.value();

    this.props.submit(e, {
      isFormInvalid: ReactForms.validation.isFailure(formValue.validation),
      value: formValue.value
    });
  },

  handleUpdate(values, isValid) {
    this.setState({isValid: isValid});
  },

  render() {
    /* jshint quotmark:false */
    var formBody = this.transferPropsTo(
      <SubmitTicketFormBody
        ref='form'
        schema={submitTicketSchema}
        onUpdate={this.handleUpdate}
        component={React.DOM.div} />
    );

    return (
      <form
        noValidate
        onSubmit={this.handleSubmit}
        className={'Form ' + this.props.className}>
        <h1 className='u-marginVS u-textSizeMed'>
          Leave us a message
        </h1>
        {formBody}
        <input
          type='submit'
          value='Send'
          ref='submitButton'
          disabled={!this.state.isValid}
          className='Button Button--default Button--cta u-pullRight u-textNoWrap'
        />
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
        <FormFor name='email' />
        <FormFor name='description' />
      </div>
    );
  }
});

function focusFieldFactory(props) {
  props = props || {};
  return function () {
    return FocusField(props);
  };
}

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
          'Arrange Arrange--middle rf-Field u-isSelectable': true,
          'rf-Field--focused': this.state.focused,
          'rf-Field--invalid': isInvalid,
          'rf-Field--dirty': !value.isUndefined
        }),
        id = this.props.name;

    return (
      <label for={id} className={classNames}>
        <i className={'Arrange-sizeFit u-isActionable Icon Icon--' + this.props.icon} />
        {this.transferPropsTo(this.renderInputComponent({
          id: id,
          onFocus: this.onFocus,
          onBlur: this.onBlur
        }))}
      </label>
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
      component={focusFieldFactory(props)}
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

export { SubmitTicketForm, MessageFieldset, IconField, EmailField };

