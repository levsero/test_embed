import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ChatOffline from 'component/chat/ChatOffline';
import ChatOnline from 'component/chat/ChatOnline';
import { getShowOfflineChat } from 'src/redux/modules/chat/chat-selectors';
import { cancelButtonClicked } from 'src/redux/modules/base';

const mapStateToProps = (state) => {
  return {
    showOfflineChat: getShowOfflineChat(state)
  };
};

class Chat extends Component {
  static propTypes = {
    getFrameContentDocument: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    cancelButtonClicked: PropTypes.func,
    position: PropTypes.string,
    onBackButtonClick: PropTypes.func,
    showOfflineChat: PropTypes.bool.isRequired,
    updateChatBackButtonVisibility: PropTypes.func.isRequired
  };

  static defaultProps = {
    isMobile: false,
    hideZendeskLogo: false
  };

  constructor() {
    super();

    this.online = null;
    this.offline = null;
  }

  forceUpdate() {
    this.getActiveComponent().forceUpdate();
  }

  getActiveComponent = () => {
    return (this.online) ? this.online : this.offline;
  }

  renderChatOffline = () => {
    if (!this.props.showOfflineChat) return;

    return (
      <ChatOffline
        ref={(el) => { this.offline = el; }}
        getFrameContentDocument={this.props.getFrameContentDocument}
        handleCloseClick={this.props.cancelButtonClicked}
        isMobile={this.props.isMobile}
        hideZendeskLogo={this.props.hideZendeskLogo} />
    );
  }

  onContainerClick = () => {
    if (!this.props.showOfflineChat) {
      this.online.getWrappedInstance().onContainerClick();
    }
  }

  handleDragEnter = () => {
    if (this.online) {
      this.online.getWrappedInstance().handleDragEnter();
    }
  }

  renderChatOnline = () => {
    if (this.props.showOfflineChat) return;

    return (
      <ChatOnline
        ref={(el) => { this.online = el; }}
        isMobile={this.props.isMobile}
        position={this.props.position}
        getFrameContentDocument={this.props.getFrameContentDocument}
        updateChatBackButtonVisibility={this.props.updateChatBackButtonVisibility}
        onBackButtonClick={this.props.onBackButtonClick}
        hideZendeskLogo={this.props.hideZendeskLogo} />
    );
  }

  render() {
    return (
      <div>
        {this.renderChatOnline()}
        {this.renderChatOffline()}
      </div>
    );
  }
}

export default connect(mapStateToProps, { cancelButtonClicked } , null, { withRef: true })(Chat);
