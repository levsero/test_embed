import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

import { getAttachmentPreviews } from 'component/AttachmentPreview';
import { Button,
         ButtonSecondary,
         ButtonGroup,
         ButtonDropzone } from 'component/Button';
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

  handleUpdate() {
    const form = ReactDOM.findDOMNode(this.refs.form);

    this.setState({
      formState: this.getFormState(),
      isValid: form.checkValidity()
    });
  }

  resetState() {
    this.setState(_.extend(initialState, {
      buttonMessage: i18n.t(buttonMessageString),
      cancelButtonMessage: i18n.t(cancelButtonMessageString)
    }));
  }

  handleOnDrop(files) {
    const attachments = _.union(this.state.attachments, files);

    this.setState({ attachments });
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

  render() {
    const formClasses = classNames({
      'Form u-cf': true,
      'u-isHidden': this.props.hide
    });
    const removeAttachment = (attachment) => {
      const idx = this.state.attachments.indexOf(attachment);

      this.state.attachments.splice(idx, 1);
      this.forceUpdate();
    };
    const customFields = getCustomFields(this.props.customFields, this.state.formState);
    const previews = getAttachmentPreviews(this.state.attachments, removeAttachment);
    const attachments = (this.state.attachments.length !== 0)
                      ? <div>{previews}</div>
                      : null;
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
    const buttonCancel = this.props.fullscreen
                       ? null
                       : <ButtonSecondary
                           label={this.state.cancelButtonMessage}
                           onClick={this.props.onCancel}
                           fullscreen={this.props.fullscreen} />;
    const attachmentsTitle = (this.state.attachments.length > 0)
                           ? i18n.t('embeddable_framework.submitTicket.attachments.title.withCount',
                                { fallback: 'Attachments (%(count)s)',
                                count: this.state.attachments.length }
                              )
                           : i18n.t('embeddable_framework.submitTicket.attachments.title',
                                { fallback: 'Attachments' }
                              );
    const buttonDropzone = this.props.attachmentsEnabled
                         ? <label className='Form-fieldContainer u-block u-marginVM'>
                              <div className='Form-fieldLabel u-textXHeight'>
                                {attachmentsTitle}
                              </div>
                              <ButtonDropzone
                                onDrop={this.handleOnDrop} />
                            </label>
                         : null;

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
          {buttonDropzone}
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
  attachmentsEnabled: PropTypes.bool
};

SubmitTicketForm.defaultProps = {
  hide: false,
  customFields: [],
  fullscreen: false,
  onCancel: () => {},
  attachmentsEnabled: false
};
