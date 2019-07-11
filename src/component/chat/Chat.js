import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ChatOffline from 'component/chat/ChatOffline'
import ChatOnline from 'component/chat/ChatOnline'
import { getShowOfflineChat, getShowChatHistory } from 'src/redux/modules/chat/chat-selectors'
import { cancelButtonClicked } from 'src/redux/modules/base'
import ChatHistoryScreen from 'src/component/chat/chatting/chatHistoryScreen'

const mapStateToProps = state => {
  return {
    showOfflineChat: getShowOfflineChat(state),
    showChatHistory: getShowChatHistory(state)
  }
}

class Chat extends Component {
  static propTypes = {
    getFrameContentDocument: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    fullscreen: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    cancelButtonClicked: PropTypes.func,
    position: PropTypes.string,
    onBackButtonClick: PropTypes.func,
    showOfflineChat: PropTypes.bool.isRequired,
    updateChatBackButtonVisibility: PropTypes.func.isRequired,
    chatId: PropTypes.string,
    showChatHistory: PropTypes.bool.isRequired
  }

  static defaultProps = {
    isMobile: false,
    fullscreen: false,
    hideZendeskLogo: false,
    chatId: ''
  }

  constructor() {
    super()

    this.online = null
    this.offline = null
  }

  forceUpdate() {
    this.getActiveComponent().forceUpdate()
  }

  getActiveComponent = () => {
    return this.online ? this.online : this.offline
  }

  onContainerClick = () => {
    if (!this.props.showOfflineChat) {
      this.online.getWrappedInstance().onContainerClick()
    }
  }

  handleDragEnter = () => {
    if (this.online) {
      this.online.getWrappedInstance().handleDragEnter()
    }
  }

  renderChatHistory = () => {
    if (!this.props.showChatHistory) return

    return (
      <ChatHistoryScreen
        fullscreen={this.props.fullscreen}
        isMobile={this.props.isMobile}
        hideZendeskLogo={this.props.hideZendeskLogo}
        chatId={this.props.chatId}
      />
    )
  }

  renderChatOnline = () => {
    if (this.props.showOfflineChat || this.props.showChatHistory) return

    return (
      <ChatOnline
        ref={el => {
          this.online = el
        }}
        isMobile={this.props.isMobile}
        fullscreen={this.props.fullscreen}
        position={this.props.position}
        getFrameContentDocument={this.props.getFrameContentDocument}
        updateChatBackButtonVisibility={this.props.updateChatBackButtonVisibility}
        onBackButtonClick={this.props.onBackButtonClick}
        chatId={this.props.chatId}
        hideZendeskLogo={this.props.hideZendeskLogo}
      />
    )
  }

  renderChatOffline = () => {
    if (!this.props.showOfflineChat || this.props.showChatHistory) return

    return (
      <ChatOffline
        ref={el => {
          this.offline = el
        }}
        getFrameContentDocument={this.props.getFrameContentDocument}
        handleCloseClick={this.props.cancelButtonClicked}
        isMobile={this.props.isMobile}
        chatId={this.props.chatId}
        fullscreen={this.props.fullscreen}
        hideZendeskLogo={this.props.hideZendeskLogo}
      />
    )
  }

  render() {
    return (
      <div>
        {this.renderChatHistory()}
        {this.renderChatOnline()}
        {this.renderChatOffline()}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  { cancelButtonClicked },
  null,
  { withRef: true }
)(Chat)
