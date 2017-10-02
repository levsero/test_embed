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
         sendChatRating,
         updateChatScreen } from 'src/redux/modules/chat';
import { PRECHAT_SCREEN, CHATTING_SCREEN } from 'src/redux/modules/chat/reducer/chat-screen-types';

import { locals as styles } from './Chat.sass';

const mapStateToProps = (state) => {
  return {
    chat: state.chat,
    screen: state.chat.screen,
    connection: state.chat.connection,
    accountSettings: state.chat.accountSettings
  };
};

class Chat extends Component {
  static propTypes = {
    accountSettings: PropTypes.object.isRequired,
    chat: PropTypes.object.isRequired,
    connection: PropTypes.string.isRequired,
    endChat: PropTypes.func.isRequired,
    screen: PropTypes.string.isRequired,
    getFrameDimensions: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    newDesign: PropTypes.bool,
    position: PropTypes.string,
    sendMsg: PropTypes.func.isRequired,
    setVisitorInfo: PropTypes.func.isRequired,
    updateCurrentMsg: PropTypes.func.isRequired,
    updateFrameSize: PropTypes.func,
    updateAccountSettings: PropTypes.func.isRequired,
    sendChatRating: PropTypes.func.isRequired,
    updateChatScreen: PropTypes.func.isRequired
  };

  static defaultProps = {
    getFrameDimensions: () => {},
    isMobile: false,
    newDesign: false,
    position: 'right',
    updateFrameSize: () => {},
    updateAccountSettings: () => {},
    accountSettings: { concierge: {} }
  };

  constructor(props) {
    super(props);

    this.state = {
      showMenu: false
    };

    this.scrollContainer = null;
  }

  componentWillReceiveProps = (nextProps) => {
    const { chat } = this.props;

    if (!chat || !nextProps.chat) return;

    if (chat.chats.size !== nextProps.chat.chats.size) {
      setTimeout(() => {
        if (this.scrollContainer) {
          this.scrollContainer.scrollToBottom();
        }
      }, 0);
    }
  }

  updateUser = (user) => {
    this.props.setVisitorInfo({
      display_name: user.name || '',
      email: user.email || ''
    });
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

    this.props.updateChatScreen(CHATTING_SCREEN);
  }

  renderChatEnded = () => {
    if (this.props.chat.chats.size <= 0 || this.props.chat.is_chatting) return;

    return (
      <div className={styles.chatEnd}>
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
    if (this.props.screen !== PRECHAT_SCREEN) return;

    return (
      <ScrollContainer
        getFrameDimensions={this.props.getFrameDimensions}
        newDesign={this.props.newDesign}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}>
        <ChatPrechatForm
          visitor={this.props.chat.visitor}
          onFormCompleted={this.onPrechatFormComplete} />
      </ScrollContainer>
    );
  }

  renderChatScreen = () => {
    if (this.props.screen !== CHATTING_SCREEN) return;
    const { isMobile } = this.props;

    const containerClasses = isMobile
                           ? styles.scrollContainerMobile
                           : '';

    return (
      <ScrollContainer
        ref={(el) => { this.scrollContainer = el; }}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        headerContent={this.renderChatHeader()}
        headerClasses={styles.header}
        containerClasses={containerClasses}
        getFrameDimensions={this.props.getFrameDimensions}
        newDesign={this.props.newDesign}
        footerClasses={styles.footer}
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
  sendChatRating,
  updateChatScreen
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Chat);
