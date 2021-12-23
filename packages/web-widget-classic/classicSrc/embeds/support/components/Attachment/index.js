import ProgressBar from 'classicSrc/components/ProgressBar'
import { TEST_IDS } from 'classicSrc/constants/shared'
import {
  formatNameString,
  secondaryText,
} from 'classicSrc/embeds/support/utils/attachmentStringFormatter'
import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'
import { Close } from '@zendeskgarden/react-notifications'
import {
  Description,
  PreviewName,
  AttachmentDetails,
  Preview,
  Container,
  StyledIcon,
} from './styles'

const Attachment = ({ icon, handleRemoveAttachment, attachment }) => {
  const translate = useTranslate()

  const { uploading, uploadProgress, fileName, fileSize } = attachment

  return (
    <Container data-testid={`${TEST_IDS.FILE_NAME}-${attachment.id || 'attachment'}`}>
      <Preview>
        <StyledIcon type={icon} />
        <Description data-testid={TEST_IDS.DESCRIPTION}>
          <PreviewName>{formatNameString(fileName)}</PreviewName>
          <AttachmentDetails>{secondaryText(fileSize, uploading, translate)}</AttachmentDetails>
        </Description>
        <Close
          data-testid={TEST_IDS.ICON_CLOSE}
          onClick={() => {
            handleRemoveAttachment(attachment.id)
          }}
          aria-label={translate('embeddable_framework.submitTicket.attachments.close')}
        />
      </Preview>
      {uploading && <ProgressBar percentLoaded={uploadProgress} />}
    </Container>
  )
}

Attachment.propTypes = {
  attachment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    fileSize: PropTypes.number.isRequired,
    uploading: PropTypes.bool.isRequired,
    uploadProgress: PropTypes.number.isRequired,
  }),
  handleRemoveAttachment: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
}
export default Attachment
