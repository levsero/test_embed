import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

import { AttachmentList } from 'component/AttachmentList';
import { Button,
         ButtonSecondary,
         ButtonGroup } from 'component/Button';
import { Field,
         getCustomFields } from 'component/FormField';
import { ScrollContainer } from 'component/ScrollContainer';
import { i18n } from 'service/i18n';
import { bindMethods } from 'utility/utils';

const initialState = {
  isValid: false,
  isSubmitting: false,
  isRTL: i18n.isRTL(),
  removeTicketForm: false,
  formState: {},
  showErrorMessage: false,
  attachments: []
};
const buttonMessageString = 'embeddable_framework.submitTicket.form.submitButton.label.send';
const cancelButtonMessageString = 'embeddable_framework.submitTicket.form.cancelButton.label.cancel';

export class SubmitTicketForm extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, SubmitTicketForm.prototype);

    this.state = _.extend(initialState, {
      buttonMessage: i18n.t(buttonMessageString),
      cancelButtonMessage: i18n.t(cancelButtonMessageString)
    });
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
      buttonMessage: i18n.t(buttonMessageString)
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

  openAttachment() {
    this.setState({ showAttachmentForm: true });
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

  updateForm() {
    const form = ReactDOM.findDOMNode(this.refs.form);
    const attachmentsReady = this.props.attachmentsEnabled
                           ? this.refs.attachments.attachmentsReady()
                           : true;

    this.setState({
      formState: this.getFormState(),
      isValid: form.checkValidity() && attachmentsReady
    });
  }

  resetState() {
    this.setState(_.extend(initialState, {
      buttonMessage: i18n.t(buttonMessageString),
      cancelButtonMessage: i18n.t(cancelButtonMessageString)
    }));
  }

  handleOnDrop(files) {
    this.refs.attachments.handleOnDrop(files);

    setTimeout(() => this.refs.scrollContainer.scrollToBottom(), 0);
  }

  clear() {
    const formData = this.state.formState;
    const form = this.refs.form.getDOMNode();

    _.forEach(form.elements, (field) => {
      if (this.state.formState[field.name] && field.type === 'checkbox') {
        field.checked = false;
      }
    });

    this.setState(initialState);
    this.setState({
      formState: {
        name: formData.name,
        email: formData.email
      }
    });
  }

  renderFormBody() {
    const { formState } = this.state;
    const customFields = getCustomFields(this.props.customFields, formState);

    return (
      <div ref='formWrapper'>
        <Field
          placeholder={i18n.t('embeddable_framework.submitTicket.field.name.label')}
          value={formState.name}
          name='name' />
        <Field
          placeholder={i18n.t('embeddable_framework.form.field.email.label')}
          type='email'
          required={true}
          value={formState.email}
          name='email' />
        {customFields.fields}
        <Field
          placeholder={i18n.t('embeddable_framework.submitTicket.field.description.label')}
          required={true}
          value={formState.description}
          name='description'
          input={<textarea rows='5' />} />
        {customFields.checkboxes}
        {this.props.children}
      </div>
    );
  }

  renderCancelButton() {
    const { onCancel, fullscreen } = this.props;

    return (
      <ButtonSecondary
        label={this.state.cancelButtonMessage}
        onClick={onCancel}
        fullscreen={fullscreen} />
    );
  }

  renderAttachments() {
    const { attachmentSender, fullscreen } = this.props;

    return (
      <AttachmentList
        ref="attachments"
        attachmentSender={attachmentSender}
        updateForm={this.updateForm}
        maxFileLimit={this.props.maxFileLimit}
        maxFileSize={this.props.maxFileSize}
        fullscreen={fullscreen} />
    );
  }

  render() {
    const { attachmentsEnabled, fullscreen, formTitleKey, hide } = this.props;

    const formClasses = classNames({
      'Form u-cf': true,
      'u-isHidden': hide
    });

    const formBody = this.state.removeTicketForm ? null : this.renderFormBody();
    const buttonCancel = fullscreen ? null : this.renderCancelButton();
    const attachments = attachmentsEnabled ? this.renderAttachments() : null;

    return (
      <form
        noValidate={true}
        onSubmit={this.handleSubmit}
        onChange={this.updateForm}
        ref='form'
        className={formClasses}>
        <ScrollContainer
          ref='scrollContainer'
          title={i18n.t(`embeddable_framework.submitTicket.form.title.${formTitleKey}`)}
          contentExpanded={true}
          footerContent={
            <ButtonGroup rtl={i18n.isRTL()}>
              {buttonCancel}
              <Button
                fullscreen={fullscreen}
                label={this.state.buttonMessage}
                disabled={!this.state.isValid || this.state.isSubmitting}
                type='submit' />
            </ButtonGroup>
          }
          fullscreen={fullscreen}>
          {formBody}
          {attachments}
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
  onCancel: PropTypes.func,
  attachmentSender: PropTypes.func.isRequired,
  attachmentsEnabled: PropTypes.bool,
  maxFileLimit: PropTypes.number,
  maxFileSize: PropTypes.number
};

SubmitTicketForm.defaultProps = {
  hide: false,
  customFields: [],
  fullscreen: false,
  onCancel: () => {},
  attachmentsEnabled: false,
  maxFileLimit: 5,
  maxFileSize: 5 * 1024 * 1024
};
