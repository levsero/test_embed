import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import _ from 'lodash'

import { locals as styles } from './SubmitTicketForm.scss'
import AttachmentList from 'component/attachment/AttachmentList'
import { Button } from '@zendeskgarden/react-buttons'
import { i18n } from 'service/i18n'
import { getCustomFields, shouldRenderErrorMessage, renderLabel } from 'utility/fields'
import { Field, Textarea, Label, Input, Message } from '@zendeskgarden/react-forms'
import { EMAIL_PATTERN } from 'constants/shared'
import { onNextTick } from 'src/util/utils'
import { TEST_IDS } from 'src/constants/shared'
import { Widget, Header, Main, Footer } from 'components/Widget'

const sendButtonMessageString = 'embeddable_framework.submitTicket.form.submitButton.label.send'
const sendingButtonMessageString =
  'embeddable_framework.submitTicket.form.submitButton.label.sending'

export class SubmitTicketForm extends Component {
  static propTypes = {
    ticketFields: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    attachmentsEnabled: PropTypes.bool,
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
    previewEnabled: PropTypes.bool,
    setFormState: PropTypes.func,
    subjectEnabled: PropTypes.bool,
    submit: PropTypes.func.isRequired,
    attachmentsReady: PropTypes.bool.isRequired,
    clearAttachments: PropTypes.func.isRequired
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
    previewEnabled: false,
    setFormState: () => {},
    subjectEnabled: false,
    attachmentsReady: true
  }

  constructor(props, context) {
    super(props, context)

    this.state = _.extend({}, this.initialState, {
      isValid: props.previewEnabled
    })

    this.main = React.createRef()
  }

  componentDidMount = () => {
    const form = ReactDOM.findDOMNode(this.refs.form)

    setTimeout(() => {
      this.prefillFormState()
      this.updateFormValidity(form)
    }, 0)
  }

  componentDidUpdate = () => {
    const canSubmit = this.attachmentsReady()

    if (this.state.canSubmit !== canSubmit) {
      //  eslint-disable-next-line react/no-did-update-set-state
      this.setState({ canSubmit })
    }
  }

  initialState = {
    buttonMessage: sendButtonMessageString,
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

    this.scrollToBottom()
  }

  scrollToBottom() {
    if (this.main.current) {
      this.main.current.scrollTop = this.main.current.scrollHeight
    }
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
    const { attachmentsEnabled, attachmentsReady } = this.props

    return attachmentsEnabled ? attachmentsReady : true
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

  handleOnDrop = files => {
    this.refs.attachments.handleOnDrop(files)
    onNextTick(() => this.scrollToBottom())
  }

  handleAttachmentsError = () => {
    onNextTick(() => this.scrollToBottom())
  }

  clear = () => {
    const { formState } = this.props
    const form = this.refs.form

    _.forEach(form.elements, field => {
      if (formState[field.name] && field.type === 'checkbox') {
        field.checked = false
      }
    })

    this.setState(this.initialState)
    this.props.setFormState({
      name: formState.name,
      email: formState.email
    })
    this.prefillFormState()
    this.props.clearAttachments()
  }

  renderSubjectField = () => {
    const error = this.renderErrorMessage(
      false,
      this.props.formState.subject,
      'embeddable_framework.validation.error.input'
    )
    const name = 'subject'

    const subjectField = (
      <Field key={name}>
        {renderLabel(Label, i18n.t('embeddable_framework.submitTicket.field.subject.label'), false)}
        <Input
          key={name}
          name={name}
          validation={error ? 'error' : undefined}
          value={this.props.formState.subject}
          disabled={this.props.previewEnabled}
          readOnly={this.props.readOnlyState.subject}
          data-testid={TEST_IDS.SUBJECT_FIELD}
        />
      </Field>
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
      <Field key={name}>
        {renderLabel(Label, i18n.t('embeddable_framework.form.field.email.label'), true)}
        <Input
          validation={error ? 'error' : undefined}
          key={name}
          name={name}
          required={true}
          onChange={() => {}}
          value={this.props.formState.email}
          readOnly={this.props.readOnlyState.email}
          disabled={this.props.previewEnabled}
          pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?"
          data-testid={TEST_IDS.EMAIL_FIELD}
        />
        {error}
      </Field>
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
      <Field key={name}>
        {renderLabel(
          Label,
          i18n.t('embeddable_framework.submitTicket.field.name.label'),
          this.props.nameFieldRequired || !!this.props.readOnlyState.name
        )}
        <Input
          key={name}
          name={name}
          required={this.props.nameFieldRequired}
          validation={error ? 'error' : undefined}
          disabled={this.props.previewEnabled}
          value={this.props.formState.name}
          onChange={() => {}}
          readOnly={this.props.readOnlyState.name}
          data-testid={TEST_IDS.NAME_FIELD}
        />
        {error}
      </Field>
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
      <Field key={name}>
        {renderLabel(
          Label,
          i18n.t('embeddable_framework.submitTicket.field.description.label'),
          true
        )}
        <Textarea
          key={name}
          name={name}
          validation={error ? 'error' : undefined}
          disabled={this.props.previewEnabled}
          required={true}
          value={this.props.formState.description}
          onChange={() => {}}
          rows="5"
          data-testid={TEST_IDS.MESSAGE_FIELD}
        />
        {error}
      </Field>
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

  renderAttachments = () => {
    const { fullscreen } = this.props

    return (
      <AttachmentList
        ref="attachments"
        updateForm={this.updateForm}
        maxFileCount={this.props.maxFileCount}
        maxFileSize={this.props.maxFileSize}
        fullscreen={fullscreen}
        handleAttachmentsError={this.handleAttachmentsError}
      />
    )
  }

  render = () => {
    const { attachmentsEnabled, hide } = this.props

    const form = this.props.activeTicketForm ? this.renderTicketFormBody() : this.renderFormBody()
    const attachments = attachmentsEnabled ? this.renderAttachments() : null
    const hiddenClass = hide ? styles.hidden : ''

    const buttonDisabled = !this.state.canSubmit || this.state.isSubmitting

    return (
      <form
        noValidate={true}
        onSubmit={this.handleSubmit}
        onChange={this.updateForm}
        ref="form"
        className={`${styles.form} ${hiddenClass}`}
      >
        <Widget>
          <Header title={this.props.formTitle} />
          <Main ref={this.main}>
            {form}
            {attachments}
          </Main>
          <Footer>
            <Button
              primary={true}
              disabled={buttonDisabled}
              type="submit"
              className={styles.button}
              data-testid={TEST_IDS.BUTTON_OK}
            >
              {i18n.t(this.state.buttonMessage)}
            </Button>
          </Footer>
        </Widget>
      </form>
    )
  }
}
