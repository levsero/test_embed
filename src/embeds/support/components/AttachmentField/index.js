import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import AttachmentInput from 'src/embeds/support/components/AttachmentInput'
import AttachmentLimitError from 'src/embeds/support/components/AttachmentLimitError'
import AttachmentList from 'src/embeds/support/components/AttachmentList'
import { TEST_IDS } from 'src/constants/shared'
import { clearLimitExceededError, uploadAttachedFiles } from 'src/embeds/support/actions/index'
import {
  getValidAttachments,
  getAttachmentLimitExceeded,
  getMaxFileCount,
  getMaxFileSize
} from 'src/embeds/support/selectors'
const DROPZONE_ID = 'dropzone-input'
import { Container, StyledLabel } from './styles'
import useTranslate from 'src/hooks/useTranslate'

const AttachmentField = ({
  displayAttachmentLimitError,
  clearLimitExceededError,
  maxFileCount,
  uploadAttachedFiles,
  validAttachments,
  handleAttachmentsError
}) => {
  const translate = useTranslate()
  const previousValue = useRef(null)

  useEffect(() => {
    if (previousValue.current !== displayAttachmentLimitError) {
      displayAttachmentLimitError && handleAttachmentsError()
      previousValue.current = displayAttachmentLimitError
    }
  }, [displayAttachmentLimitError, handleAttachmentsError])

  const numAttachments = validAttachments.length
  const title =
    numAttachments > 0
      ? translate('embeddable_framework.submitTicket.attachments.title_withCount', {
          count: numAttachments
        })
      : translate('embeddable_framework.submitTicket.attachments.title')

  return (
    <Container data-testid={TEST_IDS.ATTACHMENT_LIST_CONTAINER}>
      <StyledLabel htmlFor={DROPZONE_ID}>{title}</StyledLabel>
      <AttachmentList />
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

AttachmentField.propTypes = {
  maxFileCount: PropTypes.number.isRequired,
  handleAttachmentsError: PropTypes.func.isRequired,
  validAttachments: PropTypes.array.isRequired,
  displayAttachmentLimitError: PropTypes.bool.isRequired,
  clearLimitExceededError: PropTypes.func.isRequired,
  uploadAttachedFiles: PropTypes.func.isRequired
}

const actionCreators = {
  clearLimitExceededError,
  uploadAttachedFiles
}

const mapStateToProps = state => ({
  validAttachments: getValidAttachments(state),
  displayAttachmentLimitError: getAttachmentLimitExceeded(state),
  maxFileCount: getMaxFileCount(state),
  maxFileSize: getMaxFileSize(state)
})

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(AttachmentField)

export { connectedComponent as default, AttachmentField as Component }
