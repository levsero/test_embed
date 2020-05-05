import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from '@zendeskgarden/react-tooltips'
import { withTheme } from 'styled-components'

import useTranslate from 'src/hooks/useTranslate'
import FooterIconButton from 'embeds/chat/components/FooterIconButton'
import { TEST_IDS } from 'src/constants/shared'

import { Icon } from './styles'

const EndChatOption = ({ endChat, isChatting, theme: { rtl } }) => {
  const translate = useTranslate()

  const handleEndChatClick = e => {
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
    <Tooltip placement={rtl ? 'top-start' : 'top-end'} trigger={endChatButton}>
      {translate('embeddable_framework.chat.icon.endChat.hover.label')}
    </Tooltip>
  )
}

EndChatOption.propTypes = {
  isChatting: PropTypes.bool,
  endChat: PropTypes.func,
  theme: PropTypes.shape({ rtl: PropTypes.bool })
}

export default withTheme(EndChatOption)
