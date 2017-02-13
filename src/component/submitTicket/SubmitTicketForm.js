import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { locals as styles } from './SubmitTicketForm.sass';

import { AttachmentList } from 'component/attachment/AttachmentList';
import { Button } from 'component/button/Button';
import { ButtonSecondary } from 'component/button/ButtonSecondary';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { Field } from 'component/field/Field';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { i18n } from 'service/i18n';
import { getCustomFields } from 'utility/fields';

const sendButtonMessageString = 'embeddable_framework.submitTicket.form.submitButton.label.send';
const sendingButtonMessageString = 'embeddable_framework.submitTicket.form.submitButton.label.sending';
const cancelButtonMessageString = 'embeddable_framework.submitTicket.form.cancelButton.label.cancel';
const initialState = {
  attachments: [],
  buttonMessage: sendButtonMessageString,
  cancelButtonMessage: cancelButtonMessageString,
  isRTL: i18n.isRTL(),
  isSubmitting: false,
  isValid: false,
  shouldRemoveForm: false,
  showErrorMessage: false
};

export class SubmitTicketForm extends Component {
  static propTypes = {
    attachmentsEnabled: PropTypes.bool,
    attachmentSender: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
    customFields: PropTypes.array,
    disableAutoComplete: PropTypes.bool,
    expanded: PropTypes.bool,
    formState: PropTypes.object,
    formTitleKey: PropTypes.string.isRequired,
    fullscreen: PropTypes.bool,
    hide: PropTypes.bool,
    maxFileCount: PropTypes.number,
    maxFileSize: PropTypes.number,
    onCancel: PropTypes.func,
    previewEnabled: PropTypes.bool,
    setFormState: PropTypes.func,
    subjectEnabled: PropTypes.bool,
    submit: PropTypes.func.isRequired
  };

  static defaultProps = {
    attachmentsEnabled: false,
    children: <span />,
    customFields: [],
    disableAutoComplete: false,
    expanded: false,
    formState: {},
    fullscreen: false,
    hide: false,
    maxFileCount: 5,
    maxFileSize: 5 * 1024 * 1024,
    onCancel: () => {},
    previewEnabled: false,
    setFormState: () => {},
    subjectEnabled: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = _.extend({}, initialState, {
      isValid: props.previewEnabled,
      ticketForm: null,
      ticketFormFields: []
    });
  }

  componentDidMount = () => {
    const customFields = getCustomFields(this.props.customFields, this.props.formState, this.props.disableAutoComplete);
    const showShadow = customFields.fields.length > 0 || this.props.attachmentsEnabled;

    this.refs.scrollContainer.setScrollShadowVisible(showShadow);
  }

  componentDidUpdate = () => {
    if (this.refs.formWrapper && this.props.formState && this.state.shouldRemoveForm) {
      const form = ReactDOM.findDOMNode(this.refs.form);

      _.forEach(form.elements, function(field) {
        if (field.type === 'submit') {
          return;
        }

        if (this.props.formState[field.name]) {
          if (field.type === 'checkbox') {
            // Based on formState set checked property
            field.checked = !!this.props.formState[field.name];
          } else {
            field.value = this.props.formState[field.name];
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

  resetTicketFormVisibility = () => {
    // if the user closes and reopens, we need to
    // re-render the search field
    this.setState({ shouldRemoveForm: false });
  }

  focusField = () => {
    const form = ReactDOM.findDOMNode(this.refs.form);

    // Focus on the first empty text or textarea
    const element = _.find(form.querySelectorAll('input, textarea'), function(input) {
      return input.value === '' && _.includes(['text', 'textarea', 'email'], input.type);
    });

    if (element) element.focus();
  }

  hideVirtualKeyboard = () => {
    this.setState({ shouldRemoveForm: true });
  }

  failedToSubmit = () => {
    this.setState({
      isSubmitting: false,
      buttonMessage: sendButtonMessageString
    });

    this.refs.scrollContainer.scrollToBottom();
  }

  handleSubmit = (e) => {
    if (this.props.previewEnabled) {
      e.preventDefault();
      return;
    }

    const isFormValid = this.state.isValid;

    if (isFormValid) {
      this.setState({
        buttonMessage: sendingButtonMessageString,
        isSubmitting: true
      });
    }

    this.props.submit(e, {
      isFormValid: isFormValid,
      value: this.getFormState()
    });
  }

  openAttachment = () => {
    this.setState({ showAttachmentForm: true });
  }

  getFormState = () => {
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

  filterPrefill = (fields, rawPrefillData) => {
    const permittedFields = ['text', 'textarea', 'description', 'integer', 'decimal', 'subject'];

    // Cleans data by removing fields we do not want to enable pre-fill on
    return _.filter(rawPrefillData.fields, (prefillTicketField) => {
      // Intentional non-strict matching between integer and string ids
      const matchingField = _.find(fields, (field) => field.id == prefillTicketField.id); // eslint-disable-line

      return matchingField
      ? _.includes(permittedFields, matchingField.type)
      : false;
    });
  }

  prefillFormState = (fields, rawPrefillData = {}) => {
    const isPrefillValid = rawPrefillData.fields
                           && Array.isArray(rawPrefillData.fields)
                           && rawPrefillData.fields.length !== 0;

    if (!isPrefillValid) return;

    const fieldsPrefill = this.filterPrefill(fields, rawPrefillData);

    // Check if pre-fill is still valid after processing
    if (fieldsPrefill.length === 0) return;

    let formState = this.getFormState();
    const currentLocale = i18n.getLocale();

    fieldsPrefill.forEach((field) => {
      formState[field.id] = field.prefill[`${currentLocale}`] || field.prefill['*'] || '';
    });

    this.props.setFormState(formState);
  }

  updateTicketForm = (form, fields, prefill) => {
    this.setState({
      ticketForm: form,
      ticketFormFields: fields
    }, () => this.prefillFormState(fields, prefill));
  }

  updateForm = () => {
    const form = ReactDOM.findDOMNode(this.refs.form);
    const attachmentsReady = this.props.attachmentsEnabled
                           ? this.refs.attachments.attachmentsReady()
                           : true;

    this.props.setFormState(this.getFormState());
    this.setState({
      isValid: form.checkValidity() && attachmentsReady
    });
  }

  resetState = () => {
    this.setState(initialState);
  }

  handleOnDrop = (files) => {
    this.refs.attachments.handleOnDrop(files);

    setTimeout(() => this.refs.scrollContainer.scrollToBottom(), 0);
  }

  handleAttachmentsError = () => {
    setTimeout(() => this.refs.scrollContainer.scrollToBottom(), 0);
  }

  clear = () => {
    const formData = this.props.formState;
    const form = this.refs.form;

    _.forEach(form.elements, (field) => {
      if (this.props.formState[field.name] && field.type === 'checkbox') {
        field.checked = false;
      }
    });

    if (this.props.attachmentsEnabled) {
      this.refs.attachments.clear();
    }

    this.setState(initialState);
    this.props.setFormState({
      name: formData.name,
      email: formData.email
    });
  }

  renderSubjectField = () => {
    const placeholder = i18n.t('embeddable_framework.submitTicket.field.subject.label', {
      fallback: 'Subject'
    });

    return !this.props.subjectEnabled
         ? null
         : <Field
            placeholder={placeholder}
            value={this.props.formState.subject}
            disableAutoComplete={this.props.disableAutoComplete}
            name='subject'
            disabled={this.props.previewEnabled} />;
  }

  renderEmailField = () => {
    return (
      <Field
        placeholder={i18n.t('embeddable_framework.form.field.email.label')}
        type='email'
        required={true}
        disableAutoComplete={this.props.disableAutoComplete}
        pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" // eslint-disable-line
        value={this.props.formState.email}
        name='email'
        disabled={this.props.previewEnabled} />
    );
  }

  renderNameField = () => {
    return (
      <Field
        placeholder={i18n.t('embeddable_framework.submitTicket.field.name.label')}
        value={this.props.formState.name}
        name='name'
        disableAutoComplete={this.props.disableAutoComplete}
        disabled={this.props.previewEnabled} />
    );
  }

  renderDescriptionField = () => {
    return (
      <Field
        placeholder={i18n.t('embeddable_framework.submitTicket.field.description.label')}
        required={true}
        value={this.props.formState.description}
        name='description'
        disableAutoComplete={this.props.disableAutoComplete}
        input={<textarea rows='5' />}
        disabled={this.props.previewEnabled} />
    );
  }

  renderTicketFormBody = () => {
    const { ticketForm, ticketFormFields } = this.state;
    const formTicketFields = _.filter(ticketFormFields, (field) => {
      return ticketForm.ticket_field_ids.indexOf(field.id) > -1;
    });
    const ticketFieldsElem = getCustomFields(formTicketFields, this.props.formState, this.props.disableAutoComplete);
    const titleMobileClasses = this.props.fullscreen ? styles.ticketFormTitleMobile : '';

    ticketFieldsElem.allFields.unshift([this.renderNameField(), this.renderEmailField()]);

    return (
      <div ref='formWrapper'>
        <div className={`${styles.ticketFormTitle} ${titleMobileClasses}`}>
          {ticketForm.display_name}
        </div>
        {ticketFieldsElem.allFields}
        {this.props.children}
      </div>
    );
  }

  renderFormBody = () => {
    const customFields = getCustomFields(this.props.customFields, this.props.formState, this.props.disableAutoComplete);

    return (
      <div ref='formWrapper'>
        {this.renderNameField()}
        {this.renderEmailField()}
        {customFields.fields}
        {this.renderSubjectField()}
        {this.renderDescriptionField()}
        {customFields.checkboxes}
        {this.props.children}
      </div>
    );
  }

  renderCancelButton = () => {
    const { onCancel, fullscreen } = this.props;

    return (
      <ButtonSecondary
        label={i18n.t(this.state.cancelButtonMessage)}
        onClick={onCancel}
        fullscreen={fullscreen} />
    );
  }

  renderAttachments = () => {
    const { attachmentSender, fullscreen } = this.props;

    return (
      <AttachmentList
        ref="attachments"
        attachmentSender={attachmentSender}
        updateForm={this.updateForm}
        maxFileCount={this.props.maxFileCount}
        maxFileSize={this.props.maxFileSize}
        fullscreen={fullscreen}
        handleAttachmentsError={this.handleAttachmentsError} />
    );
  }

  render = () => {
    const { attachmentsEnabled, fullscreen, formTitleKey, hide } = this.props;

    const form = this.state.ticketForm ? this.renderTicketFormBody() : this.renderFormBody();
    const formBody = this.state.shouldRemoveForm ? null : form;
    const buttonCancel = fullscreen ? null : this.renderCancelButton();
    const attachments = attachmentsEnabled ? this.renderAttachments() : null;
    const hiddenClass = hide ? styles.hidden : '';
    const containerClasses = this.state.ticketForm ? styles.ticketFormContainer : '';

    return (
      <form
        noValidate={true}
        onSubmit={this.handleSubmit}
        onChange={this.updateForm}
        ref='form'
        className={`${styles.form} ${hiddenClass}`}>
        <ScrollContainer
          ref='scrollContainer'
          title={i18n.t(`embeddable_framework.submitTicket.form.title.${formTitleKey}`)}
          contentExpanded={this.props.expanded}
          containerClasses={`${styles.container} ${containerClasses}`}
          footerContent={
            <ButtonGroup rtl={i18n.isRTL()}>
              {buttonCancel}
              <Button
                fullscreen={fullscreen}
                label={i18n.t(this.state.buttonMessage)}
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
