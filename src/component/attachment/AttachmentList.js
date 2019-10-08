import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Attachment } from 'component/attachment/Attachment'
import { ButtonDropzone } from 'component/button/ButtonDropzone'
import { onNextTick } from 'src/util/utils'
import { ICONS, FILETYPE_ICONS } from 'constants/shared'
import { i18n } from 'service/i18n'
import { TEST_IDS } from 'src/constants/shared'
import attachmentSender from 'embeds/support/utils/attachment-sender'

import { locals as styles } from './AttachmentList.scss'

export class AttachmentList extends Component {
  static propTypes = {
    updateForm: PropTypes.func.isRequired,
    maxFileCount: PropTypes.number.isRequired,
    maxFileSize: PropTypes.number.isRequired,
    fullscreen: PropTypes.bool,
    handleAttachmentsError: PropTypes.func
  }

  static defaultProps = {
    fullscreen: false,
    handleAttachmentsError: () => {}
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      attachments: {},
      errorMessage: null
    }
    this.id = 'dropzone-input'
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.errorMessage === null && this.state.errorMessage) {
      this.props.handleAttachmentsError()
    }
  }

  handleOnDrop = files => {
    const { maxFileCount, maxFileSize } = this.props
    const numAttachments = this.numValidAttachments()
    const numFilesToAdd = maxFileCount - numAttachments
    const setLimitError = () => {
      const errorMessage = i18n.t(
        'embeddable_framework.submitTicket.attachments.error.limit_reached',
        {
          maxFiles: maxFileCount
        }
      )

      this.setState({ errorMessage })
    }

    if (numAttachments >= maxFileCount) {
      setLimitError()
      return
    }

    // This check is needed so that we can fill the remaining space for attachments regardless of
    // whether or not they go over the limit. If they do we notify them by displaying the limit error.
    if (numAttachments + files.length > maxFileCount) {
      setLimitError()
    }

    _.slice(files, 0, numFilesToAdd).forEach(file => {
      const maxSize = Math.round(maxFileSize / 1024 / 1024)
      const errorMessage =
        file.size >= maxFileSize
          ? i18n.t('embeddable_framework.submitTicket.attachments.error.size', {
              maxSize
            })
          : null

      onNextTick(() => this.createAttachment(file, errorMessage))
    })

    onNextTick(this.props.updateForm)
  }

  handleRemoveAttachment = attachmentId => {
    this.setState({
      attachments: _.omit(this.state.attachments, attachmentId),
      errorMessage: null
    })

    onNextTick(this.props.updateForm)
  }

  createAttachment = (file, errorMessage) => {
    const attachmentId = _.uniqueId()
    const attachment = {
      file: file,
      uploading: true,
      uploadProgress: 0,
      uploadRequestSender: {},
      errorMessage,
      uploadToken: null
    }

    const doneFn = response => {
      const token = JSON.parse(response.text).upload.token

      this.updateAttachmentState(attachmentId, {
        uploading: false,
        uploadToken: token
      })

      onNextTick(this.props.updateForm)
    }
    const failFn = errorMessage => () => {
      this.updateAttachmentState(attachmentId, {
        uploading: false,
        errorMessage: errorMessage
      })

      onNextTick(this.props.updateForm)
    }
    const progressFn = event => {
      this.updateAttachmentState(attachmentId, {
        uploadProgress: event.percent
      })
    }

    this.setState({
      attachments: _.extend({}, this.state.attachments, {
        [attachmentId]: attachment
      })
    })

    onNextTick(() => {
      if (!errorMessage) {
        const error = i18n.t('embeddable_framework.submitTicket.attachments.error.other')

        this.updateAttachmentState(attachmentId, {
          uploadRequestSender: attachmentSender(file, doneFn, failFn(error), progressFn)
        })
      } else {
        failFn(errorMessage)()
      }
    })
  }

  updateAttachmentState = (attachmentId, newState = {}) => {
    const attachment = _.extend({}, this.state.attachments[attachmentId], newState)

    this.setState({
      attachments: _.extend({}, this.state.attachments, {
        [attachmentId]: attachment
      })
    })
  }

  getAttachmentTokens = () => {
    return _.map(this.state.attachments, a => a.uploadToken)
  }

  filterAttachments = includeUploading =>
    _.filter(
      this.state.attachments,
      attachment => (!attachment.uploading || includeUploading) && !attachment.errorMessage
    )

  uploadedAttachments = () => this.filterAttachments(false)

  numUploadedAttachments = () => _.size(this.filterAttachments(false))

  numValidAttachments = () => _.size(this.filterAttachments(true))

  attachmentsReady = () => this.numUploadedAttachments() === _.size(this.state.attachments)

  clear = () => {
    this.setState({
      attachments: {},
      errorMessage: null
    })
  }

  renderAttachments = () => {
    return _.map(this.state.attachments, (attachment, id) => {
      const { file } = attachment

      if (file && file.name) {
        const extension = file.name
          .split('.')
          .pop()
          .toUpperCase()
        const icon = attachment.errorMessage
          ? ''
          : FILETYPE_ICONS[extension] || ICONS.PREVIEW_DEFAULT

        return (
          <Attachment
            key={id}
            attachmentId={id}
            className={styles.attachment}
            file={file}
            filenameMaxLength={30}
            errorMessage={attachment.errorMessage}
            handleRemoveAttachment={this.handleRemoveAttachment}
            icon={icon}
            isRemovable={true}
            uploading={attachment.uploading}
            uploadProgress={attachment.uploadProgress}
            uploadRequestSender={attachment.uploadRequestSender}
          />
        )
      }
    })
  }

  renderErrorMessage = () => (
    <div className={styles.error} data-testid={TEST_IDS.ERROR_MSG}>
      {this.state.errorMessage}
    </div>
  )

  render() {
    const numAttachments = this.numUploadedAttachments()
    const title =
      numAttachments > 0
        ? i18n.t('embeddable_framework.submitTicket.attachments.title_withCount', {
            count: numAttachments
          })
        : i18n.t('embeddable_framework.submitTicket.attachments.title')
    const errorMessage = this.state.errorMessage ? this.renderErrorMessage() : null
    const attachmentComponents = this.renderAttachments()

    return (
      <div>
        <div className={styles.container} data-testid={TEST_IDS.ATTACHMENT_LIST_CONTAINER}>
          <label className={styles.label} htmlFor={this.id}>
            {title}
          </label>
          {attachmentComponents}
          {errorMessage}
          <ButtonDropzone
            onDrop={this.handleOnDrop}
            isMobile={this.props.fullscreen}
            dropzoneId={this.id}
          />
        </div>
      </div>
    )
  }
}
