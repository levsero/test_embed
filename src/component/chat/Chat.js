import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ChatBox } from 'component/chat/ChatBox';
import { ChatHeader } from 'component/chat/ChatHeader';
import { ChatMessage } from 'component/chat/ChatMessage';
import { Container } from 'component/container/Container';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { i18n } from 'service/i18n';
import { sendMsg, updateCurrentMsg } from 'src/redux/actions/chat';

import { locals as styles } from './Chat.sass';

const mapStateToProps = (state) => {
  return { chat: state.chat };
};

class Chat extends Component {
  static propTypes = {
    position: PropTypes.string,
    style: PropTypes.object,
    updateFrameSize: PropTypes.func
  };

  static defaultProps = {
    position: 'right',
    style: null,
    updateFrameSize: () => {}
  };

  renderChatLog = () => {
    if (this.props.chat.chats.length === 0) return;

    const chatRowTemplate = (data) => {
      return (<ChatMessage name={data.display_name} message={data.msg} nick={data.nick} />);
    };

    return _.chain(this.props.chat.chats.toObject())
            .filter((m) => m.type === 'chat.msg')
            .map(chatRowTemplate)
            .value();
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    return (
      <Container
        style={this.props.style}
        position={this.props.position}
        expanded={true}>
        <ScrollContainer
          title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
          headerContent={<ChatHeader />}
          headerClasses={styles.header}
          footerContent={
            <ChatBox
              chat={this.props.chat}
              sendMsg={this.props.sendMsg}
              updateCurrentMsg={this.props.updateCurrentMsg} />}
          contentExpanded={true}>
          <div className={styles.messages}>
            {this.renderChatLog()}
          </div>
        </ScrollContainer>
      </Container>
    );
  }
}

export default connect(mapStateToProps, { sendMsg, updateCurrentMsg }, null, { withRef: true })(Chat);
