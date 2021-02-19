import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ChatOffline from 'embeds/chat/components/ChatOffline'
import LoadingPage from 'components/LoadingPage'
import ChatOnline from 'component/chat/ChatOnline'
import {
  getShowOfflineChat,
  getShowChatHistory,
  getHasChatSdkConnected,
} from 'src/redux/modules/chat/chat-selectors'
import ChatHistoryScreen from 'src/component/chat/chatting/chatHistoryScreen'

const mapStateToProps = (state) => {
  return {
    showOfflineChat: getShowOfflineChat(state),
    showChatHistory: getShowChatHistory(state),
    hasSdkConnected: getHasChatSdkConnected(state),
  }
}

class Chat extends Component {
  static propTypes = {
    hasSdkConnected: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    onBackButtonClick: PropTypes.func,
    showOfflineChat: PropTypes.bool.isRequired,
    updateChatBackButtonVisibility: PropTypes.func.isRequired,
    showChatHistory: PropTypes.bool.isRequired,
    isPreview: PropTypes.bool,
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
        updateChatBackButtonVisibility={this.props.updateChatBackButtonVisibility}
        onBackButtonClick={this.props.onBackButtonClick}
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

export default connect(mapStateToProps, null, null, { forwardRef: true })(Chat)
