import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ChatBox } from 'component/chat/ChatBox';
import { ChatFooter } from 'component/chat/ChatFooter';
import { ChatLog } from 'component/chat/ChatLog';
import { ChatHeader } from 'component/chat/ChatHeader';
import { ChatMenu } from 'component/chat/ChatMenu';
import { ChatPrechatForm } from 'component/chat/ChatPrechatForm';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { i18n } from 'service/i18n';
import { endChat,
         sendMsg,
         setVisitorInfo,
         updateAccountSettings,
         updateCurrentMsg,
         sendChatRating } from 'src/redux/modules/chat';

const mapStateToProps = (state) => {
  return {
    chat: state.chat,
    connection: state.chat.connection,
    accountSettings: state.chat.accountSettings
  };
};
const screens = {
  prechat: 'prechat',
  chatting: 'chatting'
};

class Chat extends Component {
  static propTypes = {
    accountSettings: PropTypes.object.isRequired,
    chat: PropTypes.object.isRequired,
    connection: PropTypes.string.isRequired,
    endChat: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    newDesign: PropTypes.bool,
    position: PropTypes.string,
    styles: PropTypes.object,
    sendMsg: PropTypes.func.isRequired,
    setVisitorInfo: PropTypes.func.isRequired,
    updateCurrentMsg: PropTypes.func.isRequired,
    updateFrameSize: PropTypes.func,
    updateAccountSettings: PropTypes.func.isRequired,
    sendChatRating: PropTypes.func.isRequired
  };

  static defaultProps = {
    isMobile: false,
    newDesign: false,
    position: 'right',
    styles: {},
    updateFrameSize: () => {},
    updateAccountSettings: () => {},
    accountSettings: { concierge: {} }
  };

  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      screen: screens.prechat
    };

    this.scrollContainer = null;
  }

  componentWillReceiveProps = (nextProps) => {
    const { chat } = this.props;

    if (!chat || !nextProps.chat) return;

    if (chat.chats.size !== nextProps.chat.chats.size) {
      setTimeout(() => this.scrollContainer.scrollToBottom(), 0);
    }
  }

  updateUser = (user) => {
    this.props.setVisitorInfo({
      display_name: user.name || '',
      email: user.email || ''
    });
  }

  updateScreen = (screen = screens.chatting) => {
    this.setState({ screen });
  }

  toggleMenu = () => {
    this.setState({ showMenu: !this.state.showMenu });
  }

  onContainerClick = () => {
    this.setState({ showMenu: false });
  }

  onPrechatFormComplete = (info) => {
    this.props.setVisitorInfo(_.pick(info, ['display_name', 'email', 'phone']));
    this.props.sendMsg(info.message);

    this.updateScreen(screens.chatting);
  }

  renderChatEnded = () => {
    if (this.props.chat.chats.size <= 0 || this.props.chat.is_chatting) return;

    return (
      <div className={this.props.styles.chatEnd}>
        {i18n.t('embeddable_framework.chat.ended.label', { fallback: 'Chat Ended' })}
      </div>
    );
  }

  renderChatMenu = () => {
    if (!this.state.showMenu) return;

    return (
      <ChatMenu />
    );
  }

  renderChatFooter = () => {
    const { chat, sendMsg, updateCurrentMsg } = this.props;

    return (
      <ChatFooter
        toggleMenu={this.toggleMenu}>
        <ChatBox
          currentMessage={chat.currentMessage}
          sendMsg={sendMsg}
          updateCurrentMsg={updateCurrentMsg} />
      </ChatFooter>
    );
  }

  renderChatHeader = () => {
    const { chat, sendChatRating, endChat, accountSettings } = this.props;
    // Title in chat refers to the byline and display_name refers to the display title
    const { avatar_path, display_name, title } = accountSettings.concierge;

    return (
      <ChatHeader
        rating={chat.rating}
        updateRating={sendChatRating}
        avatar={avatar_path} // eslint-disable-line
        title={display_name} // eslint-disable-line
        byline={title}
        endChat={endChat} />
    );
  }

  renderPrechatScreen = () => {
    if (this.state.screen !== screens.prechat) return;

    return (
      <ScrollContainer
        containerClasses={this.props.styles.prechatContainer}
        newDesign={this.props.newDesign}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}>
        <ChatPrechatForm
          visitor={this.props.chat.visitor}
          onFormCompleted={this.onPrechatFormComplete} />
      </ScrollContainer>
    );
  }

  renderChatScreen = () => {
    if (this.state.screen !== screens.chatting) return;
    const { styles, isMobile } = this.props;

    const containerClasses = isMobile
                           ? styles.scrollContainerMobile
                           : styles.scrollContainer;

    return (
      <ScrollContainer
        ref={(el) => { this.scrollContainer = el; }}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        headerContent={this.renderChatHeader()}
        headerClasses={styles.header}
        containerClasses={containerClasses}
        footerClasses={styles.footer}
        newDesign={this.props.newDesign}
        footerContent={this.renderChatFooter()}>
        <div className={styles.messages}>
          {this.renderChatLog()}
          {this.renderChatEnded()}
        </div>
      </ScrollContainer>
    );
  }

  renderChatLog = () => {
    const { chat } = this.props;
    const { chats, agents } = chat;

    return (
      <ChatLog agents={agents} chats={chats} />
    );
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    return (
      <div>
        {this.renderPrechatScreen()}
        {this.renderChatScreen()}
        {this.renderChatMenu()}
      </div>
    );
  }
}

const actionCreators = {
  sendMsg,
  updateCurrentMsg,
  updateAccountSettings,
  endChat,
  setVisitorInfo,
  sendChatRating
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Chat);
