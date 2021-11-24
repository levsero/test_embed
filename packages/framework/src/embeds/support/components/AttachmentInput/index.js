import PropTypes from 'prop-types'
import { isMobileBrowser } from '@zendesk/widget-shared-services'
import FileInput from 'src/components/FileInput'
import useTranslate from 'src/hooks/useTranslate'
import { AttachmentButton, Description, Icon, Label } from './styles'

const AttachmentInput = ({ onFileSelect, attachmentInputId, name }) => {
  const translate = useTranslate()

  const label = isMobileBrowser()
    ? translate('embeddable_framework.submitTicket.attachments.button.label_mobile')
    : translate('embeddable_framework.submitTicket.attachments.button.new_label', { files: 5 })

  return (
    <FileInput onFileSelect={onFileSelect} data-testid={attachmentInputId} name={name}>
      <AttachmentButton
        id={attachmentInputId}
        role={'button'}
        aria-label={'Attachments'}
        aria-describedby={'attachmentButtonDescription'}
      >
        <Description>
          <Icon />
          <Label id={'attachmentButtonDescription'}>{label}</Label>
        </Description>
      </AttachmentButton>
    </FileInput>
  )
}

AttachmentInput.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  attachmentInputId: PropTypes.string.isRequired,
  name: PropTypes.string,
}

export default AttachmentInput
