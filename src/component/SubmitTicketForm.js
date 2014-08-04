/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';
import { submitTicketSchema } from 'component/SubmitTicketSchema';
require('imports?_=lodash!lodash');

var SubmitTicketFormBody = ReactForms.Form,
    isFailure = ReactForms.validation.isFailure;

var SubmitTicketForm = React.createClass({
  getInitialState() {
    return {
      isValid: false,
      buttonMessage: 'Send',
      isSubmitting: false
    };
  },

  handleSubmit(e) {
    var form = this.refs.form,
        formValue = form.value(),
        isFormInvalid = isFailure(formValue.validation);

    if (!isFormInvalid) {
      this.setState({
        buttonMessage: 'Submitting...',
        isSubmitting: true
      });
    }

    this.props.submit(e, {
      isFormInvalid: isFormInvalid,
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
        className={'Form u-cf ' + this.props.className}>
        <legend className='Form-legend u-marginBS u-textBold u-extSizeMed'>
          Leave us a message
        </legend>
        {formBody}
        <input
          type='submit'
          value={this.state.buttonMessage}
          ref='submitButton'
          disabled={!this.state.isValid || this.state.isSubmitting}
          className='Button Button--cta Anim-color u-pullRight u-textNoWrap'
        />
      </form>
    );
  }
});

export { SubmitTicketForm };

