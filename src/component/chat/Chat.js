import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ChatBox } from 'component/chat/ChatBox';
import { ChatHeader } from 'component/chat/ChatHeader';
import { ChatMessage } from 'component/chat/ChatMessage';
import { Container } from 'component/container/Container';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { i18n } from 'service/i18n';
import { endChat,
         sendMsg,
         setVisitorInfo,
         updateCurrentMsg } from 'src/redux/modules/chat';

import { locals as styles } from './Chat.sass';

const mapStateToProps = (state) => {
  return { chat: state.chat };
};

class Chat extends Component {
  static propTypes = {
    chat: PropTypes.object.isRequired,
    endChat: PropTypes.func.isRequired,
    position: PropTypes.string,
    sendMsg: PropTypes.func.isRequired,
    setVisitorInfo: PropTypes.func.isRequired,
    style: PropTypes.object,
    updateCurrentMsg: PropTypes.func.isRequired,
    updateFrameSize: PropTypes.func
  };

  static defaultProps = {
    position: 'right',
    style: null,
    updateFrameSize: () => {}
  };

  updateUser = (user) => {
    this.props.setVisitorInfo({
      display_name: user.name || '', // eslint-disable-line camelcase
      email: user.email || ''
    });
  }

  renderChatLog = () => {
    if (this.props.chat.chats.length <= 0) return;

    const chatMessage = (data, key) => {
      return (<ChatMessage key={key} name={data.display_name} message={data.msg} nick={data.nick} />);
    };

    return _.chain(this.props.chat.chats.toObject())
            .filter((m) => m.type === 'chat.msg')
            .map(chatMessage)
            .value();
  }

  renderChatEnded = () => {
    if (this.props.chat.chats.length <= 0 || this.props.chat.is_chatting) return;

    return (
      <div className={styles.chatEnd}>
        {i18n.t('embeddable_framework.chat.ended.label', { fallback: 'Chat Ended' })}
      </div>
    );
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    const { chat } = this.props;

    return (
      <Container
        style={this.props.style}
        position={this.props.position}
        expanded={true}>
        <ScrollContainer
          title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
          headerContent={<ChatHeader agents={chat.agents} endChat={this.props.endChat} />}
          headerClasses={styles.header}
          contentClasses={styles.content}
          footerClasses={styles.footer}
          footerContent={
            <ChatBox
              currentMessage={chat.currentMessage}
              sendMsg={this.props.sendMsg}
              updateCurrentMsg={this.props.updateCurrentMsg} />}
          contentExpanded={true}>
          <div className={styles.messages}>
            {this.renderChatLog()}
            {this.renderChatEnded()}
          </div>
        </ScrollContainer>
      </Container>
    );
  }
}

const actionCreators = {
  sendMsg,
  updateCurrentMsg,
  endChat,
  setVisitorInfo
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Chat);
