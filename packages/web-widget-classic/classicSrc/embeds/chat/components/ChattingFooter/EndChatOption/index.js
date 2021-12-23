import { TEST_IDS } from 'classicSrc/constants/shared'
import FooterIconButton from 'classicSrc/embeds/chat/components/FooterIconButton'
import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import { Tooltip } from '@zendeskgarden/react-tooltips'
import { Icon } from './styles'

const EndChatOption = ({ endChat, isChatting, theme: { rtl } }) => {
  const translate = useTranslate()

  const handleEndChatClick = (e) => {
    if (isChatting) endChat(e)
  }

  const endChatButton = (
    <FooterIconButton
      ignoreThemeOverride={true}
      colorType="fill"
      size="small"
      onClick={handleEndChatClick}
      aria-label={translate('embeddable_framework.chat.icon.endChat.hover.label')}
      disabled={!isChatting}
      data-testid={TEST_IDS.BUTTON_END_CHAT}
    >
      <Icon data-testid={TEST_IDS.ICON_END_CHAT} />
    </FooterIconButton>
  )

  return (
    <Tooltip
      placement={rtl ? 'top-start' : 'top-end'}
      content={translate('embeddable_framework.chat.icon.endChat.hover.label')}
    >
      {endChatButton}
    </Tooltip>
  )
}

EndChatOption.propTypes = {
  isChatting: PropTypes.bool,
  endChat: PropTypes.func,
  theme: PropTypes.shape({ rtl: PropTypes.bool }),
}

export default withTheme(EndChatOption)
