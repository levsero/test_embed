import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ChatMenu from 'embeds/chat/components/ChatMenu'
import { useOnBack } from 'component/webWidget/OnBackProvider'
import { Header, Title, CloseButton, TitleRow, BackButton, HeaderItem } from 'components/Widget'
import { isMobileBrowser } from 'utility/devices'
import { getChatTitle, getIsPopoutButtonVisible } from 'src/redux/modules/selectors'
import { getZChatVendor } from 'src/redux/modules/chat/chat-selectors'
import { getSettingsChatPopout } from 'src/redux/modules/settings/settings-selectors'
import { createChatPopoutWindow } from 'utility/chat'
import { getIsChatPreviewEnabled } from 'src/redux/modules/preview/preview-selectors'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import { handlePopoutButtonClicked } from 'src/redux/modules/base'
import { PopoutIcon } from './styles'

const ChatWidgetHeader = ({
  title,
  zChat,
  popoutSettings,
  isChatPreview,
  isPopoutButtonVisible,
  locale,
  handlePopoutButtonClicked
}) => {
  const onBack = useOnBack()

  const onPopoutClicked = () => {
    if (isChatPreview) {
      return
    }

    handlePopoutButtonClicked()
    createChatPopoutWindow(popoutSettings, zChat.getMachineId(), locale)
  }

  return (
    <Header>
      <TitleRow>
        {isMobileBrowser() ? <ChatMenu onBackClick={onBack} /> : <BackButton />}
        <Title>{title}</Title>

        {isPopoutButtonVisible && (
          <HeaderItem onClick={onPopoutClicked} aria-label="Popout">
            <PopoutIcon />
          </HeaderItem>
        )}

        <CloseButton />
      </TitleRow>
    </Header>
  )
}

ChatWidgetHeader.propTypes = {
  title: PropTypes.string,
  zChat: PropTypes.shape({
    getMachineId: PropTypes.func
  }),
  popoutSettings: PropTypes.shape({}),
  isChatPreview: PropTypes.bool,
  isPopoutButtonVisible: PropTypes.bool,
  locale: PropTypes.string,
  handlePopoutButtonClicked: PropTypes.func
}

const mapStateToProps = state => ({
  title: getChatTitle(state),
  zChat: getZChatVendor(state),
  popoutSettings: getSettingsChatPopout(state),
  isChatPreview: getIsChatPreviewEnabled(state),
  isPopoutButtonVisible: Boolean(getIsChatPreviewEnabled(state) || getIsPopoutButtonVisible(state)),
  locale: getLocale(state)
})

const mapDispatchToProps = {
  handlePopoutButtonClicked
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatWidgetHeader)

export { connectedComponent as default, ChatWidgetHeader as Component }
