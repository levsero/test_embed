/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';
import { submitTicketSchema } from 'component/SubmitTicketSchema';
import { i18n               } from 'service/i18n';
require('imports?_=lodash!lodash');

var classSet = React.addons.classSet,
    SubmitTicketFormBody = ReactForms.Form,
    isFailure = ReactForms.validation.isFailure;

var SubmitTicketForm = React.createClass({
  getInitialState() {
    return {
      isValid: false,
      buttonMessage: i18n.t('embeddable_framework.submitTicket.form.submitButton.label'),
      isSubmitting: false
    };
  },

  getDefaultProps() {
    return {
      fullscreen: false
    };
  },

  handleSubmit(e) {
    var form = this.refs.form,
        formValue = form.value(),
        isFormInvalid = isFailure(formValue.validation);

    if (!isFormInvalid) {
      this.setState({
        buttonMessage: i18n.t('embeddable_framework.submitTicket.form.submitButton.label.sending'),
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
        ),
        buttonClasses = classSet({
          'Button Button--cta Anim-color u-textNoWrap': true,
          'u-pullRight': !this.props.fullscreen,
          'u-sizeFull': this.props.fullscreen
        });

    return (
      <form
        noValidate
        onSubmit={this.handleSubmit}
        className={'Form u-cf ' + this.props.className}>
        <legend className='Form-legend u-marginBS u-textBold u-extSizeMed'>
          {i18n.t('embeddable_framework.submitTicket.form.title')}
        </legend>
        {formBody}
        <input
          type='submit'
          value={this.state.buttonMessage}
          ref='submitButton'
          disabled={!this.state.isValid || this.state.isSubmitting}
          className={buttonClasses}
        />
      </form>
    );
  }
});

export { SubmitTicketForm };

