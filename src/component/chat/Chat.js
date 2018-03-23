import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';

import { ChatBox } from 'component/chat/ChatBox';
import { ChatFooter } from 'component/chat/ChatFooter';
import { ChatLog } from 'component/chat/ChatLog';
import { ChatHeader } from 'component/chat/ChatHeader';
import { ChatMenu } from 'component/chat/ChatMenu';
import { ChatPrechatForm } from 'component/chat/ChatPrechatForm';
import { ChatFeedbackForm } from 'component/chat/ChatFeedbackForm';
import { ChatPopup } from 'component/chat/ChatPopup';
import { ChatContactDetailsPopup } from 'component/chat/ChatContactDetailsPopup';
import { ChatEmailTranscriptPopup } from 'component/chat/ChatEmailTranscriptPopup';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { LoadingEllipses } from 'component/loading/LoadingEllipses';
import { AttachmentBox } from 'component/attachment/AttachmentBox';
import { i18n } from 'service/i18n';
import { endChat,
         endChatViaPostChatScreen,
         sendMsg,
         sendAttachments,
         setVisitorInfo,
         setDepartment,
         getAccountSettings,
         handleChatBoxChange,
         sendChatRating,
         sendChatComment,
         updateChatScreen,
         handleSoundIconClick,
         sendEmailTranscript,
         resetEmailTranscript,
         handlePreChatFormChange,
         updateMenuVisibility,
         updateContactDetailsVisibility } from 'src/redux/modules/chat';
import * as screens from 'src/redux/modules/chat/chat-screen-types';
import { getPrechatFormFields,
         getAttachmentsEnabled,
         getPrechatFormSettings,
         getIsChatting,
         getAgents,
         getChatMessages,
         getChatEvents,
         getGroupedChatLog,
         getChatScreen,
         getChatVisitor,
         getCurrentMessage,
         getChatRating,
         getUserSoundSettings,
         getConciergeSettings,
         getPostchatFormSettings,
         getRatingSettings,
         getEmailTranscript,
         getLastAgentLeaveEvent,
         getThemeShowAvatar,
         getPreChatFormState,
         getQueuePosition,
         getMenuVisible,
         getEditContactDetails } from 'src/redux/modules/chat/chat-selectors';
import { locals as styles } from './Chat.scss';
import { agentBot } from 'constants/chat';

const mapStateToProps = (state) => {
  const prechatForm = getPrechatFormSettings(state);
  const prechatFormFields = getPrechatFormFields(state);

  return {
    attachmentsEnabled: getAttachmentsEnabled(state),
    chats: getChatMessages(state),
    events: getChatEvents(state),
    chatLog: getGroupedChatLog(state),
    lastAgentLeaveEvent: getLastAgentLeaveEvent(state),
    currentMessage: getCurrentMessage(state),
    screen: getChatScreen(state),
    concierge: getConciergeSettings(state),
    prechatFormSettings: { ...prechatForm, form: prechatFormFields },
    postChatFormSettings: getPostchatFormSettings(state),
    isChatting: getIsChatting(state),
    agents: getAgents(state),
    rating: getChatRating(state),
    visitor: getChatVisitor(state),
    userSoundSettings: getUserSoundSettings(state),
    ratingSettings: getRatingSettings(state),
    emailTranscript: getEmailTranscript(state),
    showAvatar: getThemeShowAvatar(state),
    preChatFormState: getPreChatFormState(state),
    queuePosition: getQueuePosition(state),
    editContactDetails: getEditContactDetails(state),
    menuVisible: getMenuVisible(state)
  };
};

class Chat extends Component {
  static propTypes = {
    attachmentsEnabled: PropTypes.bool.isRequired,
    concierge: PropTypes.object.isRequired,
    chats: PropTypes.array.isRequired,
    events: PropTypes.array.isRequired,
    chatLog: PropTypes.object.isRequired,
    lastAgentLeaveEvent: PropTypes.object.isRequired,
    currentMessage: PropTypes.string.isRequired,
    endChat: PropTypes.func.isRequired,
    endChatViaPostChatScreen: PropTypes.func.isRequired,
    screen: PropTypes.string.isRequired,
    sendAttachments: PropTypes.func.isRequired,
    prechatFormSettings: PropTypes.object.isRequired,
    postChatFormSettings: PropTypes.object.isRequired,
    isMobile: PropTypes.bool,
    position: PropTypes.string,
    sendMsg: PropTypes.func.isRequired,
    setVisitorInfo: PropTypes.func.isRequired,
    setDepartment: PropTypes.func.isRequired,
    handleChatBoxChange: PropTypes.func.isRequired,
    updateFrameSize: PropTypes.func,
    getAccountSettings: PropTypes.func.isRequired,
    sendChatRating: PropTypes.func.isRequired,
    sendChatComment: PropTypes.func.isRequired,
    updateChatScreen: PropTypes.func.isRequired,
    isChatting: PropTypes.bool.isRequired,
    agents: PropTypes.object.isRequired,
    visitor: PropTypes.object.isRequired,
    rating: PropTypes.object.isRequired,
    handleSoundIconClick: PropTypes.func.isRequired,
    userSoundSettings: PropTypes.bool.isRequired,
    ratingSettings: PropTypes.object.isRequired,
    getFrameDimensions: PropTypes.func.isRequired,
    sendEmailTranscript: PropTypes.func.isRequired,
    emailTranscript: PropTypes.object.isRequired,
    resetEmailTranscript: PropTypes.func,
    showAvatar: PropTypes.bool.isRequired,
    preChatFormState: PropTypes.object,
    handlePreChatFormChange: PropTypes.func,
    queuePosition: PropTypes.number,
    editContactDetails: PropTypes.object.isRequired,
    updateContactDetailsVisibility: PropTypes.func.isRequired,
    updateChatBackButtonVisibility: PropTypes.func,
    updateMenuVisibility: PropTypes.func,
    menuVisible: PropTypes.bool
  };

  static defaultProps = {
    attachmentsEnabled: false,
    isMobile: false,
    position: 'right',
    updateFrameSize: () => {},
    getAccountSettings: () => {},
    concierge: {},
    rating: {},
    chats: [],
    events: [],
    chatLog: {},
    lastAgentLeaveEvent: {},
    postChatFormSettings: {},
    handleSoundIconClick: () => {},
    userSoundSettings: true,
    ratingSettings: { enabled: false },
    agents: {},
    getFrameDimensions: () => {},
    sendEmailTranscript: () => {},
    emailTranscript: {},
    resetEmailTranscript: () => {},
    editContactDetails: {},
    updateChatBackButtonVisibility: () => {},
    updateMenuVisibility: () => {},
    menuVisible: false
  };

  constructor(props) {
    super(props);

    this.state = {
      showEndChatMenu: false,
      showEmailTranscriptMenu: false
    };

    this.scrollContainer = null;
  }

  componentWillReceiveProps = (nextProps) => {
    const { chats, events, screen } = this.props;

    if (!nextProps.chats && !nextProps.events) return;

    const chatLogLength = chats.length + events.length;
    const nextChatLogLength = nextProps.chats.length + nextProps.events.length;
    const nextScreen = nextProps.screen;
    const reRenderChatLog = screen !== nextScreen || chatLogLength !== nextChatLogLength;

    if (nextScreen === screens.CHATTING_SCREEN && reRenderChatLog) {
      setTimeout(() => {
        if (this.scrollContainer) {
          this.scrollContainer.scrollToBottom();
        }
      }, 0);
    }
    if (nextProps.emailTranscript.screen !== screens.EMAIL_TRANSCRIPT_SCREEN &&
        nextProps.emailTranscript.screen !== this.props.emailTranscript.screen) {
      this.setState({ showEmailTranscriptMenu: true });
    }

    this.props.updateChatBackButtonVisibility();
  }

  toggleMenu = () => {
    this.props.updateMenuVisibility(!this.props.menuVisible);
  }

  onContainerClick = () => {
    this.setState({
      showEndChatMenu: false,
      showEmailTranscriptMenu: false
    });

    this.props.updateMenuVisibility(false);
    this.props.updateContactDetailsVisibility(false);
  }

  onPrechatFormComplete = (info) => {
    const sendMessage = () => {
      if (info.message) {
        this.props.sendMsg(info.message);
      }
    };

    if (info.department) {
      this.props.setDepartment(
        parseInt(info.department, 10),
        sendMessage,
        sendMessage
      );
    }
    else {
      sendMessage();
    }

    this.props.setVisitorInfo(_.pick(info, ['display_name', 'email', 'phone']));
    this.props.updateChatScreen(screens.CHATTING_SCREEN);
  }

  renderChatMenu = () => {
    const {
      userSoundSettings,
      isChatting,
      handleSoundIconClick
    } = this.props;
    const showChatEndFn = (e) => {
      e.stopPropagation();
      this.props.updateMenuVisibility(false);
      this.setState({
        showEndChatMenu: true
      });
    };
    const showContactDetailsFn = (e) => {
      e.stopPropagation();
      this.props.updateMenuVisibility(false);
      this.props.updateContactDetailsVisibility(true);
    };
    const showEmailTranscriptFn = (e) => {
      e.stopPropagation();
      this.props.updateMenuVisibility(false);
      this.setState({
        showEmailTranscriptMenu: true
      });
    };
    const toggleSoundFn = () => {
      handleSoundIconClick({ sound: !userSoundSettings });
    };

    return (
      <ChatMenu
        show={this.props.menuVisible}
        playSound={userSoundSettings}
        disableEndChat={!isChatting}
        endChatOnClick={showChatEndFn}
        contactDetailsOnClick={showContactDetailsFn}
        emailTranscriptOnClick={showEmailTranscriptFn}
        onSoundClick={toggleSoundFn}
        isChatting={this.props.isChatting} />
    );
  }

  renderChatFooter = () => {
    const { currentMessage, sendMsg, handleChatBoxChange, isMobile } = this.props;

    const showChatEndFn = (e) => {
      e.stopPropagation();
      this.props.updateMenuVisibility(false);
      this.setState({
        showEndChatMenu: true,
        showEmailTranscriptMenu: false
      });
      this.props.updateContactDetailsVisibility(false);
    };

    const sendChatFn = () => {
      if (_.isEmpty(currentMessage)) return;
      sendMsg(currentMessage);
      handleChatBoxChange('');
    };

    return (
      <ChatFooter
        attachmentsEnabled={this.props.attachmentsEnabled}
        isMobile={isMobile}
        endChat={showChatEndFn}
        sendChat={sendChatFn}
        isChatting={this.props.isChatting}
        handleAttachmentDrop={this.props.sendAttachments}
        toggleMenu={this.toggleMenu}>
        <ChatBox
          isMobile={isMobile}
          currentMessage={currentMessage}
          sendChat={sendChatFn}
          handleChatBoxChange={handleChatBoxChange} />
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
        rating={rating.value}
        updateRating={sendChatRating}
        avatar={avatar_path} // eslint-disable-line camelcase
        title={displayName}
        byline={byline} />
    );
  }

  renderPrechatScreen = () => {
    if (this.props.screen !== screens.PRECHAT_SCREEN) return;

    const { form, message } = this.props.prechatFormSettings;
    const scrollContainerClasses = classNames(
      styles.scrollContainer,
      { [styles.mobileContainer]: this.props.isMobile }
    );

    return (
      <ScrollContainer
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        classes={scrollContainerClasses}
        containerClasses={styles.scrollContainerContent}>
        <ChatPrechatForm
          form={form}
          formState={this.props.preChatFormState}
          setFormState={this.props.handlePreChatFormChange}
          greetingMessage={message}
          visitor={this.props.visitor}
          onFormCompleted={this.onPrechatFormComplete} />
      </ScrollContainer>
    );
  }

  renderAgentTyping = () => {
    const agentList = _.filter(this.props.agents, (agent, key) => agent.typing && key !== agentBot);
    let typingNotification;

    switch (agentList.length) {
      case 0: return null;
      case 1:
        const agent = agentList[0].display_name;

        typingNotification = i18n.t('embeddable_framework.chat.chatLog.isTyping', { agent });
        break;
      case 2:
        const agent1 = agentList[0].display_name,
          agent2 = agentList[1].display_name;

        typingNotification = i18n.t('embeddable_framework.chat.chatLog.isTyping_two', { agent1, agent2 });
        break;
      default:
        typingNotification = i18n.t('embeddable_framework.chat.chatLog.isTyping_multiple');
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
    const { screen, ratingSettings, agents, isMobile, sendMsg } = this.props;

    if (screen !== screens.CHATTING_SCREEN) return;
    const showRating = ratingSettings.enabled && _.size(agents) > 0;
    const containerClasses = classNames(
      styles.scrollContainerMessagesContent,
      { [styles.scrollContainerMobile]: isMobile }
    );
    const messageClasses = classNames(
      styles.messages,
      { [styles.messagesMobile]: isMobile }
    );
    const scrollContainerClasses = classNames(
      styles.scrollContainer,
      { [styles.mobileContainer]: isMobile }
    );
    const footerClasses = classNames(
      styles.footer,
      { [styles.footerMobile]: isMobile }
    );

    return (
      <ScrollContainer
        ref={(el) => { this.scrollContainer = el; }}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        headerContent={this.renderChatHeader(showRating)}
        headerClasses={styles.header}
        containerClasses={containerClasses}
        footerClasses={footerClasses}
        footerContent={this.renderChatFooter()}
        classes={scrollContainerClasses}>
          <div className={messageClasses}>
          <ChatLog
            showAvatar={this.props.showAvatar}
            chatLog={this.props.chatLog}
            lastAgentLeaveEvent={this.props.lastAgentLeaveEvent}
            agents={this.props.agents}
            chatCommentLeft={!!this.props.rating.comment}
            goToFeedbackScreen={() => this.props.updateChatScreen(screens.FEEDBACK_SCREEN)}
            handleSendMsg={sendMsg}
          />
          {this.renderQueuePosition()}
          {this.renderAgentTyping()}
        </div>
      </ScrollContainer>
    );
  }

  handleDragEnter = () => {
    this.setState({ isDragActive: true });
  }

  handleDragLeave = () => {
    this.setState({ isDragActive: false });
  }

  handleDragDrop = (attachments) => {
    this.setState({ isDragActive: false });
    return this.props.sendAttachments(attachments);
  }

  renderAttachmentsBox = () => {
    const { screen, attachmentsEnabled, getFrameDimensions } = this.props;

    if (
      screen !== screens.CHATTING_SCREEN ||
      !this.state.isDragActive ||
      !attachmentsEnabled
    ) return;

    return (
      <AttachmentBox
        onDragLeave={this.handleDragLeave}
        dimensions={getFrameDimensions()}
        onDrop={this.handleDragDrop}
      />
    );
  }

  renderQueuePosition = () => {
    const { queuePosition, agents } = this.props;

    if (!queuePosition || _.size(agents) > 0) return null;

    return (
      <div className={styles.queuePosition}>
        {i18n.t('embeddable_framework.chat.chatLog.queuePosition', { value: queuePosition })}
      </div>
    );
  }

  renderChatEndPopup = () => {
    const hideChatEndFn = () => this.setState({ showEndChatMenu: false });
    const endChatFn = () => {
      this.setState({ showEndChatMenu: false, endChatFromFeedbackForm: true });
      this.props.endChatViaPostChatScreen();
    };

    return (
      <ChatPopup
        leftCtaFn={hideChatEndFn}
        leftCtaLabel={i18n.t('embeddable_framework.common.button.cancel')}
        rightCtaFn={endChatFn}
        show={this.state.showEndChatMenu}
        rightCtaLabel={i18n.t('embeddable_framework.chat.form.endChat.button.end')}>
        <div className={styles.chatEndPopupDescription}>
          {i18n.t('embeddable_framework.chat.form.endChat.description')}
        </div>
      </ChatPopup>
    );
  }

  renderPostchatScreen = () => {
    if (this.props.screen !== screens.FEEDBACK_SCREEN) return null;

    const { sendChatRating, updateChatScreen, endChat, sendChatComment, rating, isChatting, isMobile } = this.props;
    const { message } = this.props.postChatFormSettings;
    const scrollContainerClasses = classNames(
      styles.scrollContainer,
      { [styles.mobileContainer]: isMobile }
    );
    const skipClickFn = () => {
      if (this.state.endChatFromFeedbackForm) endChat();

      updateChatScreen(screens.CHATTING_SCREEN);
      this.setState({ endChatFromFeedbackForm: false });
    };
    const sendClickFn = (newRating, text) => {
      if (newRating !== rating.value) sendChatRating(newRating);
      if (text) sendChatComment(text);
      if (this.state.endChatFromFeedbackForm) endChat();

      updateChatScreen(screens.CHATTING_SCREEN);
      this.setState({ endChatFromFeedbackForm: false });
    };

    const cancelButtonTextKey = isChatting
                              ? 'embeddable_framework.common.button.cancel'
                              : 'embeddable_framework.chat.postChat.rating.button.skip';

    return (
      <ScrollContainer
        headerContent={this.renderChatHeader()}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        classes={scrollContainerClasses}
        containerClasses={styles.scrollContainerContent}>
        <ChatFeedbackForm
          feedbackMessage={message}
          rating={this.props.rating}
          skipClickFn={skipClickFn}
          sendClickFn={sendClickFn}
          cancelButtonText={i18n.t(cancelButtonTextKey)} />
      </ScrollContainer>
    );
  }

  renderChatContactDetailsPopup = () => {
    const { editContactDetails, updateContactDetailsVisibility, setVisitorInfo, visitor } = this.props;
    const hideContactDetailsFn = () => updateContactDetailsVisibility(false);
    const saveContactDetailsFn = (name, email) => setVisitorInfo({ display_name: name, email });

    return (
      <ChatContactDetailsPopup
        screen={editContactDetails.status}
        show={editContactDetails.show}
        leftCtaFn={hideContactDetailsFn}
        rightCtaFn={saveContactDetailsFn}
        visitor={visitor} />
    );
  }

  renderChatEmailTranscriptPopup = () => {
    const hideEmailTranscriptFn = () => this.setState({ showEmailTranscriptMenu: false });
    const sendEmailTranscriptFn = (email) => {
      this.props.sendEmailTranscript(email);
    };
    const tryEmailTranscriptAgain = () => {
      this.props.resetEmailTranscript();
      this.setState({ showEmailTranscriptMenu: true });
    };

    return (
      <ChatEmailTranscriptPopup
        show={this.state.showEmailTranscriptMenu}
        className={styles.bottomPopup}
        leftCtaFn={hideEmailTranscriptFn}
        rightCtaFn={sendEmailTranscriptFn}
        visitor={this.props.visitor}
        emailTranscript={this.props.emailTranscript}
        tryEmailTranscriptAgain={tryEmailTranscriptAgain}
        resetEmailTranscript={this.props.resetEmailTranscript} />
    );
  }

  render = () => {
    const containerStyle = classNames(
      styles.container,
      { [styles.mobileContainer]: this.props.isMobile }
    );

    setTimeout(() => this.props.updateFrameSize(), 0);

    return (
      <div className={containerStyle}>
        {this.renderPrechatScreen()}
        {this.renderChatScreen()}
        {this.renderPostchatScreen()}
        {this.renderChatMenu()}
        {this.renderChatEndPopup()}
        {this.renderChatContactDetailsPopup()}
        {this.renderAttachmentsBox()}
        {this.renderChatEmailTranscriptPopup()}
      </div>
    );
  }
}

const actionCreators = {
  sendMsg,
  handleChatBoxChange,
  getAccountSettings,
  endChat,
  endChatViaPostChatScreen,
  setVisitorInfo,
  setDepartment,
  sendChatRating,
  sendChatComment,
  updateChatScreen,
  sendAttachments,
  handleSoundIconClick,
  sendEmailTranscript,
  resetEmailTranscript,
  handlePreChatFormChange,
  updateMenuVisibility,
  updateContactDetailsVisibility
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Chat);
