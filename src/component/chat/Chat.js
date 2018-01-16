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
import { ChatFeedbackForm } from 'component/chat/ChatFeedbackForm';
import { ChatPopup } from 'component/chat/ChatPopup';
import { ChatRatings } from 'component/chat/ChatRatingGroup';
import { ChatContactDetailsPopup } from 'component/chat/ChatContactDetailsPopup';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { LoadingEllipses } from 'component/loading/LoadingEllipses';
import { i18n } from 'service/i18n';
import { endChat,
         sendMsg,
         sendAttachments,
         setVisitorInfo,
         updateAccountSettings,
         updateCurrentMsg,
         sendChatRating,
         sendChatComment,
         updateChatScreen,
         saveContactDetails,
         toggleEndChatNotification,
         acceptEndChatNotification,
         toggleContactDetailsNotification,
         updateUserSettings } from 'src/redux/modules/chat';
import { PRECHAT_SCREEN, CHATTING_SCREEN, FEEDBACK_SCREEN } from 'src/redux/modules/chat/reducer/chat-screen-types';
import { getPrechatFormFields,
         getAttachmentsEnabled,
         getPrechatFormSettings,
         getIsChatting,
         getAgents,
         getChats,
         getChatScreen,
         getConnection,
         getChatVisitor,
         getCurrentMessage,
         getChatRating,
         getUserSoundSettings,
         getConciergeSettings,
         getShowEndNotification,
         getShowContactDetailsNotification,
         getPostchatFormSettings } from 'src/redux/modules/chat/chat-selectors';

import { locals as styles } from './Chat.scss';

const mapStateToProps = (state) => {
  const prechatForm = getPrechatFormSettings(state);
  const prechatFormFields = getPrechatFormFields(state);

  return {
    attachmentsEnabled: getAttachmentsEnabled(state),
    chats: getChats(state),
    currentMessage: getCurrentMessage(state),
    screen: getChatScreen(state),
    connection: getConnection(state),
    concierge: getConciergeSettings(state),
    prechatFormSettings: { ...prechatForm, form: prechatFormFields },
    postChatFormSettings: getPostchatFormSettings(state),
    showEndNotification: getShowEndNotification(state),
    showContactDetailsNotification: getShowContactDetailsNotification(state),
    isChatting: getIsChatting(state),
    agents: getAgents(state),
    rating: getChatRating(state),
    visitor: getChatVisitor(state),
    userSoundSettings: getUserSoundSettings(state)
  };
};

class Chat extends Component {
  static propTypes = {
    attachmentsEnabled: PropTypes.bool.isRequired,
    concierge: PropTypes.object.isRequired,
    chats: PropTypes.array.isRequired,
    currentMessage: PropTypes.string.isRequired,
    connection: PropTypes.string.isRequired,
    endChat: PropTypes.func.isRequired,
    screen: PropTypes.string.isRequired,
    sendAttachments: PropTypes.func.isRequired,
    prechatFormSettings: PropTypes.object.isRequired,
    postChatFormSettings: PropTypes.object.isRequired,
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
    sendChatComment: PropTypes.func.isRequired,
    updateChatScreen: PropTypes.func.isRequired,
    showEndNotification: PropTypes.bool.isRequired,
    showContactDetailsNotification: PropTypes.bool.isRequired,
    toggleEndChatNotification: PropTypes.func.isRequired,
    toggleContactDetailsNotification: PropTypes.func.isRequired,
    acceptEndChatNotification: PropTypes.func.isRequired,
    isChatting: PropTypes.bool.isRequired,
    agents: PropTypes.object.isRequired,
    visitor: PropTypes.object.isRequired,
    rating: PropTypes.string,
    saveContactDetails: PropTypes.func.isRequired,
    updateUserSettings: PropTypes.func.isRequired,
    userSoundSettings: PropTypes.bool.isRequired
  };

  static defaultProps = {
    getFrameDimensions: () => {},
    isMobile: false,
    newDesign: false,
    position: 'right',
    updateFrameSize: () => {},
    updateAccountSettings: () => {},
    concierge: {},
    rating: null,
    chats: [],
    postChatFormSettings: {},
    updateUserSettings: () => {},
    userSoundSettings: true
  };

  constructor(props) {
    super(props);

    this.state = {
      showMenu: false
    };

    this.scrollContainer = null;
  }

  componentWillReceiveProps = (nextProps) => {
    const { chats } = this.props;

    if (!chats || !nextProps.chats) return;

    if (chats.size !== nextProps.chats.size) {
      setTimeout(() => {
        if (this.scrollContainer) {
          this.scrollContainer.scrollToBottom();
        }
      }, 0);
    }
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
    if (this.props.chats.length <= 0 || this.props.isChatting) return;

    return (
      <div className={styles.chatEnd}>
        {i18n.t('embeddable_framework.chat.ended.label', { fallback: 'Chat Ended' })}
      </div>
    );
  }

  renderChatMenu = () => {
    if (!this.state.showMenu) return;

    const {
      userSoundSettings,
      isChatting,
      toggleEndChatNotification,
      toggleContactDetailsNotification,
      updateUserSettings
    } = this.props;
    const showChatEndFn = () => toggleEndChatNotification(true);
    const showContactDetailsFn = () => toggleContactDetailsNotification(true);
    const toggleSoundFn = () => updateUserSettings({ sound: !userSoundSettings });

    return (
      <ChatMenu
        playSound={userSoundSettings}
        disableEndChat={!isChatting}
        endChatOnClick={showChatEndFn}
        contactDetailsOnClick={showContactDetailsFn}
        onSoundClick={toggleSoundFn} />
    );
  }

  renderChatFooter = () => {
    const { currentMessage, sendMsg, updateCurrentMsg } = this.props;

    const showChatEndFn = () => this.props.toggleEndChatNotification(true);

    return (
      <ChatFooter
        attachmentsEnabled={this.props.attachmentsEnabled}
        endChat={showChatEndFn}
        isChatting={this.props.isChatting}
        handleAttachmentDrop={this.props.sendAttachments}
        toggleMenu={this.toggleMenu}>
        <ChatBox
          currentMessage={currentMessage}
          sendMsg={sendMsg}
          updateCurrentMsg={updateCurrentMsg} />
      </ChatFooter>
    );
  }

  renderChatHeader = (showRating = false) => {
    const { rating, sendChatRating, concierge } = this.props;
    // Title in chat refers to the byline and display_name refers to the display title
    const { avatar_path, display_name, title } = concierge;
    const displayName = _.has(display_name, 'toString') ? display_name.toString() : display_name; // eslint-disable-line camelcase
    const byline = _.has(title, 'toString') ? title.toString() : title;

    return (
      <ChatHeader
        showRating={showRating}
        rating={rating}
        updateRating={sendChatRating}
        avatar={avatar_path} // eslint-disable-line camelcase
        title={displayName}
        byline={byline} />
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
          visitor={this.props.visitor}
          onFormCompleted={this.onPrechatFormComplete} />
      </ScrollContainer>
    );
  }

  renderAgentTyping = () => {
    const agentList = _.filter(this.props.agents, (agent) => agent.typing === true);
    let typingNotification;

    switch (agentList.length) {
      case 0: return null;
      case 1:
        const agent = agentList[0].display_name;

        typingNotification = i18n.t(
          'embeddable_framework.chat.chatLog.isTyping',
          { agent, fallback: `${agent} is typing` });
        break;
      case 2:
        const agent1 = agentList[0].display_name,
          agent2 = agentList[1].display_name;

        typingNotification = i18n.t(
          'embeddable_framework.chat.chatLog.isTyping_two',
          { agent1, agent2, fallback: `${agent1} and ${agent2} are typing` });
        break;
      default:
        typingNotification = i18n.t(
          'embeddable_framework.chat.chatLog.isTyping_multiple',
          { fallback: 'Multiple agents are typing' }
        );
    }

    return (
      <div className={styles.agentTyping}>
        <LoadingEllipses
          useUserColor={false}
          className={styles.loadingEllipses}
          itemClassName={styles.loadingEllipsesItem} />
        {typingNotification}
      </div>
    );
  }

  renderChatScreen = () => {
    if (this.props.screen !== CHATTING_SCREEN) return;

    const showRating = true;
    const containerClasses = this.props.isMobile ? styles.scrollContainerMobile : '';

    return (
      <ScrollContainer
        ref={(el) => { this.scrollContainer = el; }}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        headerContent={this.renderChatHeader(showRating)}
        headerClasses={styles.header}
        containerClasses={containerClasses}
        getFrameDimensions={this.props.getFrameDimensions}
        newDesign={this.props.newDesign}
        footerClasses={styles.footer}
        footerContent={this.renderChatFooter()}>
        <div className={styles.messages}>
          {this.renderChatLog()}
          {this.renderChatEnded()}
          {this.renderAgentTyping()}
        </div>
      </ScrollContainer>
    );
  }

  renderChatLog = () => {
    const { chats, agents } = this.props;

    return (
      <ChatLog agents={agents} chats={chats} />
    );
  }

  renderChatEndPopup = () => {
    if (!this.props.showEndNotification) return null;

    const hideChatEndFn = () => this.props.toggleEndChatNotification(false);

    return (
      <ChatPopup
        className={styles.bottomPopup}
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

  renderPostchatScreen = () => {
    if (this.props.screen !== FEEDBACK_SCREEN) return null;

    const { sendChatRating, updateChatScreen, endChat, sendChatComment } = this.props;
    const { message } = this.props.postChatFormSettings;
    const skipClickFn = () => {
      sendChatRating(ChatRatings.NOT_SET);
      updateChatScreen(CHATTING_SCREEN);
      endChat();
    };
    const sendClickFn = (text = '') => {
      sendChatComment(text);
      updateChatScreen(CHATTING_SCREEN);
    };

    return (
      <ScrollContainer
        headerContent={this.renderChatHeader()}
        newDesign={this.props.newDesign}
        getFrameDimensions={this.props.getFrameDimensions}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}>
        <ChatFeedbackForm
          feedbackMessage={message}
          rating={this.props.rating}
          updateRating={sendChatRating}
          skipClickFn={skipClickFn}
          sendClickFn={sendClickFn} />
      </ScrollContainer>
    );
  }

  renderChatContactDetailsPopup = () => {
    if (!this.props.showContactDetailsNotification) return null;

    const hideContactDetailsFn = () => this.props.toggleContactDetailsNotification(false);

    return (
      <ChatContactDetailsPopup
        className={styles.bottomPopup}
        leftCtaFn={hideContactDetailsFn}
        rightCtaFn={this.props.saveContactDetails} />
    );
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    return (
      <div>
        {this.renderPrechatScreen()}
        {this.renderChatScreen()}
        {this.renderPostchatScreen()}
        {this.renderChatMenu()}
        {this.renderChatEndPopup()}
        {this.renderChatContactDetailsPopup()}
      </div>
    );
  }
}

const actionCreators = {
  toggleEndChatNotification,
  toggleContactDetailsNotification,
  acceptEndChatNotification,
  saveContactDetails,
  sendMsg,
  updateCurrentMsg,
  updateAccountSettings,
  endChat,
  setVisitorInfo,
  sendChatRating,
  sendChatComment,
  updateChatScreen,
  sendAttachments,
  updateUserSettings
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Chat);
