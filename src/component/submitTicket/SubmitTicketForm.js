import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { locals as styles } from './SubmitTicketForm.scss';
import classNames from 'classnames';

import { AttachmentList } from 'component/attachment/AttachmentList';
import { Button } from 'component/button/Button';
import { ButtonSecondary } from 'component/button/ButtonSecondary';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { EmailField } from 'component/field/EmailField';
import { i18n } from 'service/i18n';
import { getCustomFields } from 'utility/fields';
import { TextField, Textarea, Label, Input } from '@zendeskgarden/react-textfields';

const sendButtonMessageString = 'embeddable_framework.submitTicket.form.submitButton.label.send';
const sendingButtonMessageString = 'embeddable_framework.submitTicket.form.submitButton.label.sending';
const cancelButtonMessageString = 'embeddable_framework.common.button.cancel';
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
    ticketFields: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]),
    attachmentsEnabled: PropTypes.bool,
    attachmentSender: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
    activeTicketForm: PropTypes.object,
    getFrameDimensions: PropTypes.func.isRequired,
    getFrameContentDocument: PropTypes.func.isRequired,
    ticketFormSettings: PropTypes.array,
    ticketFieldSettings: PropTypes.array,
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
    submit: PropTypes.func.isRequired,
    newHeight: PropTypes.bool.isRequired
  };

  static defaultProps = {
    attachmentsEnabled: false,
    children: <span />,
    ticketFields: [],
    activeTicketForm: {},
    formTitleKey: 'message',
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
      isValid: props.previewEnabled
    });
  }

  componentDidMount = () => {
    const showShadow = this.props.ticketFields.length > 0 || this.props.attachmentsEnabled;

    this.refs.scrollContainer.setScrollShadowVisible(showShadow);
    this.prefillFormState();
  }

  componentDidUpdate = () => {
    const form = ReactDOM.findDOMNode(this.refs.form);
    const isValid = form.checkValidity() && this.attachmentsReady();

    if (this.refs.formWrapper && this.props.formState && this.state.shouldRemoveForm) {
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

    if (this.state.isValid !== isValid) {
      this.setState({ isValid });
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

  // Passed in as params so the tests don't break
  prefillFormState = (
    fields = this.props.ticketFields,
    prefillTicketForm = this.props.ticketFormSettings,
    prefillTicketField = this.props.ticketFieldSettings) => {
    const internalFields = {
      description: { id: 'description', type: 'description' },
      subject: { id: 'subject', type: 'subject' }
    };
    const fieldsData = _.extend({}, fields, internalFields);
    const filteredFields = this.filterPrefillFields(fieldsData, prefillTicketForm, prefillTicketField);

    // Check if pre-fill is still valid after processing
    if (filteredFields.length === 0) return;

    let formState = this.getFormState();
    const currentLocale = i18n.getLocale();

    filteredFields.forEach((field) => {
      formState[field.id] = field.prefill[`${currentLocale}`] || field.prefill['*'] || '';
    });

    this.props.setFormState(formState);
  }

  attachmentsReady = () => {
    return this.props.attachmentsEnabled
      ? this.refs.attachments.attachmentsReady()
      : true;
  }

  updateForm = () => {
    const form = ReactDOM.findDOMNode(this.refs.form);

    this.props.setFormState(this.getFormState());
    this.setState({
      isValid: form.checkValidity() && this.attachmentsReady()
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
      email: formState.email
    });
    this.prefillFormState();
  }

  renderSubjectField = () => {
    const subjectField = (
      <TextField>
        <Label>
          {i18n.t('embeddable_framework.submitTicket.field.subject.label')}
        </Label>
        <Input
          key='subject'
          value={this.props.formState.subject}
          disabled={this.props.previewEnabled} />
      </TextField>
    );

    return this.props.subjectEnabled
      ? subjectField
      : null;
  }

  renderEmailField = () => {
    return (
      <EmailField
        key='email'
        name='email'
        disabled={this.props.previewEnabled}
        label={i18n.t('embeddable_framework.form.field.email.label')}
        required={true}
        value={this.props.formState.email} />
    );
  }

  renderNameField = () => {
    return (
      <TextField>
        <Label>
          {i18n.t('embeddable_framework.submitTicket.field.name.label')}
        </Label>
        <Input
          key='name'
          name='name'
          disabled={this.props.previewEnabled}
          value={this.props.formState.name} />
      </TextField>
    );
  }

  renderDescriptionField = () => {
    return (
      <TextField>
        <Label>
          {i18n.t('embeddable_framework.submitTicket.field.description.label')}
        </Label>
        <Textarea
          key='description'
          disabled={this.props.previewEnabled}
          required={true}
          rows='5' />
      </TextField>
    );
  }

  renderTicketFormBody = () => {
    const { activeTicketForm, ticketFields } = this.props;
    const ticketFieldsElem = getCustomFields(
      ticketFields,
      this.props.formState,
      {
        getFrameDimensions: this.props.getFrameDimensions,
        onChange: this.updateForm,
        getFrameContentDocument: this.props.getFrameContentDocument
      }
    );
    const titleMobileClasses = this.props.fullscreen ? styles.ticketFormTitleMobile : '';

    ticketFieldsElem.allFields.unshift([this.renderNameField(), this.renderEmailField()]);

    return (
      <div ref='formWrapper' className={styles.formWrapper}>
        <h2 className={`${styles.ticketFormTitle} ${titleMobileClasses}`}>
          {activeTicketForm.display_name}
        </h2>
        {ticketFieldsElem.allFields}
        {this.props.children}
      </div>
    );
  }

  renderFormBody = () => {
    const ticketFields = getCustomFields(
      this.props.ticketFields,
      this.props.formState,
      {
        getFrameDimensions: this.props.getFrameDimensions,
        onChange: this.updateForm
      }
    );

    return (
      <div ref='formWrapper' className={styles.formWrapper}>
        {this.renderNameField()}
        {this.renderEmailField()}
        {ticketFields.fields}
        {this.renderSubjectField()}
        {this.renderDescriptionField()}
        {ticketFields.checkboxes}
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
    const { attachmentsEnabled, fullscreen, formTitleKey, hide, newHeight } = this.props;

    const form = this.props.activeTicketForm ? this.renderTicketFormBody() : this.renderFormBody();
    const formBody = this.state.shouldRemoveForm ? null : form;
    const buttonCancel = fullscreen ? null : this.renderCancelButton();
    const attachments = attachmentsEnabled ? this.renderAttachments() : null;
    const hiddenClass = hide ? styles.hidden : '';
    const containerClasses = classNames(
      styles.container,
      {
        [styles.ticketFormContainer]: this.props.activeTicketForm,
        [styles.containerMobile]: fullscreen
      }
    );

    return (
      <form
        noValidate={true}
        onSubmit={this.handleSubmit}
        onChange={this.updateForm}
        ref='form'
        className={`${styles.form} ${hiddenClass}`}>
        <ScrollContainer
          ref='scrollContainer'
          newHeight={newHeight}
          title={i18n.t(`embeddable_framework.submitTicket.form.title.${formTitleKey}`)}
          containerClasses={containerClasses}
          getFrameDimensions={this.props.getFrameDimensions}
          footerContent={
            <ButtonGroup rtl={i18n.isRTL()} containerClasses={styles.buttonGroup}>
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
