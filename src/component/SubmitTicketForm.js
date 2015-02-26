/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';

import { submitTicketSchema } from 'component/SubmitTicketSchema';
import { Button }             from 'component/Button';
import { i18n }               from 'service/i18n';
require('imports?_=lodash!lodash');

var classSet = React.addons.classSet,
    SubmitTicketFormBody = ReactForms.Form,
    isFailure = ReactForms.validation.isFailure;

var SubmitTicketForm = React.createClass({
  getInitialState() {
    return {
      isValid: false,
      buttonMessage: i18n.t('embeddable_framework.submitTicket.form.submitButton.label.send'),
      isSubmitting: false,
      isRTL: i18n.isRTL(),
      removeTicketForm: false
    };
  },

  getDefaultProps() {
    return {
      fullscreen: false
    };
  },

  componentDidUpdate() {
    if (this.refs.form && this.state.formState) {
      this.refs.form.updateValue(this.state.formState);
    }
  },

  resetTicketFormVisibility() {
    // if the user closes and reopens, we need to
    // re-render the search field
    this.setState({
      removeTicketForm: false
    });
  },

  focusField() {
    var form = this.refs.form.getDOMNode(),
        element;

    // Focus on the first empty text or textarea
    element = _.find(form.querySelectorAll('input, textarea'), function(input) {
      return input.value === '' && _.contains(['text', 'textarea', 'email'], input.type);
    });

    if (element) {
      element.focus();
    }
  },

  hideVirtualKeyboard() {
    this.setState({
      removeTicketForm: true
    });
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
    this.setState({
      formState: values,
      isValid: isValid
    });
  },

  render() {
    /* jshint quotmark:false */
    var formBody,
        formClasses = classSet({
          'Form u-cf': true,
          'Form--fullscreen': this.props.fullscreen
        }),
        titleClasses = classSet({
          'u-textSizeMed u-textBold u-extSizeMed u-textCenter': true,
          'Form-ctaLegend u-posAbsolute u-posCenter': !this.props.fullscreen,
          'u-textSizeBaseMobile': this.props.fullscreen
        }),
        barClasses = classSet({
          'Form-cta u-cf Container-pullout u-paddingBS': true,
          'Form-cta--bar u-marginBM u-paddingBL': !this.props.fullscreen
        });

    /* jshint laxbreak: true */
    formBody = this.state.removeTicketForm
             ? null
             : this.transferPropsTo(
                <SubmitTicketFormBody
                  ref='form'
                  schema={submitTicketSchema(this.props.customFields)}
                  onUpdate={this.handleUpdate}
                  component={React.DOM.div} />
               );


    return (
      <form
        noValidate
        onSubmit={this.handleSubmit}
        className={formClasses + ' ' + this.props.className}>
        <div className={barClasses}>
          <h2 className={titleClasses}>
            {i18n.t('embeddable_framework.submitTicket.form.title')}
          </h2>
        </div>
        {formBody}
        {this.props.children}
        <Button
          label={this.state.buttonMessage}
          disabled={!this.state.isValid || this.state.isSubmitting}
          fullscreen={this.props.fullscreen}
          type='submit'
          rtl={i18n.isRTL()}
        />
      </form>
    );
  }
});

export { SubmitTicketForm };
