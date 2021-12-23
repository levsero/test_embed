import { useOnDrop } from 'classicSrc/components/FileDropProvider'
import { TEST_IDS } from 'classicSrc/constants/shared'
import {
  uploadAttachedFiles,
  clearLimitExceededError,
} from 'classicSrc/embeds/support/actions/index'
import AttachmentInput from 'classicSrc/embeds/support/components/AttachmentInput'
import AttachmentLimitError from 'classicSrc/embeds/support/components/AttachmentLimitError'
import AttachmentList from 'classicSrc/embeds/support/components/AttachmentList'
import {
  getMaxFileCount,
  getMaxFileSize,
  getAttachmentTitle,
  getAttachmentLimitExceeded,
} from 'classicSrc/embeds/support/selectors'
import SupportPropTypes from 'classicSrc/embeds/support/utils/SupportPropTypes'
import PropTypes from 'prop-types'
import { useRef, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { onNextTick } from '@zendesk/widget-shared-services'
import { Container, StyledLabel, StyledMessage } from './styles'

const INPUT_ID = 'dropzone-input'

const AttachmentField = ({
  displayAttachmentLimitError,
  clearLimitExceededError,
  maxFileCount,
  uploadAttachedFiles,
  title,
  onChange,
  errorMessage,
  value = {},
  field = {},
  errorMessageKey,
}) => {
  const alert = useRef()

  useEffect(() => {
    if (value.limitExceeded || displayAttachmentLimitError) {
      onNextTick(() => {
        if (alert.current) {
          alert.current.scrollIntoView()
        }
      })
    }
  }, [value.limitExceeded, displayAttachmentLimitError])

  const handleFileUpload = useCallback(
    (files) => {
      uploadAttachedFiles(files, onChange, value)
    },
    [onChange, value, uploadAttachedFiles]
  )

  useOnDrop(handleFileUpload)

  const clearLimitError = () => {
    onChange && onChange({ ...value, limitExceeded: false })
  }

  return (
    <Container data-testid={TEST_IDS.ATTACHMENT_LIST_CONTAINER}>
      <StyledLabel htmlFor={INPUT_ID} data-fieldid={field.keyID}>
        {title}
      </StyledLabel>
      {errorMessage && (
        <StyledMessage key={errorMessageKey} role="alert" validation="error">
          {errorMessage}
        </StyledMessage>
      )}
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
    </Container>
  )
}

AttachmentField.propTypes = {
  maxFileCount: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  uploadAttachedFiles: PropTypes.func.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func,
  displayAttachmentLimitError: PropTypes.bool,
  clearLimitExceededError: PropTypes.func,
  field: SupportPropTypes.ticketField,
  errorMessage: PropTypes.string,
  errorMessageKey: PropTypes.number,
}

const actionCreators = {
  clearLimitExceededError,
  uploadAttachedFiles,
}

const mapStateToProps = (state, props) => ({
  maxFileCount: getMaxFileCount(state),
  maxFileSize: getMaxFileSize(state),
  title: getAttachmentTitle(state, props.value && props.value.ids),
  displayAttachmentLimitError: getAttachmentLimitExceeded(state),
})

const connectedComponent = connect(mapStateToProps, actionCreators, null, { forwardRef: true })(
  AttachmentField
)

export { connectedComponent as default, AttachmentField as Component }
