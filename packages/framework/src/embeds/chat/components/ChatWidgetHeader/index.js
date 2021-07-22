import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useOnBack } from 'src/component/webWidget/OnBackProvider'
import {
  HeaderView,
  Title,
  CloseButton,
  TitleRow,
  BackButton,
  HeaderItem,
} from 'src/components/Widget'
import { TEST_IDS } from 'src/constants/shared'
import ChatMenu from 'src/embeds/chat/components/ChatMenu'
import { handlePopoutCreated } from 'src/redux/modules/base'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import { getZChatVendor } from 'src/redux/modules/chat/chat-selectors'
import { getIsChatPreviewEnabled } from 'src/redux/modules/preview/preview-selectors'
import { getChatTitle, getIsPopoutButtonVisible } from 'src/redux/modules/selectors'
import { getSettingsChatPopout } from 'src/redux/modules/settings/settings-selectors'
import { createChatPopoutWindow } from 'utility/chat'
import { isMobileBrowser } from 'utility/devices'
import { PopoutIcon } from './styles'

const ChatWidgetHeader = ({
  title,
  zChat,
  popoutSettings,
  isChatPreview,
  isPopoutButtonVisible,
  locale,
  handlePopoutCreated,
}) => {
  const onBack = useOnBack()

  const onPopoutClicked = () => {
    if (isChatPreview) {
      return
    }

    handlePopoutCreated()
    createChatPopoutWindow(popoutSettings, zChat.getMachineId(), locale)
  }

  return (
    <HeaderView>
      <TitleRow>
        {isMobileBrowser() ? <ChatMenu onBackClick={onBack} /> : <BackButton />}
        <Title>{title}</Title>

        {isPopoutButtonVisible && (
          <HeaderItem onClick={onPopoutClicked} aria-label="Popout">
            <PopoutIcon data-testid={TEST_IDS.ICON_POPOUT} />
          </HeaderItem>
        )}

        <CloseButton />
      </TitleRow>
    </HeaderView>
  )
}

ChatWidgetHeader.propTypes = {
  title: PropTypes.string,
  zChat: PropTypes.shape({
    getMachineId: PropTypes.func,
  }),
  popoutSettings: PropTypes.shape({}),
  isChatPreview: PropTypes.bool,
  isPopoutButtonVisible: PropTypes.bool,
  locale: PropTypes.string,
  handlePopoutCreated: PropTypes.func,
}

const mapStateToProps = (state) => ({
  title: getChatTitle(state),
  zChat: getZChatVendor(state),
  popoutSettings: getSettingsChatPopout(state),
  isChatPreview: getIsChatPreviewEnabled(state),
  isPopoutButtonVisible: Boolean(getIsChatPreviewEnabled(state) || getIsPopoutButtonVisible(state)),
  locale: getLocale(state),
})

const mapDispatchToProps = {
  handlePopoutCreated,
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ChatWidgetHeader)

export { connectedComponent as default, ChatWidgetHeader as Component }
