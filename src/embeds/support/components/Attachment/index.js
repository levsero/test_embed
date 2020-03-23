import React from 'react'
import PropTypes from 'prop-types'

import { ProgressBar } from 'component/attachment/ProgressBar'
import { Close } from '@zendeskgarden/react-notifications'
import { TEST_IDS } from 'src/constants/shared'
import {
  Description,
  PreviewName,
  AttachmentDetails,
  Preview,
  Container,
  StyledIcon
} from './styles'
import useTranslate from 'src/hooks/useTranslate'
import { formatNameString, secondaryText } from 'src/embeds/support/utils/attachmentStringFormatter'

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
    uploadProgress: PropTypes.number.isRequired
  }),
  handleRemoveAttachment: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired
}
export default Attachment
