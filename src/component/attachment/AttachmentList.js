import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'

import AttachmentInput from 'src/embeds/support/components/AttachmentInput'
import AttachmentError from 'src/embeds/support/components/AttachmentError'
import AttachmentLimitError from 'src/embeds/support/components/AttachmentLimitError'
import Attachment from 'src/embeds/support/components/Attachment'
import { onNextTick } from 'src/util/utils'
import { ICONS, FILETYPE_ICONS } from 'constants/shared'
import { i18n } from 'service/i18n'
import { TEST_IDS } from 'src/constants/shared'
import {
  uploadAttachment,
  deleteAttachment,
  attachmentLimitExceeded,
  clearLimitExceededError
} from 'src/embeds/support/actions/index'
import {
  getAllAttachments,
  getValidAttachments,
  getAttachmentLimitExceeded
} from 'src/embeds/support/selectors'

import { locals as styles } from './AttachmentList.scss'

class AttachmentList extends Component {
  static propTypes = {
    updateForm: PropTypes.func.isRequired,
    maxFileCount: PropTypes.number.isRequired,
    handleAttachmentsError: PropTypes.func,
    validAttachments: PropTypes.array.isRequired,
    allAttachments: PropTypes.array.isRequired,
    uploadAttachment: PropTypes.func.isRequired,
    deleteAttachment: PropTypes.func.isRequired,
    displayAttachmentLimitError: PropTypes.bool.isRequired,
    attachmentLimitExceeded: PropTypes.func.isRequired,
    clearLimitExceededError: PropTypes.func.isRequired
  }

  static defaultProps = {
    handleAttachmentsError: () => {}
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      attachments: {}
    }
    this.id = 'dropzone-input'
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.displayAttachmentLimitError && this.props.displayAttachmentLimitError) {
      this.props.handleAttachmentsError()
    }
  }

  handleOnDrop = files => {
    const { maxFileCount, validAttachments, attachmentLimitExceeded } = this.props
    const numAttachments = validAttachments.length
    const numFilesToAdd = maxFileCount - numAttachments
    const setLimitError = () => {
      attachmentLimitExceeded()
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
      this.props.uploadAttachment(file)
    })

    onNextTick(this.props.updateForm)
  }

  handleRemoveAttachment = attachmentId => {
    this.props.deleteAttachment(attachmentId)
  }

  renderAttachments = () => {
    return this.props.allAttachments.map(attachment => {
      const { id, fileName } = attachment

      if (!fileName) return null

      if (attachment.errorMessage) {
        return (
          <AttachmentError
            key={id}
            attachment={attachment}
            handleRemoveAttachment={this.handleRemoveAttachment}
          />
        )
      }

      const extension = fileName
        .split('.')
        .pop()
        .toUpperCase()
      const icon = FILETYPE_ICONS[extension] || ICONS.PREVIEW_DEFAULT
      return (
        <Attachment
          key={id}
          attachment={attachment}
          handleRemoveAttachment={this.handleRemoveAttachment}
          icon={icon}
        />
      )
    })
  }

  render() {
    const numAttachments = this.props.validAttachments.length
    const title =
      numAttachments > 0
        ? i18n.t('embeddable_framework.submitTicket.attachments.title_withCount', {
            count: numAttachments
          })
        : i18n.t('embeddable_framework.submitTicket.attachments.title')
    const attachmentComponents = this.renderAttachments()

    return (
      <div>
        <div className={styles.container} data-testid={TEST_IDS.ATTACHMENT_LIST_CONTAINER}>
          <label className={styles.label} htmlFor={this.id}>
            {title}
          </label>
          {attachmentComponents}
          {this.props.displayAttachmentLimitError && (
            <AttachmentLimitError
              handleClearError={this.props.clearLimitExceededError}
              maxFileCount={this.props.maxFileCount}
            />
          )}
          <AttachmentInput onFileSelect={this.handleOnDrop} dropzoneId={this.id} />
        </div>
      </div>
    )
  }
}

const actionCreators = {
  uploadAttachment,
  deleteAttachment,
  attachmentLimitExceeded,
  clearLimitExceededError
}

const mapStateToProps = state => ({
  allAttachments: getAllAttachments(state),
  validAttachments: getValidAttachments(state),
  displayAttachmentLimitError: getAttachmentLimitExceeded(state)
})

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(AttachmentList)

export { connectedComponent as default, AttachmentList as Component }
