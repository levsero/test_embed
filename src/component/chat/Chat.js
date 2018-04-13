import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';

import { ButtonPill } from 'component/button/ButtonPill';
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
import { ChatReconnectionBubble } from 'component/chat/ChatReconnectionBubble';
import { ChatAgentList } from 'component/chat/ChatAgentList';
import { ChatOfflineMessageForm } from 'component/chat/ChatOfflineMessageForm';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { LoadingEllipses } from 'component/loading/LoadingEllipses';
import { AttachmentBox } from 'component/attachment/AttachmentBox';
import { Button } from 'component/button/Button';
import { i18n } from 'service/i18n';
import { isFirefox, isIE } from 'utility/devices';
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
         handleReconnect,
         handlePreChatFormChange,
         updateMenuVisibility,
         updateContactDetailsVisibility,
         updateEmailTranscriptVisibility,
         resetCurrentMessage,
         sendOfflineMessage,
         clearDepartment } from 'src/redux/modules/chat';
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
         getEditContactDetails,
         getAgentJoined,
         getConnection,
         getLoginSettings,
         getDepartments,
         getOfflineMessage } from 'src/redux/modules/chat/chat-selectors';
import { locals as styles } from './Chat.scss';
import { chatNameDefault } from 'src/util/utils';
import { AGENT_BOT, CONNECTION_STATUSES, DEPARTMENT_STATUSES } from 'constants/chat';

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
    menuVisible: getMenuVisible(state),
    agentJoined: getAgentJoined(state),
    connection: getConnection(state),
    loginSettings: getLoginSettings(state),
    departments: getDepartments(state),
    offlineMessage: getOfflineMessage(state)
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
    onBackButtonClick: PropTypes.func,
    getAccountSettings: PropTypes.func.isRequired,
    handleReconnect: PropTypes.func.isRequired,
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
    updateEmailTranscriptVisibility: PropTypes.func.isRequired,
    updateChatBackButtonVisibility: PropTypes.func,
    updateMenuVisibility: PropTypes.func,
    menuVisible: PropTypes.bool,
    agentJoined: PropTypes.bool,
    connection: PropTypes.string.isRequired,
    resetCurrentMessage: PropTypes.func,
    loginSettings: PropTypes.object.isRequired,
    departments: PropTypes.object,
    offlineMessage: PropTypes.object,
    sendOfflineMessage: PropTypes.func,
    clearDepartment: PropTypes.func
  };

  static defaultProps = {
    attachmentsEnabled: false,
    isMobile: false,
    position: 'right',
    updateFrameSize: () => {},
    onBackButtonClick: () => {},
    getAccountSettings: () => {},
    concierge: {},
    rating: {},
    chats: [],
    events: [],
    chatLog: {},
    lastAgentLeaveEvent: {},
    preChatFormSettings: {},
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
    menuVisible: false,
    agentJoined: false,
    connection: '',
    resetCurrentMessage: () => {},
    loginSettings: {},
    visitor: {},
    departments: {},
    offlineMessage: {},
    sendOfflineMessage: () => {},
    clearDepartment: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      showEndChatMenu: false
    };

    this.scrollContainer = null;
  }

  componentDidMount() {
    const { screen, chats, events } = this.props;
    const hasMessages = chats.length + events.length > 0;

    if (screen === screens.CHATTING_SCREEN && hasMessages) {
      this.scrollToBottom();
    }

    this.props.updateChatBackButtonVisibility();
  }

  componentWillReceiveProps = (nextProps) => {
    const { chats, events, screen } = this.props;

    if (!nextProps.chats && !nextProps.events) return;

    const chatLogLength = chats.length + events.length;
    const nextChatLogLength = nextProps.chats.length + nextProps.events.length;
    const nextScreen = nextProps.screen;
    const reRenderChatLog = screen !== nextScreen || chatLogLength !== nextChatLogLength;

    if (nextScreen === screens.CHATTING_SCREEN && reRenderChatLog) {
      this.scrollToBottom();
    }

    this.props.updateChatBackButtonVisibility();
  }

  toggleMenu = () => {
    this.props.updateMenuVisibility(!this.props.menuVisible);
  }

  scrollToBottom = () => {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.scrollToBottom();
      }
    }, 0);
  }

  onContainerClick = () => {
    this.setState({
      showEndChatMenu: false
    });

    this.props.updateMenuVisibility(false);
    this.props.updateContactDetailsVisibility(false);
    this.props.updateEmailTranscriptVisibility(false);
  }

  onPrechatFormComplete = (info) => {
    const selectedDepartment = parseInt(info.department);
    const isSelectedDepartmentOffline = (!!selectedDepartment &&
      this.props.departments[selectedDepartment].status !== DEPARTMENT_STATUSES.ONLINE);

    if (isSelectedDepartmentOffline) {
      this.props.sendOfflineMessage(info);
      this.props.updateChatScreen(screens.OFFLINE_MESSAGE_SCREEN);
    } else {
      const sendOnlineMessage = () => info.message ? this.props.sendMsg(info.message) : null;

      if (selectedDepartment) {
        this.props.setDepartment(
          selectedDepartment,
          sendOnlineMessage,
          sendOnlineMessage
        );
      } else {
        this.props.clearDepartment(sendOnlineMessage);
      }
      this.props.setVisitorInfo(
        _.omitBy({
          display_name: info.display_name || info.name,
          email: info.email,
          phone: info.phone
        }, _.isNil)
      );
      this.props.updateChatScreen(screens.CHATTING_SCREEN);
    }

    this.props.resetCurrentMessage();
  }

  showContactDetailsFn = (e) => {
    e.stopPropagation();
    this.props.updateContactDetailsVisibility(true);
  };

  showEmailTranscriptFn = (e) => {
    e.stopPropagation();
    this.props.updateEmailTranscriptVisibility(true);
  };

  renderChatMenu = () => {
    const {
      userSoundSettings,
      isChatting,
      handleSoundIconClick,
      attachmentsEnabled,
      sendAttachments,
      onBackButtonClick,
      isMobile,
      loginSettings,
      menuVisible,
      updateMenuVisibility
    } = this.props;
    const showChatEndFn = (e) => {
      e.stopPropagation();
      updateMenuVisibility(false);
      this.setState({
        showEndChatMenu: true
      });
    };
    const toggleSoundFn = () => {
      handleSoundIconClick({ sound: !userSoundSettings });
    };

    return (
      <ChatMenu
        show={menuVisible}
        playSound={userSoundSettings}
        disableEndChat={!isChatting}
        attachmentsEnabled={attachmentsEnabled}
        onGoBackClick={onBackButtonClick}
        onSendFileClick={sendAttachments}
        endChatOnClick={showChatEndFn}
        contactDetailsOnClick={this.showContactDetailsFn}
        emailTranscriptOnClick={this.showEmailTranscriptFn}
        onSoundClick={toggleSoundFn}
        isChatting={isChatting}
        isMobile={isMobile}
        loginEnabled={loginSettings.enabled} />
    );
  }

  renderChatFooter = () => {
    const { currentMessage, sendMsg, resetCurrentMessage, handleChatBoxChange, isMobile, menuVisible } = this.props;

    const showChatEndFn = (e) => {
      e.stopPropagation();
      this.props.updateMenuVisibility(false);
      this.setState({
        showEndChatMenu: true
      });
      this.props.updateContactDetailsVisibility(false);
      this.props.updateEmailTranscriptVisibility(false);
    };

    const sendChatFn = () => {
      if (_.isEmpty(currentMessage)) return;
      sendMsg(currentMessage);
      resetCurrentMessage();
    };

    return (
      <ChatFooter
        attachmentsEnabled={this.props.attachmentsEnabled}
        isMobile={isMobile}
        endChat={showChatEndFn}
        sendChat={sendChatFn}
        isChatting={this.props.isChatting}
        handleAttachmentDrop={this.props.sendAttachments}
        menuVisible={menuVisible}
        toggleMenu={this.toggleMenu}>
        <ChatBox
          isMobile={isMobile}
          currentMessage={currentMessage}
          sendChat={sendChatFn}
          handleChatBoxChange={handleChatBoxChange} />
      </ChatFooter>
    );
  }

  renderChatHeader = () => {
    const {
      rating,
      sendChatRating,
      concierge,
      agentJoined,
      ratingSettings,
      updateChatScreen,
      screen,
      agents
    } = this.props;
    // Title in chat refers to the byline and display_name refers to the display title
    const { avatar_path, display_name, title } = concierge;
    const displayName = _.has(display_name, 'toString') ? display_name.toString() : display_name; // eslint-disable-line camelcase
    const byline = _.has(title, 'toString') ? title.toString() : title;
    const showRating = screen === screens.CHATTING_SCREEN && ratingSettings.enabled && agentJoined;
    const onAgentDetailsClick = (screen === screens.CHATTING_SCREEN && _.size(agents) > 0)
                  ? () => updateChatScreen(screens.AGENT_LIST_SCREEN)
                  : null;

    return (
      <ChatHeader
        showRating={showRating}
        rating={rating.value}
        updateRating={sendChatRating}
        avatar={avatar_path} // eslint-disable-line camelcase
        title={displayName}
        byline={byline}
        onAgentDetailsClick={onAgentDetailsClick} />
    );
  }

  renderPrechatScreen = () => {
    if (this.props.screen !== screens.PRECHAT_SCREEN && this.props.screen !== screens.OFFLINE_MESSAGE_SCREEN) return;

    const { form, message } = this.props.prechatFormSettings;
    const scrollContainerClasses = classNames(
      styles.scrollContainer,
      { [styles.mobileContainer]: this.props.isMobile }
    );
    let formScreen = null;

    if (this.props.screen === screens.PRECHAT_SCREEN) {
      formScreen = (
        <ChatPrechatForm
          form={form}
          formState={this.props.preChatFormState}
          setFormState={this.props.handlePreChatFormChange}
          greetingMessage={message}
          visitor={this.props.visitor}
          onFormCompleted={this.onPrechatFormComplete} />
      );
    } else if (this.props.screen === screens.OFFLINE_MESSAGE_SCREEN) {
      formScreen = (
        <ChatOfflineMessageForm
          offlineMessage={this.props.offlineMessage}
          onFormBack={() => this.props.updateChatScreen(screens.PRECHAT_SCREEN)} />
      );
    }

    return (
      <ScrollContainer
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        classes={scrollContainerClasses}
        containerClasses={styles.scrollContainerContent}
        fullscreen={this.props.isMobile}>
        {formScreen}
      </ScrollContainer>
    );
  }

  renderAgentTyping = () => {
    const agentList = _.filter(this.props.agents, (agent, key) => agent.typing && key !== AGENT_BOT);
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
    const { screen, isMobile, sendMsg, loginSettings, visitor } = this.props;

    if (screen !== screens.CHATTING_SCREEN) return;

    const containerClasses = classNames({
      [styles.scrollContainerMessagesContent]: isMobile,
      [styles.scrollContainerMessagesContentDesktop]: !isMobile,
      [styles.scrollContainerMobile]: isMobile,
      [styles.scrollBarFix]: isFirefox() || isIE()
    });
    const scrollContainerClasses = classNames(
      styles.scrollContainer,
      { [styles.mobileContainer]: isMobile }
    );
    const chatLogContainerClasses = classNames(
      styles.chatLogContainer,
      { [styles.chatLogContainerMobile]: isMobile }
    );
    const footerClasses = classNames(
      styles.footer,
      { [styles.footerMobile]: isMobile }
    );

    const visitorNameSet = visitor.display_name && !chatNameDefault(visitor.display_name);

    return (
      <ScrollContainer
        ref={(el) => { this.scrollContainer = el; }}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        headerContent={this.renderChatHeader()}
        headerClasses={styles.header}
        containerClasses={containerClasses}
        footerClasses={footerClasses}
        footerContent={this.renderChatFooter()}
        fullscreen={isMobile}
        classes={scrollContainerClasses}>
        <div className={chatLogContainerClasses}>
          <ChatLog
            showAvatar={this.props.showAvatar}
            chatLog={this.props.chatLog}
            lastAgentLeaveEvent={this.props.lastAgentLeaveEvent}
            agents={this.props.agents}
            chatCommentLeft={!!this.props.rating.comment}
            goToFeedbackScreen={() => this.props.updateChatScreen(screens.FEEDBACK_SCREEN)}
            handleSendMsg={sendMsg}
            onImageLoad={this.scrollToBottom}
            showUpdateInfo={loginSettings.enabled && !visitorNameSet}
            updateInfoOnClick={this.showContactDetailsFn}
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
        isMobile={this.props.isMobile}
        useOverlay={this.props.isMobile}
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
        containerClasses={styles.scrollContainerContent}
        fullscreen={isMobile}>
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
    const { editContactDetails, setVisitorInfo, visitor, isMobile, updateContactDetailsVisibility } = this.props;

    if (!editContactDetails.show) return;

    const hideContactDetailsFn = () => updateContactDetailsVisibility(false);
    const tryAgainFn = () => updateContactDetailsVisibility(true);
    const saveContactDetailsFn = (name, email) => setVisitorInfo({ display_name: name, email });

    return (
      <ChatContactDetailsPopup
        contactDetails={editContactDetails}
        screen={editContactDetails.status}
        show={editContactDetails.show}
        isMobile={isMobile}
        leftCtaFn={hideContactDetailsFn}
        rightCtaFn={saveContactDetailsFn}
        tryAgainFn={tryAgainFn}
        visitor={visitor} />
    );
  }

  renderChatEmailTranscriptPopup = () => {
    const {
      emailTranscript,
      sendEmailTranscript,
      updateEmailTranscriptVisibility
    } = this.props;

    if (!emailTranscript.show) return;

    const hideEmailTranscriptFn = () => updateEmailTranscriptVisibility(false);
    const tryEmailTranscriptAgain = () => updateEmailTranscriptVisibility(true);
    const sendEmailTranscriptFn = (email) => sendEmailTranscript(email);

    return (
      <ChatEmailTranscriptPopup
        show={emailTranscript.show}
        isMobile={this.props.isMobile}
        className={styles.bottomPopup}
        leftCtaFn={hideEmailTranscriptFn}
        rightCtaFn={sendEmailTranscriptFn}
        visitor={this.props.visitor}
        emailTranscript={emailTranscript}
        tryEmailTranscriptAgain={tryEmailTranscriptAgain}
        resetEmailTranscript={this.props.resetEmailTranscript} />
    );
  }

  renderChatReconnectionBubble = () => {
    const { connection } = this.props;

    if (connection !== CONNECTION_STATUSES.CONNECTING) return;

    return <ChatReconnectionBubble />;
  }

  renderAgentListScreen = () => {
    const { screen, agents, updateChatScreen, isMobile } = this.props;

    if (screen !== screens.AGENT_LIST_SCREEN) return null;

    const scrollContainerClasses = classNames(
      styles.scrollContainer,
      { [styles.mobileContainer]: isMobile }
    );
    const backButtonOnClick = () => { updateChatScreen(screens.CHATTING_SCREEN); };
    const backToChatButton = (
      <Button
        fullscreen={isMobile}
        label={i18n.t('embeddable_framework.chat.agentList.button.backToChat')}
        onTouchStartDisabled={true}
        onClick={backButtonOnClick}
        className={styles.agentListBackButton} />
    );

    return (
      <ScrollContainer
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        classes={scrollContainerClasses}
        containerClasses={styles.scrollContainerContent}
        footerContent={backToChatButton}
        fullscreen={isMobile}
        >
        <ChatAgentList agents={agents} />
      </ScrollContainer>
    );
  }

  renderChatReconnectButton = () => {
    const { connection } = this.props;

    if (connection !== CONNECTION_STATUSES.CLOSED) return;

    return (
      <div className={styles.reconnectContainer}>
        <ButtonPill
          className={styles.reconnectButton}
          showIcon={false}
          onClick={this.props.handleReconnect}
          label={i18n.t('embeddable_framework.chat.chatLog.reconnect.label')} />
      </div>
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
        {this.renderAgentListScreen()}
        {this.renderPostchatScreen()}
        {this.renderChatMenu()}
        {this.renderChatEndPopup()}
        {this.renderChatContactDetailsPopup()}
        {this.renderAttachmentsBox()}
        {this.renderChatEmailTranscriptPopup()}
        {this.renderChatReconnectionBubble()}
        {this.renderChatReconnectButton()}
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
  handleReconnect,
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility,
  resetCurrentMessage,
  sendOfflineMessage,
  clearDepartment
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Chat);
