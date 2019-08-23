import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import _ from 'lodash'

import { locals as styles } from './SubmitTicketForm.scss'
import classNames from 'classnames'

import { AttachmentList } from 'component/attachment/AttachmentList'
import { Button } from '@zendeskgarden/react-buttons'
import { ButtonGroup } from 'component/button/ButtonGroup'
import { ScrollContainer } from 'component/container/ScrollContainer'
import { i18n } from 'service/i18n'
import { getCustomFields, shouldRenderErrorMessage, renderLabel } from 'utility/fields'
import { TextField, Textarea, Label, Input, Message } from '@zendeskgarden/react-textfields'
import { EMAIL_PATTERN } from 'constants/shared'
import { onNextTick } from 'src/util/utils'

const sendButtonMessageString = 'embeddable_framework.submitTicket.form.submitButton.label.send'
const sendingButtonMessageString =
  'embeddable_framework.submitTicket.form.submitButton.label.sending'
const cancelButtonMessageString = 'embeddable_framework.common.button.cancel'

export class SubmitTicketForm extends Component {
  static propTypes = {
    ticketFields: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    attachmentsEnabled: PropTypes.bool,
    attachmentSender: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
    activeTicketForm: PropTypes.object,
    nameFieldRequired: PropTypes.bool.isRequired,
    nameFieldEnabled: PropTypes.bool.isRequired,
    ticketFormSettings: PropTypes.array,
    ticketFieldSettings: PropTypes.array,
    formState: PropTypes.object.isRequired,
    readOnlyState: PropTypes.object.isRequired,
    formTitle: PropTypes.string.isRequired,
    fullscreen: PropTypes.bool,
    isMobile: PropTypes.bool,
    hide: PropTypes.bool,
    maxFileCount: PropTypes.number,
    maxFileSize: PropTypes.number,
    onCancel: PropTypes.func,
    previewEnabled: PropTypes.bool,
    setFormState: PropTypes.func,
    subjectEnabled: PropTypes.bool,
    submit: PropTypes.func.isRequired
  }

  static defaultProps = {
    attachmentsEnabled: false,
    children: <span />,
    ticketFields: [],
    activeTicketForm: {},
    formState: {},
    readOnlyState: {},
    fullscreen: false,
    isMobile: false,
    hide: false,
    maxFileCount: 5,
    maxFileSize: 5 * 1024 * 1024,
    nameFieldEnabled: true,
    onCancel: () => {},
    previewEnabled: false,
    setFormState: () => {},
    subjectEnabled: false
  }

  constructor(props, context) {
    super(props, context)

    this.state = _.extend({}, this.initialState, {
      isValid: props.previewEnabled
    })
  }

  componentDidMount = () => {
    this.prefillFormState()

    const form = ReactDOM.findDOMNode(this.refs.form)

    this.updateFormValidity(form)
  }

  componentDidUpdate = () => {
    const canSubmit = this.attachmentsReady()

    if (this.state.canSubmit !== canSubmit) {
      this.setState({ canSubmit })
    }
  }

  initialState = {
    attachments: [],
    buttonMessage: sendButtonMessageString,
    cancelButtonMessage: cancelButtonMessageString,
    isRTL: i18n.isRTL(),
    isSubmitting: false,
    isValid: false,
    canSubmit: true,
    showErrors: false,
    showErrorMessage: false
  }

  focusField = () => {
    const form = ReactDOM.findDOMNode(this.refs.form)

    // Focus on the first empty text or textarea
    const element = _.find(form.querySelectorAll('input, textarea'), function(input) {
      return input.value === '' && _.includes(['text', 'textarea', 'email'], input.type)
    })

    if (element) element.focus()
  }

  failedToSubmit = () => {
    this.setState({
      isSubmitting: false,
      buttonMessage: sendButtonMessageString
    })

    this.refs.scrollContainer.scrollToBottom()
  }

  handleSubmit = e => {
    if (this.props.previewEnabled) {
      e.preventDefault()
      return
    }

    const isFormValid = this.state.isValid

    if (isFormValid) {
      this.setState({
        buttonMessage: sendingButtonMessageString,
        isSubmitting: true
      })

      this.props.submit(e, {
        isFormValid: isFormValid,
        value: this.getFormState()
      })
    } else {
      e.preventDefault()
      this.setState({ showErrors: true })
    }
  }

  openAttachment = () => {
    this.setState({ showAttachmentForm: true })
  }

  getFormState = () => {
    const form = ReactDOM.findDOMNode(this.refs.form)

    return _.reduce(
      form.elements,
      (result, field) => {
        if (_.isEmpty(field.name) || field.type === 'submit') {
          return result
        } else if (field.type === 'checkbox') {
          result[field.name] = field.checked ? 1 : 0
        } else {
          result[field.name] = field.value
        }

        return result
      },
      {}
    )
  }

  isPrefillValid = prefill => {
    return Array.isArray(prefill) && prefill.length !== 0
  }

  mergePrefill = (prefillTicketForm, prefillTicketField) => {
    const prefillTicketFormValid = this.isPrefillValid(prefillTicketForm)
    const prefillTicketFieldValid = this.isPrefillValid(prefillTicketField)
    const prefillFieldData = prefillTicketFormValid ? prefillTicketForm : []

    return prefillTicketFieldValid
      ? _.unionWith(
          prefillTicketForm,
          prefillTicketField,
          (a1, a2) => a1.id == a2.id // eslint-disable-line
        )
      : prefillFieldData
  }

  filterPrefillFields = (fields, prefillTicketForm, prefillTicketField) => {
    const permittedFieldTypes = ['description', 'subject', 'text', 'textarea', 'integer', 'decimal']
    const permittedSystemFieldIds = ['description', 'subject']
    const prefillData = this.mergePrefill(prefillTicketForm, prefillTicketField)
    const findMatchingField = prefillField => ticketField => {
      return (
        ticketField.id == prefillField.id || // eslint-disable-line eqeqeq
        (ticketField.type === prefillField.id &&
          _.includes(permittedSystemFieldIds, prefillField.id))
      )
    }

    return _.reduce(
      prefillData,
      (result, prefillField) => {
        const matchingField = _.find(fields, findMatchingField(prefillField)) || {}

        if (_.includes(permittedFieldTypes, matchingField.type)) {
          // Replace ticketField.id where it could be a text instead of an integer
          prefillField.id = matchingField.id
          result.push(prefillField)
        }

        return result
      },
      []
    )
  }

  // Passed in as params so the tests don't break
  prefillFormState = (
    fields = this.props.ticketFields,
    prefillTicketForm = this.props.ticketFormSettings,
    prefillTicketField = this.props.ticketFieldSettings
  ) => {
    const internalFields = {
      description: { id: 'description', type: 'description' },
      subject: { id: 'subject', type: 'subject' }
    }
    const fieldsData = _.extend({}, fields, internalFields)
    const filteredFields = this.filterPrefillFields(
      fieldsData,
      prefillTicketForm,
      prefillTicketField
    )

    // Check if pre-fill is still valid after processing
    if (filteredFields.length === 0) return

    let formState = this.getFormState()
    const currentLocale = i18n.getLocale()

    filteredFields.forEach(field => {
      formState[field.id] = field.prefill[`${currentLocale}`] || field.prefill['*'] || ''
    })

    this.props.setFormState(formState)
  }

  attachmentsReady = () => {
    return this.props.attachmentsEnabled ? this.refs.attachments.attachmentsReady() : true
  }

  updateFormValidity = form => {
    this.setState({
      isValid: form.checkValidity(),
      canSubmit: this.attachmentsReady()
    })
  }

  updateForm = () => {
    const form = ReactDOM.findDOMNode(this.refs.form)

    this.props.setFormState(this.getFormState())
    this.updateFormValidity(form)
  }

  resetState = () => {
    this.setState(this.initialState)
  }

  handleOnDrop = files => {
    this.refs.attachments.handleOnDrop(files)
    onNextTick(() => this.refs.scrollContainer.scrollToBottom())
  }

  handleAttachmentsError = () => {
    onNextTick(() => this.refs.scrollContainer.scrollToBottom())
  }

  clear = () => {
    const { formState } = this.props
    const form = this.refs.form

    _.forEach(form.elements, field => {
      if (formState[field.name] && field.type === 'checkbox') {
        field.checked = false
      }
    })

    this.clearAttachments()

    this.setState(this.initialState)
    this.props.setFormState({
      name: formState.name,
      email: formState.email
    })
    this.prefillFormState()
  }

  clearAttachments = () => {
    if (this.props.attachmentsEnabled) {
      this.refs.attachments.clear()
    }
  }

  renderSubjectField = () => {
    const error = this.renderErrorMessage(
      false,
      this.props.formState.subject,
      'embeddable_framework.validation.error.input'
    )
    const name = 'subject'

    const subjectField = (
      <TextField key={name}>
        {renderLabel(Label, i18n.t('embeddable_framework.submitTicket.field.subject.label'), false)}
        <Input
          key={name}
          name={name}
          validation={error ? 'error' : 'none'}
          value={this.props.formState.subject}
          disabled={this.props.previewEnabled}
          readOnly={this.props.readOnlyState.subject}
        />
      </TextField>
    )

    return this.props.subjectEnabled ? subjectField : null
  }

  renderEmailField = () => {
    const error = this.renderErrorMessage(
      true,
      this.props.formState.email,
      'embeddable_framework.validation.error.email',
      EMAIL_PATTERN
    )
    const name = 'email'

    /* eslint-disable max-len */
    return (
      <TextField key={name}>
        {renderLabel(Label, i18n.t('embeddable_framework.form.field.email.label'), true)}
        <Input
          validation={error ? 'error' : 'none'}
          key={name}
          name={name}
          required={true}
          onChange={() => {}}
          value={this.props.formState.email}
          readOnly={this.props.readOnlyState.email}
          disabled={this.props.previewEnabled}
          pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?"
        />
        {error}
      </TextField>
    )
    /* eslint-enable max-len */
  }

  renderNameField = () => {
    if (!this.props.nameFieldEnabled) return

    const error = this.renderErrorMessage(
      this.props.nameFieldRequired,
      this.props.formState.name,
      'embeddable_framework.validation.error.name'
    )
    const name = 'name'

    return (
      <TextField key={name}>
        {renderLabel(
          Label,
          i18n.t('embeddable_framework.submitTicket.field.name.label'),
          this.props.nameFieldRequired || !!this.props.readOnlyState.name
        )}
        <Input
          key={name}
          name={name}
          required={this.props.nameFieldRequired}
          validation={error ? 'error' : 'none'}
          disabled={this.props.previewEnabled}
          value={this.props.formState.name}
          onChange={() => {}}
          readOnly={this.props.readOnlyState.name}
        />
        {error}
      </TextField>
    )
  }

  renderDescriptionField = () => {
    const error = this.renderErrorMessage(
      true,
      this.props.formState.description,
      'embeddable_framework.validation.error.input'
    )
    const name = 'description'

    return (
      <TextField key={name}>
        {renderLabel(
          Label,
          i18n.t('embeddable_framework.submitTicket.field.description.label'),
          true
        )}
        <Textarea
          key={name}
          name={name}
          validation={error ? 'error' : 'none'}
          disabled={this.props.previewEnabled}
          required={true}
          value={this.props.formState.description}
          onChange={() => {}}
          rows="5"
        />
        {error}
      </TextField>
    )
  }

  renderErrorMessage = (required, value, errorString, pattern) => {
    return shouldRenderErrorMessage(value, required, this.state.showErrors, pattern) ? (
      <Message validation="error">{i18n.t(errorString)}</Message>
    ) : null
  }

  renderTicketFormBody = () => {
    const { activeTicketForm, ticketFields } = this.props
    const ticketFieldsElem = getCustomFields(
      ticketFields,
      this.props.formState,
      {
        onChange: this.updateForm,
        showErrors: this.state.showErrors
      },
      activeTicketForm.end_user_conditions
    )
    const titleMobileClasses = this.props.isMobile ? styles.ticketFormTitleMobile : ''

    ticketFieldsElem.allFields.unshift([this.renderNameField(), this.renderEmailField()])

    return (
      <div ref="formWrapper" className={styles.formWrapper}>
        <h2 className={`${styles.ticketFormTitle} ${titleMobileClasses}`}>
          {activeTicketForm.display_name}
        </h2>
        {ticketFieldsElem.allFields}
        {this.props.children}
      </div>
    )
  }

  renderFormBody = () => {
    const ticketFields = getCustomFields(this.props.ticketFields, this.props.formState, {
      onChange: this.updateForm,
      showErrors: this.state.showErrors
    })

    return (
      <div ref="formWrapper" className={styles.formWrapper}>
        {this.renderNameField()}
        {this.renderEmailField()}
        {ticketFields.fields}
        {this.renderSubjectField()}
        {this.renderDescriptionField()}
        {ticketFields.checkboxes}
        {this.props.children}
      </div>
    )
  }

  renderCancelButton = () => {
    return (
      <Button onClick={this.props.onCancel} className={styles.button}>
        {i18n.t(this.state.cancelButtonMessage)}
      </Button>
    )
  }

  renderAttachments = () => {
    const { attachmentSender, fullscreen } = this.props

    return (
      <AttachmentList
        ref="attachments"
        attachmentSender={attachmentSender}
        updateForm={this.updateForm}
        maxFileCount={this.props.maxFileCount}
        maxFileSize={this.props.maxFileSize}
        fullscreen={fullscreen}
        handleAttachmentsError={this.handleAttachmentsError}
      />
    )
  }

  render = () => {
    const { attachmentsEnabled, fullscreen, formTitle, hide, isMobile } = this.props

    const form = this.props.activeTicketForm ? this.renderTicketFormBody() : this.renderFormBody()
    const buttonCancel = isMobile ? null : this.renderCancelButton()
    const attachments = attachmentsEnabled ? this.renderAttachments() : null
    const hiddenClass = hide ? styles.hidden : ''
    const containerClasses = classNames(styles.container, {
      [styles.ticketFormContainer]: this.props.activeTicketForm,
      [styles.containerMobile]: isMobile
    })
    const buttonDisabled = !this.state.canSubmit || this.state.isSubmitting
    const showShadow = this.props.ticketFields.length > 0 || this.props.attachmentsEnabled

    return (
      <form
        noValidate={true}
        onSubmit={this.handleSubmit}
        onChange={this.updateForm}
        ref="form"
        className={`${styles.form} ${hiddenClass}`}
      >
        <ScrollContainer
          ref="scrollContainer"
          title={formTitle}
          containerClasses={containerClasses}
          scrollShadowVisible={showShadow}
          footerContent={
            <ButtonGroup rtl={i18n.isRTL()} containerClasses={styles.buttonGroup}>
              {buttonCancel}
              <Button
                primary={true}
                disabled={buttonDisabled}
                type="submit"
                className={styles.button}
              >
                {i18n.t(this.state.buttonMessage)}
              </Button>
            </ButtonGroup>
          }
          fullscreen={fullscreen}
          isMobile={isMobile}
        >
          {form}
          {attachments}
        </ScrollContainer>
      </form>
    )
  }
}
