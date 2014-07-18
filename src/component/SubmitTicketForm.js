/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';
import { submitTicketSchema } from 'component/SubmitTicketSchema';
require('imports?_=lodash!lodash');

var SubmitTicketFormBody = ReactForms.Form;

var SubmitTicketForm = React.createClass({
  getInitialState() {
    return {
      isValid: false,
      autoFocus: false
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
        className={'Form u-cf ' + this.props.className}>
        <legend className='Form-legend u-marginBS u-textBold u-extSizeMed'>
          Leave us a message
        </legend>
        {formBody}
        <input
          type='submit'
          value='Send'
          ref='submitButton'
          disabled={!this.state.isValid}
          className='Button Button--cta Anim-color u-pullRight u-textNoWrap'
        />
      </form>
    );
  }
});

export { SubmitTicketForm };

