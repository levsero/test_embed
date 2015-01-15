/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';

import { submitTicketSchema } from 'component/SubmitTicketSchema';
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
      showBackButton: false,
      isRTL: i18n.isRTL()
    };
  },

  getDefaultProps() {
    return {
      fullscreen: false
    };
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

  handleBackClick(e) {
    e.preventDefault();
    this.props.onBackClick();
  },

  render() {
    /* jshint quotmark:false */
    var formBody = this.transferPropsTo(
          <SubmitTicketFormBody
            ref='form'
            schema={submitTicketSchema(this.props.customFields)}
            onUpdate={this.handleUpdate}
            component={React.DOM.div} />
        ),
        formClasses = classSet({
          'Form u-cf': true,
          'Form--fullscreen': this.props.fullscreen
        }),
        navigationButtonClasses = classSet({
          'Button Button--nav u-userTextColor': true,
          'Button--navDesktop u-inlineBlock': !this.props.fullscreen,
          'u-posAbsolute u-posStart--vert u-textSizeBaseMobile': this.props.fullscreen,
          'u-isHidden': !this.state.showBackButton
        }),
        buttonClasses = classSet({
          'Button Button--cta Anim-color u-textNoWrap u-userBackgroundColor': true,
          'u-pullRight': !this.props.fullscreen,
          'u-sizeFull': this.props.fullscreen
        }),
        titleClasses = classSet({
          'u-textSizeMed u-textBold u-extSizeMed u-textCenter': true,
          'Form-ctaLegend u-posAbsolute u-posCenter': !this.props.fullscreen,
          'u-textSizeBaseMobile': this.props.fullscreen
        }),
        barClasses = classSet({
          'Form-cta u-cf Container-pullout u-paddingBS': true,
          'Form-cta--bar u-marginBM': !this.props.fullscreen,
          'Form-cta--barTitle': !this.props.fullscreen && !this.state.showBackButton
        }),
        iconClasses = classSet({
          'Icon Icon--arrow u-textInheritColor': true,
          'u-flipText u-inlineBlock': this.state.isRTL
        });

    return (
      <form
        noValidate
        onSubmit={this.handleSubmit}
        className={formClasses + ' ' + this.props.className}>
        <div className={barClasses}>
          <button
            onClick={this.handleBackClick}
            className={navigationButtonClasses}>
            <i className={iconClasses} />
            {i18n.t('embeddable_framework.navigation.back')}
          </button>
          <h2 className={titleClasses}>
            {i18n.t('embeddable_framework.submitTicket.form.title')}
          </h2>
        </div>
        {formBody}
        {this.props.children}
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
