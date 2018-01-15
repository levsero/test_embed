import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { locals as styles } from './SubmitTicketForm.scss';

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
    getFrameDimensions: PropTypes.func.isRequired,
    newDesign: PropTypes.bool,
    formState: PropTypes.object,
    formTitleKey: PropTypes.string,
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
    formTitleKey: 'message',
    newDesign: false,
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
    const showShadow = this.props.customFields.length > 0 || this.props.attachmentsEnabled;

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

  isPrefillValid = (prefill) => {
    return Array.isArray(prefill) && prefill.length !== 0;
  }

  mergePrefill = (prefillTicketForm, prefillTicketField) => {
    const prefillTicketFormValid = this.isPrefillValid(prefillTicketForm);
    const prefillTicketFieldValid = this.isPrefillValid(prefillTicketField);
    const prefillFieldData = prefillTicketFormValid ? prefillTicketForm : [];

    return prefillTicketFieldValid
         ? _.unionWith(prefillTicketForm, prefillTicketField, (a1, a2) => a1.id == a2.id) // eslint-disable-line
         : prefillFieldData;
  }

  filterPrefillFields = (fields, prefillTicketForm, prefillTicketField) => {
    const permittedFieldTypes = ['description', 'subject', 'text', 'textarea', 'integer', 'decimal'];
    const permittedSystemFieldIds = ['description', 'subject'];
    const prefillData = this.mergePrefill(prefillTicketForm, prefillTicketField);
    const findMatchingField = (prefillField) => (ticketField) => {
      return ticketField.id == prefillField.id || // eslint-disable-line eqeqeq
             (ticketField.type === prefillField.id && _.includes(permittedSystemFieldIds, prefillField.id));
    };
    const mapPrefillFields = (prefillField) => {
      const matchingField = _.find(fields, findMatchingField(prefillField)) || {};

      if (_.includes(permittedFieldTypes, matchingField.type)) {
        // Replace ticketField.id where it could be a text instead of an integer
        prefillField.id = matchingField.id;
        return prefillField;
      }
    };

    return _.chain(prefillData)
            .map(mapPrefillFields)
            .compact()
            .value();
  }

  prefillFormState = (fields, prefillTicketForm, prefillTicketField) => {
    const filteredFields = this.filterPrefillFields(fields, prefillTicketForm, prefillTicketField);

    // Check if pre-fill is still valid after processing
    if (filteredFields.length === 0) return;

    let formState = this.getFormState();
    const currentLocale = i18n.getLocale();

    filteredFields.forEach((field) => {
      formState[field.id] = field.prefill[`${currentLocale}`] || field.prefill['*'] || '';
    });

    this.props.setFormState(formState);
  }

  updateContactForm = (prefillTicketField) => {
    const internalFields = [
      { id: 'description', type: 'description' },
      { id: 'subject', type: 'subject' }
    ];
    const fieldsData = _.compact(_.concat(this.props.customFields, internalFields));

    this.prefillFormState(fieldsData, {}, prefillTicketField);
  }

  updateTicketForm = (form, fields, prefill, prefillTicketField) => {
    this.setState({
      ticketForm: form,
      ticketFormFields: fields
    }, () => this.prefillFormState(fields, prefill, prefillTicketField));
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
    const { formState } = this.props;
    const form = this.refs.form;

    _.forEach(form.elements, (field) => {
      if (formState[field.name] && field.type === 'checkbox') {
        field.checked = false;
      }
    });

    if (this.props.attachmentsEnabled) {
      this.refs.attachments.clear();
    }

    this.setState(initialState);
    this.props.setFormState({
      name: formState.name,
      email: formState.email,
      clearCheckboxes: true
    });
  }

  renderSubjectField = () => {
    const label = i18n.t('embeddable_framework.submitTicket.field.subject.label', {
      fallback: 'Subject'
    });

    return !this.props.subjectEnabled
         ? null
         : <Field
            key='subject'
            name='subject'
            label={label}
            value={this.props.formState.subject}
            disabled={this.props.previewEnabled} />;
  }

  renderEmailField = () => {
    return (
      <Field
        key='email'
        name='email'
        type='email'
        label={i18n.t('embeddable_framework.form.field.email.label')}
        required={true}
        pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" // eslint-disable-line
        value={this.props.formState.email}
        disabled={this.props.previewEnabled} />
    );
  }

  renderNameField = () => {
    return (
      <Field
        key='name'
        name='name'
        label={i18n.t('embeddable_framework.submitTicket.field.name.label')}
        value={this.props.formState.name}
        disabled={this.props.previewEnabled} />
    );
  }

  renderDescriptionField = () => {
    return (
      <Field
        key='description'
        name='description'
        label={i18n.t('embeddable_framework.submitTicket.field.description.label')}
        required={true}
        value={this.props.formState.description}
        input={<textarea rows='5' />}
        disabled={this.props.previewEnabled} />
    );
  }

  renderTicketFormBody = () => {
    const { ticketForm, ticketFormFields } = this.state;
    const formTicketFields = _.filter(ticketFormFields, (field) => {
      return ticketForm.ticket_field_ids.indexOf(field.id) > -1;
    });
    const ticketFieldsElem = getCustomFields(
      formTicketFields,
      this.props.formState,
      {
        getFrameDimensions: this.props.getFrameDimensions,
        onChange: this.updateForm
      }
    );
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
    const customFields = getCustomFields(
      this.props.customFields,
      this.props.formState,
      {
        getFrameDimensions: this.props.getFrameDimensions,
        onChange: this.updateForm
      }
    );

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
          containerClasses={`${styles.container} ${containerClasses}`}
          getFrameDimensions={this.props.getFrameDimensions}
          newDesign={this.props.newDesign}
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
