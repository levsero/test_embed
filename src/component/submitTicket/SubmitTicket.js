import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { locals as styles } from './SubmitTicket.scss'

import { AttachmentBox } from 'component/attachment/AttachmentBox'
import { SubmitTicketForm } from 'component/submitTicket/SubmitTicketForm'
import {
  handleFormChange,
  handleTicketFormClick,
  handleTicketSubmission
} from 'src/redux/modules/submitTicket'
import * as selectors from 'src/redux/modules/submitTicket/submitTicket-selectors'
import {
  getMaxFileCount,
  getMaxFileSize,
  getAttachmentsReady,
  getAttachmentTokens,
  getAttachmentTypes
} from 'embeds/support/selectors'
import { clearAttachments } from 'src/embeds/support/actions'
import { getHasContextuallySearched } from 'embeds/helpCenter/selectors'
import { i18n } from 'service/i18n'
import { getSearchTerm } from 'embeds/helpCenter/selectors'
import { getSettingsContactFormSubject } from 'src/redux/modules/settings/settings-selectors'
import {
  getConfigNameFieldRequired,
  getConfigNameFieldEnabled
} from 'src/redux/modules/base/base-selectors'
import { getAttachmentsEnabled, getContactFormTitle } from 'src/redux/modules/selectors'
import { Alert } from '@zendeskgarden/react-notifications'
import { TEST_IDS } from 'src/constants/shared'
import LoadingBarContent from 'src/components/LoadingBarContent'
import trackTicketSubmitted from 'embeds/support/utils/track-ticket-submitted'
import TicketFormsListPage from 'src/embeds/support/pages/TicketFormsListPage'
import SuccessPage from 'src/embeds/support/pages/SuccessPage'

const mapStateToProps = state => {
  return {
    searchTerm: getSearchTerm(state),
    errorMsg: selectors.getErrorMsg(state),
    formState: selectors.getFormState(state),
    loading: selectors.getLoading(state),
    ticketForms: selectors.getTicketForms(state),
    readOnlyState: selectors.getReadOnlyState(state),
    nameFieldRequired: getConfigNameFieldRequired(state),
    nameFieldEnabled: getConfigNameFieldEnabled(state),
    ticketFormsAvailable: selectors.getTicketFormsAvailable(state),
    ticketFields: selectors.getTicketFields(state),
    activeTicketForm: selectors.getActiveTicketForm(state),
    activeTicketFormFields: selectors.getActiveTicketFormFields(state),
    hasContextuallySearched: getHasContextuallySearched(state),
    showNotification: selectors.getShowNotification(state),
    subjectEnabled: getSettingsContactFormSubject(state),
    attachmentsEnabled: getAttachmentsEnabled(state),
    formTitle: getContactFormTitle(state),
    locale: i18n.getLocale(),
    maxFileCount: getMaxFileCount(state),
    maxFileSize: getMaxFileSize(state),
    attachmentsReady: getAttachmentsReady(state),
    attachmentTokens: getAttachmentTokens(state),
    attachmentTypes: getAttachmentTypes(state)
  }
}

class SubmitTicket extends Component {
  static propTypes = {
    attachmentsEnabled: PropTypes.bool,
    errorMsg: PropTypes.string.isRequired,
    formTitle: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    formState: PropTypes.object.isRequired,
    readOnlyState: PropTypes.object.isRequired,
    maxFileCount: PropTypes.number,
    maxFileSize: PropTypes.number,
    previewEnabled: PropTypes.bool,
    showBackButton: PropTypes.func,
    subjectEnabled: PropTypes.bool,
    handleTicketSubmission: PropTypes.func.isRequired,
    nameFieldRequired: PropTypes.bool.isRequired,
    nameFieldEnabled: PropTypes.bool.isRequired,
    ticketFieldSettings: PropTypes.array,
    ticketFormSettings: PropTypes.array,
    ticketForms: PropTypes.array.isRequired,
    ticketFormsAvailable: PropTypes.bool.isRequired,
    ticketFields: PropTypes.object.isRequired,
    handleFormChange: PropTypes.func.isRequired,
    handleTicketFormClick: PropTypes.func.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    activeTicketForm: PropTypes.object,
    searchTerm: PropTypes.string,
    hasContextuallySearched: PropTypes.bool,
    showNotification: PropTypes.bool.isRequired,
    activeTicketFormFields: PropTypes.array,
    isMobile: PropTypes.bool,
    attachmentsReady: PropTypes.bool.isRequired,
    attachmentTokens: PropTypes.array,
    attachmentTypes: PropTypes.array,
    clearAttachments: PropTypes.func.isRequired
  }

  static defaultProps = {
    attachmentsEnabled: false,
    handleTicketFormClick: () => {},
    formTitle: 'Leave a message',
    maxFileCount: 5,
    maxFileSize: 5 * 1024 * 1024,
    previewEnabled: false,
    showBackButton: () => {},
    subjectEnabled: false,
    tags: [],
    ticketFieldSettings: [],
    ticketFormSettings: [],
    ticketForms: [],
    ticketFormsAvailable: false,
    ticketFields: {},
    activeTicketForm: null,
    activeTicketFormFields: [],
    hasContextuallySearched: false,
    isMobile: false,
    attachmentsReady: true,
    attachmentTokens: [],
    attachmentTypes: []
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      isDragActive: false
    }
  }

  clearForm = () => {
    const { ticketFormsAvailable, ticketForms } = this.props

    this.refs.submitTicketForm.clear()

    if (ticketFormsAvailable && ticketForms.length > 1) {
      this.props.handleTicketFormClick(null)
    }
  }

  handleSubmit = (e, data) => {
    e.preventDefault()

    if (!data.isFormValid) {
      // TODO: Handle invalid form submission
      return
    }

    const {
      attachmentTokens,
      attachmentsEnabled,
      formState,
      searchTerm,
      locale,
      hasContextuallySearched,
      attachmentTypes
    } = this.props

    const uploads = attachmentTokens.length > 0 ? attachmentTokens : null
    const failCallback = () => {
      this.refs.submitTicketForm.failedToSubmit()
    }
    const doneCallback = res => {
      if (res && res.error) {
        failCallback(res.error)
        return
      }

      const params = {
        res: res,
        email: _.get(formState, 'email'),
        searchTerm: searchTerm,
        searchLocale: locale,
        contextualSearch: hasContextuallySearched
      }

      if (attachmentsEnabled) {
        _.extend(params, {
          email: _.get(formState, 'email'),
          attachmentsCount: attachmentTokens.length,
          attachmentTypes
        })
      }

      trackTicketSubmitted(params)
      this.clearForm()
    }

    this.props.handleTicketSubmission(uploads, doneCallback, failCallback)
  }

  handleDragEnter = () => {
    this.setState({ isDragActive: true })
  }

  handleDragLeave = () => {
    this.setState({ isDragActive: false })
  }

  handleOnDrop = files => {
    this.setState({ isDragActive: false }, () => {
      this.refs.submitTicketForm.handleOnDrop(files)
    })
  }

  setTicketForm = ticketFormId => {
    const { ticketForms, ticketFormsAvailable } = this.props

    if (!ticketFormsAvailable) return

    const getformByIdFn = form => form.id === parseInt(ticketFormId)
    const activeTicketForm = _.find(ticketForms, getformByIdFn)

    this.props.showBackButton()
    this.props.handleTicketFormClick(activeTicketForm)
  }

  handleTicketFormsListClick = formId => {
    this.setTicketForm(formId)
  }

  renderLoadingBarContent = () => {
    return (
      <div className={styles.loadingBarContentContainer}>
        <LoadingBarContent />
      </div>
    )
  }

  renderErrorMessage = () => {
    if (!this.props.errorMsg) return

    return (
      <Alert type="error" role="alert" className={styles.error} data-testid={TEST_IDS.ERROR_MSG}>
        {this.props.errorMsg}
      </Alert>
    )
  }

  renderForm = () => {
    const {
      activeTicketForm,
      ticketFormSettings,
      activeTicketFormFields,
      ticketFields
    } = this.props
    const getformByIdFn = form => parseInt(form.id) === parseInt(activeTicketForm.id)
    const activeTicketFormSettings = activeTicketForm
      ? _.find(ticketFormSettings, getformByIdFn)
      : {}
    const activeTicketFormPrefill = _.get(activeTicketFormSettings, 'fields', [])
    const fields = activeTicketForm ? activeTicketFormFields : ticketFields

    return (
      <div onDragEnter={this.handleDragEnter}>
        <SubmitTicketForm
          ref="submitTicketForm"
          formTitle={this.props.formTitle}
          fullscreen={this.props.fullscreen}
          hide={this.props.showNotification}
          ticketFields={fields}
          attachmentsEnabled={this.props.attachmentsEnabled}
          subjectEnabled={this.props.subjectEnabled}
          maxFileCount={this.props.maxFileCount}
          nameFieldRequired={this.props.nameFieldRequired}
          nameFieldEnabled={this.props.nameFieldEnabled}
          maxFileSize={this.props.maxFileSize}
          formState={this.props.formState}
          readOnlyState={this.props.readOnlyState}
          setFormState={this.props.handleFormChange}
          ticketFormSettings={activeTicketFormPrefill}
          ticketFieldSettings={this.props.ticketFieldSettings}
          submit={this.handleSubmit}
          activeTicketForm={this.props.activeTicketForm}
          previewEnabled={this.props.previewEnabled}
          isMobile={this.props.isMobile}
          attachmentsReady={this.props.attachmentsReady}
          clearAttachments={this.props.clearAttachments}
        >
          {this.renderErrorMessage()}
        </SubmitTicketForm>
        {this.renderAttachmentBox()}
      </div>
    )
  }

  renderAttachmentBox = () => {
    return this.state.isDragActive && this.props.attachmentsEnabled ? (
      <AttachmentBox onDragLeave={this.handleDragLeave} onDrop={this.handleOnDrop} />
    ) : null
  }

  render = () => {
    if (
      this.props.showNotification ||
      _.isEmpty(this.props.ticketForms) ||
      this.props.activeTicketForm
    ) {
      // We need to keep form rendered while success page is shown, since it relies on accessing
      // dom elements once api call has been completed.
      return (
        <>
          {this.props.showNotification && <SuccessPage />}
          {
            <div style={{ display: this.props.showNotification ? 'none' : 'block' }}>
              {this.renderForm()}
            </div>
          }
        </>
      )
    }

    return <TicketFormsListPage handleFormOptionClick={this.handleTicketFormsListClick} />
  }
}

const actionCreators = {
  handleFormChange,
  handleTicketFormClick,
  handleTicketSubmission,
  clearAttachments
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true, pure: false }
)(SubmitTicket)
export { connectedComponent as default, SubmitTicket as Component }
