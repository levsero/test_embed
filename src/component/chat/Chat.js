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
    getFrameContentDocument: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    handleCloseClick: PropTypes.func,
    getFrameDimensions: PropTypes.func,
    position: PropTypes.string,
    onBackButtonClick: PropTypes.func,
    showOfflineChat: PropTypes.bool.isRequired,
    updateChatBackButtonVisibility: PropTypes.func.isRequired
  };

  static defaultProps = {
    isMobile: false,
    hideZendeskLogo: false,
    updateFrameSize: () => {}
  };

  constructor() {
    super();

    this.online = null;
    this.offline = null;
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
        updateFrameSize={this.props.updateFrameSize}
        handleCloseClick={this.props.handleCloseClick}
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
        updateFrameSize={this.props.updateFrameSize}
        getFrameContentDocument={this.props.getFrameContentDocument}
        getFrameDimensions={this.props.getFrameDimensions}
        updateChatBackButtonVisibility={this.props.updateChatBackButtonVisibility}
        onBackButtonClick={this.props.onBackButtonClick}
        hideZendeskLogo={this.props.hideZendeskLogo} />
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
