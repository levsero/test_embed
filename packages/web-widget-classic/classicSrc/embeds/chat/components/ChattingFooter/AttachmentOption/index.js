import { Dropzone } from 'classicSrc/component/chat/attachment/Dropzone'
import { TEST_IDS } from 'classicSrc/constants/shared'
import FooterIconButton from 'classicSrc/embeds/chat/components/FooterIconButton'
import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import { Tooltip } from '@zendeskgarden/react-tooltips'
import { Icon } from './styles'

const AttachmentOption = ({
  isPreview = false,
  isMobile = false,
  handleAttachmentDrop = () => {},
  theme: { rtl },
}) => {
  const translate = useTranslate()

  const attachmentButton = (
    <FooterIconButton
      ignoreThemeOverride={true}
      size="small"
      aria-label={translate('embeddable_framework.chat.icon.attachments.hover.label')}
      data-testid={TEST_IDS.CHAT_ATTACHMENT_BUTTON}
    >
      <Icon data-testid={TEST_IDS.ICON_CHAT_ATTACHMENT} />
    </FooterIconButton>
  )

  if (isPreview) return attachmentButton
  if (isMobile) {
    return <Dropzone onDrop={handleAttachmentDrop}>{attachmentButton}</Dropzone>
  }

  return (
    <Dropzone onDrop={handleAttachmentDrop}>
      <Tooltip
        content={translate('embeddable_framework.chat.icon.attachments.hover.label')}
        placement={rtl ? 'top-start' : 'top-end'}
      >
        {attachmentButton}
      </Tooltip>
    </Dropzone>
  )
}

AttachmentOption.propTypes = {
  isPreview: PropTypes.bool,
  isMobile: PropTypes.bool,
  handleAttachmentDrop: PropTypes.func,
  theme: PropTypes.shape({ rtl: PropTypes.bool }),
}

export default withTheme(AttachmentOption)
