import React from 'react'
import PropTypes from 'prop-types'
import { AttachmentButton, Description, Label, Icon } from './styles'
import useTranslate from 'src/hooks/useTranslate'
import { isMobileBrowser } from 'utility/devices'
import FileInput from 'components/FileInput'

const AttachmentInput = ({ onFileSelect, attachmentInputId, name }) => {
  const translate = useTranslate()

  const label = isMobileBrowser()
    ? translate('embeddable_framework.submitTicket.attachments.button.label_mobile')
    : translate('embeddable_framework.submitTicket.attachments.button.new_label', { files: 5 })

  return (
    <FileInput onFileSelect={onFileSelect} data-testid={attachmentInputId} name={name}>
      <AttachmentButton>
        <Description>
          <Icon />
          <Label>{label}</Label>
        </Description>
      </AttachmentButton>
    </FileInput>
  )
}

AttachmentInput.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  attachmentInputId: PropTypes.string.isRequired,
  name: PropTypes.string
}

export default AttachmentInput