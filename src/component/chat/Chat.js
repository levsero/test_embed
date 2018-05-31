import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ChatOffline from 'component/chat/ChatOffline';
import ChatOnline from 'component/chat/ChatOnline';
import { getShowOfflineChat } from 'src/redux/modules/chat/chat-selectors';

const mapStateToProps = (state) => {
  return {
    showOfflineChat: getShowOfflineChat(state)
  };
};

class Chat extends Component {
  static propTypes = {
    updateFrameSize: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    handleCloseClick: PropTypes.func,
    getFrameDimensions: PropTypes.func,
    position: PropTypes.string,
    onBackButtonClick: PropTypes.func,
    showOfflineChat: PropTypes.bool.isRequired,
    updateChatBackButtonVisibility: PropTypes.func.isRequired,
    newHeight: PropTypes.bool
  };

  static defaultProps = {
    isMobile: false,
    hideZendeskLogo: false,
    updateFrameSize: () => {},
    newHeight: false
  };

  constructor() {
    super();

    this.online = null;
  }

  renderChatOffline = () => {
    if (!this.props.showOfflineChat) return;

    return (
      <ChatOffline
        updateFrameSize={this.props.updateFrameSize}
        handleCloseClick={this.props.handleCloseClick}
        isMobile={this.props.isMobile}
        hideZendeskLogo={this.props.hideZendeskLogo}
        newHeight={this.props.newHeight} />
    );
  }

  onContainerClick = () => {
    if (!this.props.showOfflineChat) {
      this.online.getWrappedInstance().onContainerClick();
    }
  }

  renderChatOnline = () => {
    if (this.props.showOfflineChat) return;

    return (
      <ChatOnline
        ref={(el) => { this.online = el; }}
        isMobile={this.props.isMobile}
        position={this.props.position}
        updateFrameSize={this.props.updateFrameSize}
        getFrameDimensions={this.props.getFrameDimensions}
        updateChatBackButtonVisibility={this.props.updateChatBackButtonVisibility}
        onBackButtonClick={this.props.onBackButtonClick}
        hideZendeskLogo={this.props.hideZendeskLogo}
        newHeight={this.props.newHeight} />
    );
  }

  render() {
    setTimeout(() => this.props.updateFrameSize(), 0);

    return (
      <div>
        {this.renderChatOnline()}
        {this.renderChatOffline()}
      </div>
    );
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(Chat);
