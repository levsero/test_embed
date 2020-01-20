import React from 'react'
import PropTypes from 'prop-types'

import { Close } from '@zendeskgarden/react-notifications'
import { TEST_IDS } from 'src/constants/shared'
import { ErrorTitle, FileName, StyledAlert, FileSize } from './styles'
import {
  formatNameString,
  formatAttachmentSize
} from 'src/embeds/support/utils/attachmentStringFormatter'
import { useTranslate } from 'src/hooks/useTranslation'

const AttachmentError = ({
  handleRemoveAttachment,
  attachment: { errorMessage, fileName, fileSize, id }
}) => {
  const translate = useTranslate()
  const handleIconClick = () => {
    handleRemoveAttachment(id)
  }

  return (
    <StyledAlert type="error" role="alert" data-testid={TEST_IDS.ERROR_MSG}>
      <ErrorTitle>{errorMessage}</ErrorTitle>
      <FileName>{formatNameString(fileName)}</FileName>
      <FileSize>{formatAttachmentSize(fileSize, translate)}</FileSize>
      <Close onClick={handleIconClick} data-testid={TEST_IDS.ICON_CLOSE} />
    </StyledAlert>
  )
}

AttachmentError.propTypes = {
  attachment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    fileSize: PropTypes.number.isRequired,
    errorMessage: PropTypes.string
  }),
  handleRemoveAttachment: PropTypes.func
}
export default AttachmentError
