/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';
import { validation } from 'mixin/validation.js';
require('imports?_=lodash!lodash');

var { FormFor, Form } = ReactForms,
    Property = ReactForms.schema.Property,
    Animate = React.addons.CSSTransitionGroup;

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
        {this.props.children}
      </form>
    );
  }
});

export var MessageFieldset = React.createClass({
  mixins: [ReactForms.FieldsetMixin],

  getInitialState() {
    return {
      emailKey: _.uniqueId('email_')
    };
  },

  messageLength(name) {
    var val = this.value().value[name];
    return val && val.length >= 5;
  },

  showEmail() {
    /* jshint quotmark:false */
    return (
      this.messageLength('description') &&
      // Empty span is rendered so the Animate component won't throw
      <FormFor key={this.state.emailKey} name='email' /> || <span />
    );
  },

  render() {
    /* jshint quotmark:false */
    return (
      <div>
        <FormFor name='description' />
        <Animate transitionName='FadeIn' transitionLeave={false} component={React.DOM.div}>
          {this.showEmail()}
        </Animate>
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
