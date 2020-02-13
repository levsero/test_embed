import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { TEST_IDS } from 'src/constants/shared'
import { Container, Description, Label, Icon } from './styles'
import useTranslate from 'src/hooks/useTranslate'
import { isMobileBrowser } from 'utility/devices'

const AttachmentInput = ({ onFileSelect, attachmentInputId, name }) => {
  const inputRef = useRef(null)
  const translate = useTranslate()

  const label = isMobileBrowser()
    ? translate('embeddable_framework.submitTicket.attachments.button.label_mobile')
    : translate('embeddable_framework.submitTicket.attachments.button.new_label', { files: 5 })

  const onChange = e => {
    e.preventDefault()

    onFileSelect(e.target.files)
  }

  const onClick = () => {
    inputRef.current.value = null
    inputRef.current.click()
  }

  return (
    <Container data-testid={TEST_IDS.DROPZONE} role="presentation" onClick={onClick}>
      <Description>
        <Icon />
        <Label>{label}</Label>
      </Description>
      <input
        type="file"
        name={name}
        multiple={true}
        ref={inputRef}
        onChange={onChange}
        id={attachmentInputId}
        data-testid={attachmentInputId}
      />
    </Container>
  )
}

AttachmentInput.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  attachmentInputId: PropTypes.string.isRequired,
  name: PropTypes.string
}

export default AttachmentInput
