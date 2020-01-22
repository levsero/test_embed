import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import AttachmentInput from 'src/embeds/support/components/AttachmentInput'
import AttachmentLimitError from 'src/embeds/support/components/AttachmentLimitError'
import AttachmentList from 'src/embeds/support/components/AttachmentList'
import { TEST_IDS } from 'src/constants/shared'
import { onNextTick } from 'src/util/utils'
import {
  uploadAttachedFiles,
  dragEnded,
  clearLimitExceededError
} from 'src/embeds/support/actions/index'
import {
  getMaxFileCount,
  getMaxFileSize,
  getDisplayDropzone,
  getAttachmentTitle,
  getAttachmentLimitExceeded
} from 'src/embeds/support/selectors'
const INPUT_ID = 'dropzone-input'
import { Container, StyledLabel } from './styles'
import { AttachmentBox } from 'src/component/attachment/AttachmentBox'

const AttachmentField = ({
  displayAttachmentLimitError,
  clearLimitExceededError,
  maxFileCount,
  uploadAttachedFiles,
  title,
  onChange,
  displayDropzone,
  dragEnded,
  value = {}
}) => {
  const alert = useRef()
  useEffect(() => {
    if (value.limitExceeded || displayAttachmentLimitError) {
      onNextTick(() => {
        alert.current.scrollIntoView()
      })
    }
  }, [value.limitExceeded, displayAttachmentLimitError])

  const handleFileUpload = files => {
    uploadAttachedFiles(files, onChange, value)
  }

  const clearLimitError = () => {
    onChange && onChange({ ...value, limitExceeded: false })
  }

  return (
    <Container data-testid={TEST_IDS.ATTACHMENT_LIST_CONTAINER}>
      <StyledLabel htmlFor={INPUT_ID}>{title}</StyledLabel>
      <AttachmentList value={value} onRemoveAttachment={clearLimitError} />
      {(value.limitExceeded || displayAttachmentLimitError) && (
        <AttachmentLimitError
          handleClearError={() => {
            if (onChange) {
              clearLimitError()
            } else {
              clearLimitExceededError()
            }
          }}
          maxFileCount={maxFileCount}
          ref={alert}
        />
      )}
      <AttachmentInput onFileSelect={handleFileUpload} attachmentInputId={INPUT_ID} />

      {displayDropzone && (
        <AttachmentBox
          onDragLeave={dragEnded}
          onDrop={files => {
            dragEnded()
            handleFileUpload(files)
          }}
        />
      )}
    </Container>
  )
}

AttachmentField.propTypes = {
  maxFileCount: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  uploadAttachedFiles: PropTypes.func.isRequired,
  dragEnded: PropTypes.func.isRequired,
  displayDropzone: PropTypes.bool.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func,
  displayAttachmentLimitError: PropTypes.bool,
  clearLimitExceededError: PropTypes.func
}

const actionCreators = {
  clearLimitExceededError,
  uploadAttachedFiles,
  dragEnded
}

const mapStateToProps = (state, props) => ({
  maxFileCount: getMaxFileCount(state),
  maxFileSize: getMaxFileSize(state),
  displayDropzone: getDisplayDropzone(state),
  title: getAttachmentTitle(state, props.value && props.value.ids),
  displayAttachmentLimitError: getAttachmentLimitExceeded(state)
})

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(AttachmentField)

export { connectedComponent as default, AttachmentField as Component }
