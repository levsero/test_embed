import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import AttachmentInput from 'src/embeds/support/components/AttachmentInput'
import AttachmentError from 'src/embeds/support/components/AttachmentError'
import AttachmentLimitError from 'src/embeds/support/components/AttachmentLimitError'
import Attachment from 'src/embeds/support/components/Attachment'
import { ICONS, FILETYPE_ICONS } from 'constants/shared'
import { i18n } from 'service/i18n'
import { TEST_IDS } from 'src/constants/shared'
import {
  deleteAttachment,
  clearLimitExceededError,
  uploadAttachedFiles
} from 'src/embeds/support/actions/index'
import {
  getAllAttachments,
  getValidAttachments,
  getAttachmentLimitExceeded
} from 'src/embeds/support/selectors'
const DROPZONE_ID = 'dropzone-input'
import { Container, StyledLabel } from './styles'

const AttachmentList = ({
  displayAttachmentLimitError,
  clearLimitExceededError,
  maxFileCount,
  uploadAttachedFiles,
  validAttachments,
  allAttachments,
  deleteAttachment,
  handleAttachmentsError
}) => {
  const prevValue = useRef(null)

  useEffect(() => {
    if (prevValue.current !== displayAttachmentLimitError) {
      displayAttachmentLimitError && handleAttachmentsError()
      prevValue.current = displayAttachmentLimitError
    }
  }, [displayAttachmentLimitError, handleAttachmentsError])

  const handleRemoveAttachment = attachmentId => {
    deleteAttachment(attachmentId)
  }

  const renderAttachments = () => {
    return allAttachments.map(attachment => {
      const { id, fileName } = attachment

      if (!fileName) return null

      if (attachment.errorMessage) {
        return (
          <AttachmentError
            key={id}
            attachment={attachment}
            handleRemoveAttachment={handleRemoveAttachment}
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
          handleRemoveAttachment={handleRemoveAttachment}
          icon={icon}
        />
      )
    })
  }

  const numAttachments = validAttachments.length
  const title =
    numAttachments > 0
      ? i18n.t('embeddable_framework.submitTicket.attachments.title_withCount', {
          count: numAttachments
        })
      : i18n.t('embeddable_framework.submitTicket.attachments.title')
  const attachmentComponents = renderAttachments()

  return (
    <Container data-testid={TEST_IDS.ATTACHMENT_LIST_CONTAINER}>
      <StyledLabel htmlFor={DROPZONE_ID}>{title}</StyledLabel>
      {attachmentComponents}
      {displayAttachmentLimitError && (
        <AttachmentLimitError
          handleClearError={clearLimitExceededError}
          maxFileCount={maxFileCount}
        />
      )}
      <AttachmentInput onFileSelect={uploadAttachedFiles} dropzoneId={DROPZONE_ID} />
    </Container>
  )
}

AttachmentList.propTypes = {
  maxFileCount: PropTypes.number.isRequired,
  handleAttachmentsError: PropTypes.func.isRequired,
  validAttachments: PropTypes.array.isRequired,
  allAttachments: PropTypes.array.isRequired,
  deleteAttachment: PropTypes.func.isRequired,
  displayAttachmentLimitError: PropTypes.bool.isRequired,
  clearLimitExceededError: PropTypes.func.isRequired,
  uploadAttachedFiles: PropTypes.func.isRequired
}

const actionCreators = {
  deleteAttachment,
  clearLimitExceededError,
  uploadAttachedFiles
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
