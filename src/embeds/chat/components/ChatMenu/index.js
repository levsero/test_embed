import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Dropdown, Item, Trigger } from '@zendeskgarden/react-dropdowns'
import { Icon } from '@zendeskgarden/react-buttons'
import { Tooltip } from '@zendeskgarden/react-tooltips'
import EllipsisIcon from 'icons/widget-icon_ellipsis.svg'
import MenuIcon from 'icons/widget-icon_menu.svg'
import {
  getMenuVisible,
  getUserSoundSettings,
  getIsChatting
} from 'src/redux/modules/chat/chat-selectors'
import {
  handleSoundIconClick,
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility,
  updateEndChatModalVisibility,
  updateMenuVisibility
} from 'src/redux/modules/chat'
import { getWebWidgetFrameContentWindow } from 'utility/globals'

import { isMobileBrowser } from 'utility/devices'
import useTranslation from 'src/hooks/useTranslation'
import {
  getChannelAvailable,
  getChatEmailTranscriptEnabled,
  getHelpCenterAvailable
} from 'src/redux/modules/selectors'
import { TEST_IDS } from 'constants/shared'
import { SoundOffIcon, SoundOnIcon, IconButton, Menu, MENU_PADDING } from './styles'
import FooterIconButton from 'embeds/chat/components/FooterIconButton'
import { onNextTick } from 'utility/utils'

const ChatMenu = ({
  isOpen,
  onToggle,
  soundEnabled,
  endChatDisabled,
  emailTranscriptEnabled,
  goBackIsVisible,
  soundIsVisible,
  handleSoundIconClick,
  updateEmailTranscriptVisibility,
  updateContactDetailsVisibility,
  updateEndChatModalVisibility,
  onBackClick
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState(null)
  const emailTranscriptLabel = useTranslation('embeddable_framework.chat.options.emailTranscript')
  const endChatLabel = useTranslation('embeddable_framework.chat.options.endChat')
  const contactDetailsLabel = useTranslation('embeddable_framework.chat.options.editContactDetails')
  const soundLabel = useTranslation('embeddable_framework.chat.options.sound')
  const tooltipLabel = useTranslation('embeddable_framework.chat.icon.menu.hover.label')
  const goBackLabel = useTranslation('embeddable_framework.common.button.goBack')

  const actions = {
    sound: () => handleSoundIconClick({ sound: !soundEnabled }),
    email: () => updateEmailTranscriptVisibility(true),
    contact: () => updateContactDetailsVisibility(true),
    endChat: () => updateEndChatModalVisibility(true),
    back: onBackClick
  }

  const onStateChange = state => {
    if (state.selectedItem === 'sound') {
      // if the sound item has been selected, prevent the dropdown from closing
      // or losing focus on the sound item
      return
    }

    if (state.isOpen !== undefined) {
      if (state.isOpen) {
        updateEmailTranscriptVisibility(false)
        updateContactDetailsVisibility(false)
        updateEndChatModalVisibility(false)
      }

      onToggle(state.isOpen)
    }

    if (state.highlightedIndex !== undefined) {
      setHighlightedIndex(state.highlightedIndex)
    }
  }

  const onSelect = item => {
    if (actions[item]) {
      onNextTick(() => {
        actions[item]()
      })
    }
  }

  const CurrentIconButton = isMobileBrowser() ? IconButton : FooterIconButton

  return (
    <div
      role="presentation"
      onKeyDown={e => {
        if (e.key === 'Escape' && isOpen) {
          e.stopPropagation()
        }
      }}
    >
      <Dropdown
        onSelect={onSelect}
        isOpen={isOpen}
        highlightedIndex={highlightedIndex}
        onStateChange={onStateChange}
        downshiftProps={{
          environment: getWebWidgetFrameContentWindow()
        }}
      >
        <Tooltip
          placement={isMobileBrowser() ? 'bottom-start' : 'top-end'}
          trigger={
            <Trigger>
              <CurrentIconButton
                pill={false}
                aria-label="Menu"
                ignoreThemeOverride={true}
                data-testid={TEST_IDS.CHAT_MENU}
                colorType="fill"
              >
                <Icon>
                  {isMobileBrowser() ? (
                    <MenuIcon />
                  ) : (
                    <EllipsisIcon data-testid={TEST_IDS.ICON_ELLIPSIS} />
                  )}
                </Icon>
              </CurrentIconButton>
            </Trigger>
          }
        >
          {tooltipLabel}
        </Tooltip>

        <Menu
          placement={isMobileBrowser() ? 'bottom' : 'top'}
          popperModifiers={{
            preventOverflow: {
              padding: isMobileBrowser() ? 0 : MENU_PADDING
            }
          }}
        >
          {goBackIsVisible && (
            <Item value="back" data-testid={TEST_IDS.CHAT_MENU_ITEM_BACK}>
              {goBackLabel}
            </Item>
          )}

          {soundIsVisible && (
            <Item value="sound" data-testid={TEST_IDS.CHAT_MENU_ITEM_TOGGLE_SOUND}>
              {soundLabel} {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
            </Item>
          )}

          {emailTranscriptEnabled && (
            <Item value="email" data-testid={TEST_IDS.CHAT_MENU_ITEM_EMAIL_TRANSCRIPT}>
              {emailTranscriptLabel}
            </Item>
          )}
          <Item value="contact" data-testid={TEST_IDS.CHAT_MENU_ITEM_EDIT_CONTACT_DETAILS}>
            {contactDetailsLabel}
          </Item>
          <Item
            value="endChat"
            disabled={endChatDisabled}
            data-testid={TEST_IDS.CHAT_MENU_ITEM_END_CHAT}
          >
            {endChatLabel}
          </Item>
        </Menu>
      </Dropdown>
    </div>
  )
}

ChatMenu.propTypes = {
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  soundEnabled: PropTypes.bool,
  endChatDisabled: PropTypes.bool,
  emailTranscriptEnabled: PropTypes.bool,
  goBackIsVisible: PropTypes.bool,
  soundIsVisible: PropTypes.bool,
  handleSoundIconClick: PropTypes.func,
  updateEmailTranscriptVisibility: PropTypes.func,
  updateContactDetailsVisibility: PropTypes.func,
  updateEndChatModalVisibility: PropTypes.func,
  onBackClick: PropTypes.func
}

const mapStateToProps = (state, props) => ({
  isOpen: getMenuVisible(state),
  soundEnabled: getUserSoundSettings(state),
  endChatDisabled: !getIsChatting(state),
  emailTranscriptEnabled: getChatEmailTranscriptEnabled(state),
  goBackIsVisible:
    isMobileBrowser() &&
    props.onBackClick &&
    getHelpCenterAvailable(state) &&
    getChannelAvailable(state),
  soundIsVisible: !isMobileBrowser()
})

const mapDispatchToProps = {
  onToggle: updateMenuVisibility,
  handleSoundIconClick,
  updateEmailTranscriptVisibility,
  updateContactDetailsVisibility,
  updateEndChatModalVisibility
}

export { ChatMenu as Component }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatMenu)
