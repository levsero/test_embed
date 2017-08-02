import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ChatBox } from 'component/chat/ChatBox';
import { ChatFooter } from 'component/chat/ChatFooter';
import { ChatHeader } from 'component/chat/ChatHeader';
import { ChatMessage } from 'component/chat/ChatMessage';
import { ChatMenu } from 'component/chat/ChatMenu';
import { Container } from 'component/container/Container';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { i18n } from 'service/i18n';
import { isMobileBrowser } from 'utility/devices';
import { endChat,
         sendMsg,
         setVisitorInfo,
         updateAccountSettings,
         updateCurrentMsg,
         sendChatRating } from 'src/redux/modules/chat';

import { locals as styles } from './Chat.sass';

const mapStateToProps = (state) => {
  return {
    chat: state.chat,
    connection: state.chat.connection,
    accountSettings: state.chat.accountSettings
  };
};

class Chat extends Component {
  static propTypes = {
    accountSettings: PropTypes.object.isRequired,
    chat: PropTypes.object.isRequired,
    endChat: PropTypes.func.isRequired,
    position: PropTypes.string,
    sendMsg: PropTypes.func.isRequired,
    setVisitorInfo: PropTypes.func.isRequired,
    style: PropTypes.object,
    updateCurrentMsg: PropTypes.func.isRequired,
    updateFrameSize: PropTypes.func,
    updateAccountSettings: PropTypes.func.isRequired,
    sendChatRating: PropTypes.func.isRequired
  };

  static defaultProps = {
    position: 'right',
    style: null,
    updateFrameSize: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      showMenu: false
    };
  }

  componentDidMount = () => {
    // populates agentSettings with the defaults for the account
    this.props.updateAccountSettings();
  }

  componentWillReceiveProps = (nextProps, props) => {
    // populates agentSettings with the correct settings once they're connected
    if (props.connection === 'connecting' && nextProps.connection !== 'connecting') {
      this.props.updateAccountSettings();
    }
  }

  updateUser = (user) => {
    this.props.setVisitorInfo({
      display_name: user.name || '', // eslint-disable-line camelcase
      email: user.email || ''
    });
  }

  toggleMenu = () => {
    this.setState({ showMenu: !this.state.showMenu });
  }

  onContainerClick = () => {
    this.setState({ showMenu: false });
  }

  renderChatLog = () => {
    const { chats } = this.props.chat;

    if (chats.size <= 0) return;

    const chatMessage = (data, key) => {
      return (<ChatMessage key={key} name={data.display_name} message={data.msg} nick={data.nick} />);
    };

    return _.chain([...chats.values()])
            .filter((m) => m.type === 'chat.msg')
            .map(chatMessage)
            .value();
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
    const { avatar_path, display_name, title } = accountSettings.concierge;

    return (
      <ChatHeader
        rating={chat.rating}
        updateRating={sendChatRating}
        avatar={avatar_path}
        title={title}
        byline={display_name}
        endChat={endChat} />
    );
  }

  containerClasses = () => {
    return isMobileBrowser()
           ? styles.containerMobile
           : styles.container;
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    return (
      <Container
        onClick={this.onContainerClick}
        style={this.props.style}
        position={this.props.position}>
        <ScrollContainer
          title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
          headerContent={this.renderChatHeader()}
          headerClasses={styles.header}
          containerClasses={this.containerClasses()}
          footerClasses={styles.footer}
          footerContent={this.renderChatFooter()}>
          <div className={styles.messages}>
            {this.renderChatLog()}
            {this.renderChatEnded()}
          </div>
        </ScrollContainer>
        {this.renderChatMenu()}
      </Container>
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
