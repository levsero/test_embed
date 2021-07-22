import PropTypes from 'prop-types'
import { Close } from '@zendeskgarden/react-notifications'
import { Alert, Title } from 'src/components/Alert'
import { TEST_IDS } from 'src/constants/shared'
import { ATTACHMENT_ERRORS } from 'src/embeds/support/constants'
import {
  formatNameString,
  formatAttachmentSize,
} from 'src/embeds/support/utils/attachmentStringFormatter'
import useTranslate from 'src/hooks/useTranslate'
import { FileName, FileSize, ErrorBody } from './styles'

const AttachmentError = ({
  handleRemoveAttachment,
  attachment: { errorMessage, fileName, fileSize, id },
  maxFileSize,
}) => {
  const translate = useTranslate()
  const handleIconClick = () => {
    handleRemoveAttachment(id)
  }
  const errorTitle =
    errorMessage === ATTACHMENT_ERRORS.TOO_LARGE
      ? translate('embeddable_framework.submitTicket.attachments.error.size_exceeded_header')
      : translate('embeddable_framework.submitTicket.attachments.error.v2.uploading_title')

  const errorBody =
    errorMessage === ATTACHMENT_ERRORS.TOO_LARGE
      ? translate('embeddable_framework.submitTicket.attachments.error.size_exceeded_body', {
          maxSize: Math.round(maxFileSize / 1024 / 1024),
        })
      : translate('embeddable_framework.submitTicket.attachments.error.v2.uploading_body')

  return (
    <Alert type="error" role="alert" data-testid={TEST_IDS.ERROR_MSG}>
      <Title>{errorTitle}</Title>
      {errorBody && <ErrorBody>{errorBody}</ErrorBody>}
      <FileName>{formatNameString(fileName)}</FileName>
      <FileSize>{formatAttachmentSize(fileSize, translate)}</FileSize>
      <Close
        onClick={handleIconClick}
        data-testid={TEST_IDS.ICON_CLOSE}
        aria-label={translate('embeddable_framework.submitTicket.attachments.close')}
        name="attachmentError"
      />
    </Alert>
  )
}

AttachmentError.propTypes = {
  attachment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    fileSize: PropTypes.number.isRequired,
    errorMessage: PropTypes.string,
  }),
  handleRemoveAttachment: PropTypes.func,
  maxFileSize: PropTypes.number.isRequired,
}
export default AttachmentError
