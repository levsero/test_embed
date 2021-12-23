import { HeaderItem } from 'classicSrc/components/Widget'
import { TEST_IDS } from 'classicSrc/constants/shared'
import { handleSoundIconClick, updateMenuVisibility } from 'classicSrc/embeds/chat/actions/actions'
import FooterIconButton from 'classicSrc/embeds/chat/components/FooterIconButton'
import {
  getMenuVisible,
  getUserSoundSettings,
  getIsChatting,
  getLoginSettings,
} from 'classicSrc/embeds/chat/selectors'
import useTranslate from 'classicSrc/hooks/useTranslate'
import {
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility,
  updateEndChatModalVisibility,
} from 'classicSrc/redux/modules/chat'
import {
  getChannelAvailable,
  getChatEmailTranscriptEnabled,
  getHelpCenterAvailable,
} from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { connect } from 'react-redux'
import { Dropdown, Item, Trigger } from '@zendeskgarden/react-dropdowns'
import { Tooltip } from '@zendeskgarden/react-tooltips'
import { isMobileBrowser, onNextTick } from '@zendesk/widget-shared-services'
import { useCurrentFrame } from 'src/framework/components/Frame'
import {
  SoundOffIcon,
  SoundOnIcon,
  MenuIcon,
  Menu,
  MENU_PADDING,
  Container,
  EllipsisIcon,
} from './styles'

const ChatMenu = ({
  isOpen,
  onToggle,
  soundEnabled,
  editContactDetailsEnabled,
  endChatDisabled,
  emailTranscriptEnabled,
  goBackIsVisible,
  soundIsVisible,
  handleSoundIconClick,
  updateEmailTranscriptVisibility,
  updateContactDetailsVisibility,
  updateEndChatModalVisibility,
  onBackClick,
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState(null)
  const translate = useTranslate()
  const frame = useCurrentFrame()

  const actions = {
    sound: () => handleSoundIconClick({ sound: !soundEnabled }),
    email: () => updateEmailTranscriptVisibility(true),
    contact: () => updateContactDetailsVisibility(true),
    endChat: () => updateEndChatModalVisibility(true),
    back: onBackClick,
  }

  const onStateChange = (state) => {
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

  const onSelect = (item) => {
    if (actions[item]) {
      onNextTick(() => {
        actions[item]()
      })
    }
  }

  const dropdown = (
    <Dropdown
      onSelect={onSelect}
      isOpen={isOpen}
      highlightedIndex={highlightedIndex}
      onStateChange={onStateChange}
      downshiftProps={{
        environment: frame.window,
      }}
    >
      <Trigger>
        {isMobileBrowser() ? (
          <HeaderItem aria-label="Menu" data-testid={TEST_IDS.CHAT_MENU}>
            <MenuIcon />
          </HeaderItem>
        ) : (
          <FooterIconButton aria-label="Menu" data-testid={TEST_IDS.CHAT_MENU}>
            <EllipsisIcon data-testid={TEST_IDS.ICON_ELLIPSIS} aria-hidden="true" />
          </FooterIconButton>
        )}
      </Trigger>
      <Menu
        placement={isMobileBrowser() ? 'bottom' : 'top'}
        data-testid={TEST_IDS.CHAT_MENU_LIST}
        popperModifiers={{
          preventOverflow: {
            padding: isMobileBrowser() ? 0 : MENU_PADDING,
          },
        }}
      >
        {goBackIsVisible && (
          <Item value="back" data-testid={TEST_IDS.CHAT_MENU_ITEM_BACK}>
            {translate('embeddable_framework.common.button.goBack')}
          </Item>
        )}

        {soundIsVisible && (
          <Item value="sound" data-testid={TEST_IDS.CHAT_MENU_ITEM_TOGGLE_SOUND}>
            {translate('embeddable_framework.chat.options.sound')}
            {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
          </Item>
        )}

        {emailTranscriptEnabled && (
          <Item value="email" data-testid={TEST_IDS.CHAT_MENU_ITEM_EMAIL_TRANSCRIPT}>
            {translate('embeddable_framework.chat.options.emailTranscript')}
          </Item>
        )}
        {editContactDetailsEnabled && (
          <Item value="contact" data-testid={TEST_IDS.CHAT_MENU_ITEM_EDIT_CONTACT_DETAILS}>
            {translate('embeddable_framework.chat.options.editContactDetails')}
          </Item>
        )}
        <Item
          value="endChat"
          disabled={endChatDisabled}
          data-testid={TEST_IDS.CHAT_MENU_ITEM_END_CHAT}
        >
          {translate('embeddable_framework.chat.options.endChat')}
        </Item>
      </Menu>
    </Dropdown>
  )

  if (isMobileBrowser()) {
    return dropdown
  }

  return (
    <Tooltip content={translate('embeddable_framework.chat.icon.menu.hover.label')}>
      <Container
        role="presentation"
        onKeyDown={(e) => {
          if (e.key === 'Escape' && isOpen) {
            e.stopPropagation()
          }
        }}
        tabIndex="-1"
      >
        {dropdown}
      </Container>
    </Tooltip>
  )
}

ChatMenu.propTypes = {
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  soundEnabled: PropTypes.bool,
  endChatDisabled: PropTypes.bool,
  editContactDetailsEnabled: PropTypes.bool,
  emailTranscriptEnabled: PropTypes.bool,
  goBackIsVisible: PropTypes.bool,
  soundIsVisible: PropTypes.bool,
  handleSoundIconClick: PropTypes.func,
  updateEmailTranscriptVisibility: PropTypes.func,
  updateContactDetailsVisibility: PropTypes.func,
  updateEndChatModalVisibility: PropTypes.func,
  onBackClick: PropTypes.func,
}

const mapStateToProps = (state, props) => ({
  isOpen: getMenuVisible(state),
  soundEnabled: getUserSoundSettings(state),
  endChatDisabled: !getIsChatting(state),
  editContactDetailsEnabled: getLoginSettings(state).enabled,
  emailTranscriptEnabled: getChatEmailTranscriptEnabled(state),
  goBackIsVisible:
    isMobileBrowser() &&
    props.onBackClick &&
    getHelpCenterAvailable(state) &&
    getChannelAvailable(state),
  soundIsVisible: !isMobileBrowser(),
})

const mapDispatchToProps = {
  onToggle: updateMenuVisibility,
  handleSoundIconClick,
  updateEmailTranscriptVisibility,
  updateContactDetailsVisibility,
  updateEndChatModalVisibility,
}

export { ChatMenu as Component }

export default connect(mapStateToProps, mapDispatchToProps)(ChatMenu)
