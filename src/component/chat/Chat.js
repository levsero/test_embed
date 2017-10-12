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
import { ChatPopup } from 'component/chat/ChatPopup';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { i18n } from 'service/i18n';
import { endChat,
         sendMsg,
         setVisitorInfo,
         updateAccountSettings,
         updateCurrentMsg,
         sendChatRating,
         updateChatScreen,
         toggleEndChatNotification,
         acceptEndChatNotification } from 'src/redux/modules/chat';
import { PRECHAT_SCREEN, CHATTING_SCREEN } from 'src/redux/modules/chat/reducer/chat-screen-types';
import { getPrechatFormFields } from 'src/redux/modules/chat/selectors';

import { locals as styles } from './Chat.sass';

const mapStateToProps = (state) => {
  const { chat } = state;
  const { accountSettings } = chat;
  const { prechatForm } = chat.accountSettings;
  const prechatFormFields = getPrechatFormFields(state);

  return {
    chat: chat,
    screen: chat.screen,
    connection: chat.connection,
    accountSettings: accountSettings,
    prechatFormSettings: { ...prechatForm, form: prechatFormFields },
    showEndNotification: chat.showEndNotification
};

class Chat extends Component {
  static propTypes = {
    accountSettings: PropTypes.object.isRequired,
    chat: PropTypes.object.isRequired,
    connection: PropTypes.string.isRequired,
    endChat: PropTypes.func.isRequired,
    screen: PropTypes.string.isRequired,
    prechatFormSettings: PropTypes.object.isRequired,
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
    updateChatScreen: PropTypes.func.isRequired,
    showEndNotification: PropTypes.bool.isRequired,
    toggleEndChatNotification: PropTypes.func.isRequired,
    acceptEndChatNotification: PropTypes.func.isRequired
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

    const showChatEndFn = () => this.props.toggleEndChatNotification(true);

    return (
      <ChatMenu endChatOnClick={showChatEndFn} />
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
    const displayName = _.has(display_name, 'toString') ? display_name.toString() : display_name; // eslint-disable-line camelcase
    const byline = _.has(title, 'toString') ? title.toString() : title;

    return (
      <ChatHeader
        rating={chat.rating}
        updateRating={sendChatRating}
        avatar={avatar_path} // eslint-disable-line camelcase
        title={displayName}
        byline={byline}
        endChat={endChat} />
    );
  }

  renderPrechatScreen = () => {
    if (this.props.screen !== PRECHAT_SCREEN) return;

    const { form, message } = this.props.prechatFormSettings;

    return (
      <ScrollContainer
        getFrameDimensions={this.props.getFrameDimensions}
        newDesign={this.props.newDesign}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}>
        <ChatPrechatForm
          form={form}
          greetingMessage={message}
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

  renderChatEndPopup = () => {
    if (!this.props.showEndNotification) return null;

    const hideChatEndFn = () => this.props.toggleEndChatNotification(false);

    return (
      <ChatPopup
        className={styles.chatEndPopup}
        leftCtaFn={hideChatEndFn}
        leftCtaLabel={i18n.t('embeddable_framework.common.button.cancel')}
        rightCtaFn={this.props.acceptEndChatNotification}
        rightCtaLabel={i18n.t('embeddable_framework.chat.form.endChat.button.end')}>
        <div className={styles.chatEndPopupDescription}>
          {i18n.t('embeddable_framework.chat.form.endChat.description')}
        </div>
      </ChatPopup>
    );
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    return (
      <div>
        {this.renderPrechatScreen()}
        {this.renderChatScreen()}
        {this.renderChatMenu()}
        {this.renderChatEndPopup()}
      </div>
    );
  }
}

const actionCreators = {
  toggleEndChatNotification,
  acceptEndChatNotification,
  sendMsg,
  updateCurrentMsg,
  updateAccountSettings,
  endChat,
  setVisitorInfo,
  sendChatRating,
  updateChatScreen
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Chat);
