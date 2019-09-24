import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Button } from '@zendeskgarden/react-buttons'

import { locals as styles } from './SubmitTicket.scss'

import { AttachmentBox } from 'component/attachment/AttachmentBox'
import { ScrollContainer } from 'component/container/ScrollContainer'
import { SubmitTicketForm } from 'component/submitTicket/SubmitTicketForm'
import { ZendeskLogo } from 'component/ZendeskLogo'
import { SuccessNotification } from 'component/shared/SuccessNotification'
import {
  handleFormChange,
  handleTicketFormClick,
  handleTicketSubmission
} from 'src/redux/modules/submitTicket'
import * as selectors from 'src/redux/modules/submitTicket/submitTicket-selectors'
import { getHasContextuallySearched } from 'embeds/helpCenter/selectors'
import { i18n } from 'service/i18n'
import { ICONS } from 'src/constants/shared'
import { getSearchTerm } from 'embeds/helpCenter/selectors'
import { getSettingsContactFormSubject } from 'src/redux/modules/settings/settings-selectors'
import {
  getConfigNameFieldRequired,
  getConfigNameFieldEnabled
} from 'src/redux/modules/base/base-selectors'
import { getAttachmentsEnabled, getContactFormTitle } from 'src/redux/modules/selectors'
import { Alert } from '@zendeskgarden/react-notifications'
import { TEST_IDS } from 'src/constants/shared'

import classNames from 'classnames'
import LoadingBarContent from 'src/components/LoadingBarContent'
import TicketFormsPage from 'src/embeds/support/pages/TicketFormsPage'

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
    locale: i18n.getLocale()
  }
}

class SubmitTicket extends Component {
  static propTypes = {
    attachmentsEnabled: PropTypes.bool,
    attachmentSender: PropTypes.func.isRequired,
    errorMsg: PropTypes.string.isRequired,
    formTitle: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    formState: PropTypes.object.isRequired,
    readOnlyState: PropTypes.object.isRequired,
    hideZendeskLogo: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
    maxFileCount: PropTypes.number,
    maxFileSize: PropTypes.number,
    onCancel: PropTypes.func,
    onSubmitted: PropTypes.func,
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
    isMobile: PropTypes.bool
  }

  static defaultProps = {
    attachmentsEnabled: false,
    hideZendeskLogo: false,
    handleTicketFormClick: () => {},
    formTitle: 'Leave a message',
    maxFileCount: 5,
    maxFileSize: 5 * 1024 * 1024,
    onCancel: () => {},
    onSubmitted: () => {},
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
    isMobile: false
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

  clearAttachments = () => {
    this.refs.submitTicketForm.clearAttachments()
  }

  handleSubmit = (e, data) => {
    e.preventDefault()

    if (!data.isFormValid) {
      // TODO: Handle invalid form submission
      return
    }

    const attachments = _.get(this.refs, 'submitTicketForm.refs.attachments')
    const uploads = attachments ? attachments.getAttachmentTokens() : null

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
        email: _.get(this.props.formState, 'email'),
        searchTerm: this.props.searchTerm,
        searchLocale: this.props.locale,
        contextualSearch: this.props.hasContextuallySearched
      }

      if (this.props.attachmentsEnabled) {
        const attachmentsList = this.refs.submitTicketForm.refs.attachments
        const attachments = attachmentsList.uploadedAttachments()

        // When the MIME type is unknown use 'application/octet-stream' which
        // represents arbitrary binary data.
        // Reference: http://stackoverflow.com/questions/1176022/unknown-file-type-mime
        const attachmentTypes = _.map(attachments, attachment => {
          const fileType = _.get(attachment, 'file.type')

          return _.isEmpty(fileType) ? 'application/octet-stream' : fileType
        })

        _.extend(params, {
          email: _.get(this.props.formState, 'email'),
          attachmentsCount: attachmentsList.numUploadedAttachments(),
          attachmentTypes: attachmentTypes
        })
      }

      this.props.onSubmitted(params)
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
    this.setState({ isDragActive: false })
    this.refs.submitTicketForm.handleOnDrop(files)
  }

  setTicketForm = ticketFormId => {
    const { ticketForms, ticketFormsAvailable } = this.props

    if (!ticketFormsAvailable) return

    const getformByIdFn = form => form.id === parseInt(ticketFormId)
    const activeTicketForm = _.find(ticketForms, getformByIdFn)

    this.props.showBackButton()
    this.props.handleTicketFormClick(activeTicketForm)
  }

  handleTicketFormsListClick = e => {
    const ticketFormId = e && e.target.getAttribute('data-id')

    this.setTicketForm(ticketFormId)
  }

  renderLoadingBarContent = () => {
    const { fullscreen, isMobile, formTitle } = this.props

    return (
      <ScrollContainer
        title={formTitle}
        fullscreen={fullscreen}
        isMobile={isMobile}
        containerClasses={styles.ticketFormsContainer}
      >
        <div className={styles.loadingBarContentContainer}>
          <LoadingBarContent />
        </div>
      </ScrollContainer>
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
      <SubmitTicketForm
        ref="submitTicketForm"
        onCancel={this.props.onCancel}
        fullscreen={this.props.fullscreen}
        hide={this.props.showNotification}
        ticketFields={fields}
        formTitle={this.props.formTitle}
        attachmentSender={this.props.attachmentSender}
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
      >
        {this.renderErrorMessage()}
      </SubmitTicketForm>
    )
  }

  renderNotification = () => {
    if (!this.props.showNotification) return

    const buttonContainer = classNames({
      [styles.zendeskLogoButton]: !this.props.hideZendeskLogo,
      [styles.noZendeskLogoButton]: this.props.hideZendeskLogo
    })
    const doneButton = (
      <div className={buttonContainer}>
        <Button primary={true} className={styles.button} onClick={this.props.onCancel}>
          {i18n.t('embeddable_framework.common.button.done')}
        </Button>
      </div>
    )

    return (
      <ScrollContainer
        containerClasses={styles.scrollContainerSuccess}
        title={i18n.t('embeddable_framework.submitTicket.notify.message.success')}
        footerContent={doneButton}
        fullscreen={this.props.fullscreen}
        isMobile={this.props.isMobile}
      >
        <SuccessNotification icon={ICONS.SUCCESS_CONTACT_FORM} isMobile={this.props.isMobile} />
      </ScrollContainer>
    )
  }

  renderZendeskLogo = () => {
    return this.props.hideZendeskLogo ? null : (
      <ZendeskLogo formSuccess={this.props.showNotification} fullscreen={false} />
    )
  }

  renderAttachmentBox = () => {
    return this.state.isDragActive && this.props.attachmentsEnabled ? (
      <AttachmentBox onDragLeave={this.handleDragLeave} onDrop={this.handleOnDrop} />
    ) : null
  }

  render = () => {
    const noFormsOrHasActiveForm = _.isEmpty(this.props.ticketForms) || this.props.activeTicketForm

    if (!this.props.showNotification && !noFormsOrHasActiveForm) {
      return <TicketFormsPage handleFormOptionClick={this.handleTicketFormsListClick} />
    }

    const content = noFormsOrHasActiveForm ? this.renderForm() : null
    const display = this.props.loading ? this.renderLoadingBarContent() : content

    return (
      <div>
        {this.renderAttachmentBox()}
        {this.renderNotification()}
        {display}
        {this.renderZendeskLogo()}
      </div>
    )
  }
}

const actionCreators = {
  handleFormChange,
  handleTicketFormClick,
  handleTicketSubmission
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(SubmitTicket)
export { connectedComponent as default, SubmitTicket as Component }
