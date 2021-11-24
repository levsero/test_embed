import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { isMobileBrowser } from '@zendesk/widget-shared-services'
import ChatOnline from 'src/component/chat/ChatOnline'
import ChatHistoryScreen from 'src/component/chat/chatting/chatHistoryScreen'
import LoadingPage from 'src/components/LoadingPage'
import ChatOffline from 'src/embeds/chat/components/ChatOffline'
import {
  getShowOfflineChat,
  getShowChatHistory,
  getHasChatSdkConnected,
} from 'src/embeds/chat/selectors'
import { updateBackButtonVisibility } from 'src/redux/modules/base'
import { getChatStandalone } from 'src/redux/modules/base/base-selectors'
import {
  getChannelChoiceAvailable,
  getHelpCenterAvailable,
  getHideZendeskLogo,
} from 'src/redux/modules/selectors'

const mapStateToProps = (state) => {
  return {
    showOfflineChat: getShowOfflineChat(state),
    showChatHistory: getShowChatHistory(state),
    hasSdkConnected: getHasChatSdkConnected(state),
    isMobile: isMobileBrowser(),
    hideZendeskLogo: getHideZendeskLogo(state),
    chatStandalone: getChatStandalone(state),
    helpCenterAvailable: getHelpCenterAvailable(state),
    channelChoiceAvailable: getChannelChoiceAvailable(state),
  }
}

class Chat extends Component {
  static propTypes = {
    hasSdkConnected: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    showOfflineChat: PropTypes.bool.isRequired,
    showChatHistory: PropTypes.bool.isRequired,
    isPreview: PropTypes.bool,
    chatStandalone: PropTypes.bool,
    helpCenterAvailable: PropTypes.bool,
    channelChoiceAvailable: PropTypes.bool,
    updateBackButtonVisibility: PropTypes.func,
  }

  static defaultProps = {
    isMobile: false,
    hideZendeskLogo: false,

    isPreview: false,
  }

  handleDragEnter = () => {
    if (this.online) {
      this.online.handleDragEnter()
    }
  }

  renderChatHistory = () => {
    if (!this.props.showChatHistory) return

    return <ChatHistoryScreen hideZendeskLogo={this.props.hideZendeskLogo} />
  }

  renderChatOnline = () => {
    if (this.props.showOfflineChat || this.props.showChatHistory) return

    return (
      <ChatOnline
        ref={(el) => {
          this.online = el
        }}
        isMobile={this.props.isMobile}
        updateChatBackButtonVisibility={() => {
          if (this.props.chatStandalone) return

          this.props.updateBackButtonVisibility(
            this.props.helpCenterAvailable || this.props.channelChoiceAvailable
          )
        }}
        hideZendeskLogo={this.props.hideZendeskLogo}
        isPreview={this.props.isPreview}
      />
    )
  }

  renderChatOffline = () => {
    if (!this.props.showOfflineChat || this.props.showChatHistory) return

    return <ChatOffline />
  }

  render() {
    if (!this.props.hasSdkConnected) return <LoadingPage />
    return (
      <div>
        {this.renderChatHistory()}
        {this.renderChatOnline()}
        {this.renderChatOffline()}
      </div>
    )
  }
}

export default connect(mapStateToProps, { updateBackButtonVisibility }, null, { forwardRef: true })(
  Chat
)
