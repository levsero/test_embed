import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

import { Button,
         ButtonSecondary,
         ButtonGroup } from 'component/Button';
import { ScrollContainer } from 'component/ScrollContainer';
import { i18n } from 'service/i18n';
import { Field,
         getCustomFields } from 'component/FormField';
import { bindMethods } from 'utility/utils';

export class SubmitTicketForm extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, SubmitTicketForm.prototype)

    this.state = {
      isValid: false,
      buttonMessage: i18n.t(
        'embeddable_framework.submitTicket.form.submitButton.label.send'
      ),
      isSubmitting: false,
      isRTL: i18n.isRTL(),
      removeTicketForm: false,
      formState: {},
      showErrorMessage: false,
      cancelButtonMessage: i18n.t(
        'embeddable_framework.submitTicket.form.cancelButton.label.cancel'
      )
    };
  }

  componentDidMount() {
    const customFields = getCustomFields(this.props.customFields, this.state.formState);

    this.refs.scrollContainer.setScrollShadowVisible(customFields.fields.length);
  }

  componentDidUpdate() {
    if (this.refs.formWrapper && this.state.formState && this.state.removeTicketForm) {
      const form = ReactDOM.findDOMNode(this.refs.form);

      _.forEach(form.elements, function(field) {
        if (field.type === 'submit') {
          return;
        }

        if (this.state.formState[field.name]) {
          if (field.type === 'checkbox') {
            // Based on formState set checked property
            field.checked = !!this.state.formState[field.name];
          } else {
            field.value = this.state.formState[field.name];
          }
        } else {
          // If clearing form after submit we need to make sure
          // formState clears out undefined values
          field.value = '';

          // Don't need to check for type here as non checkbox inputs
          // will ignore this property.
          field.checked = false;
        }
      }, this);
    }
  }

  resetTicketFormVisibility() {
    // if the user closes and reopens, we need to
    // re-render the search field
    this.setState({
      removeTicketForm: false
    });
  }

  focusField() {
    const form = ReactDOM.findDOMNode(this.refs.form);

    // Focus on the first empty text or textarea
    const element = _.find(form.querySelectorAll('input, textarea'), function(input) {
      return input.value === '' && _.contains(['text', 'textarea', 'email'], input.type);
    });

    if (element) {
      element.focus();
    }
  }

  hideVirtualKeyboard() {
    this.setState({
      removeTicketForm: true
    });
  }

  failedToSubmit() {
    this.setState({
      isSubmitting: false,
      buttonMessage: i18n.t(
        'embeddable_framework.submitTicket.form.submitButton.label.send'
      )
    });

    this.refs.scrollContainer.scrollToBottom();
  }

  handleSubmit(e) {
    const isFormValid = this.state.isValid;

    if (isFormValid) {
      this.setState({
        buttonMessage: i18n.t('embeddable_framework.submitTicket.form.submitButton.label.sending'),
        isSubmitting: true
      });
    }

    this.props.submit(e, {
      isFormValid: isFormValid,
      value: this.getFormState()
    });
  }

  getFormState() {
    const form = ReactDOM.findDOMNode(this.refs.form);

    return _.chain(form.elements)
      .reject((field) => field.type === 'submit')
      .reduce((result, field) => {
        result[field.name] = (field.type === 'checkbox')
                           ? field.checked ? 1 : 0
                           : field.value;

        return result;
      },
      {}).value();
  }

  handleUpdate() {
    const form = ReactDOM.findDOMNode(this.refs.form);

    this.setState({
      formState: this.getFormState(),
      isValid: form.checkValidity()
    });
  }

  resetForm() {
    this.setState = {
      isValid: false,
      buttonMessage: i18n.t(
        'embeddable_framework.submitTicket.form.submitButton.label.send'
      ),
      isSubmitting: false,
      isRTL: i18n.isRTL(),
      removeTicketForm: false,
      formState: {},
      showErrorMessage: false,
      cancelButtonMessage: i18n.t(
        'embeddable_framework.submitTicket.form.cancelButton.label.cancel'
      )
    };
  }

  render() {
    const formClasses = classNames({
      'Form u-cf': true,
      'u-isHidden': this.props.hide
    });
    const customFields = getCustomFields(this.props.customFields, this.state.formState);
    const formBody = (this.state.removeTicketForm)
                   ? null
                   : <div ref='formWrapper'>
                       <Field
                         placeholder={i18n.t('embeddable_framework.submitTicket.field.name.label')}
                         value={this.state.formState.name}
                         name='name' />
                       <Field
                         placeholder={i18n.t('embeddable_framework.form.field.email.label')}
                         type='email'
                         required={true}
                         value={this.state.formState.email}
                         name='email' />
                       {customFields.fields}
                       <Field
                         placeholder={
                           i18n.t('embeddable_framework.submitTicket.field.description.label')
                         }
                         required={true}
                         value={this.state.formState.description}
                         name='description'
                         input={<textarea rows='5' />} />
                       {customFields.checkboxes}
                       {this.props.children}
                     </div>;
    const buttonCancel = (this.props.fullscreen)
                       ? null
                       : (<ButtonSecondary
                            label={this.state.cancelButtonMessage}
                            onClick={this.props.onCancel}
                            fullscreen={this.props.fullscreen} />);

    return (
      <form
        noValidate={true}
        onSubmit={this.handleSubmit}
        onChange={this.handleUpdate}
        ref='form'
        className={formClasses}>
        <ScrollContainer
          ref='scrollContainer'
          title={i18n.t(`embeddable_framework.submitTicket.form.title.${this.props.formTitleKey}`)}
          contentExpanded={true}
          footerContent={
            <ButtonGroup rtl={i18n.isRTL()}>
              {buttonCancel}
              <Button
                fullscreen={this.props.fullscreen}
                label={this.state.buttonMessage}
                disabled={!this.state.isValid || this.state.isSubmitting}
                type='submit' />
            </ButtonGroup>
          }
          fullscreen={this.props.fullscreen}>
          {formBody}
        </ScrollContainer>
      </form>
    );
  }
}

SubmitTicketForm.propTypes = {
  formTitleKey: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  submit: PropTypes.func.isRequired,
  hide: PropTypes.bool,
  customFields: PropTypes.array,
  fullscreen: PropTypes.bool,
  onCancel: PropTypes.func
};

SubmitTicketForm.defaultProps = {
  hide: false,
  customFields: [],
  fullscreen: false,
  onCancel: () => {}
};
