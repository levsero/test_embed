import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import Transition from 'react-transition-group/Transition';

import { ButtonPill } from 'component/button/ButtonPill';
import { ChatBox } from 'component/chat/ChatBox';
import { ChatFooter } from 'component/chat/ChatFooter';
import { ChatLog } from 'component/chat/ChatLog';
import { ChatHistoryLog } from 'component/chat/ChatHistoryLog';
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
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { ZendeskLogo } from 'component/ZendeskLogo';
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
  clearDepartment,
  fetchConversationHistory } from 'src/redux/modules/chat';
import * as screens from 'src/redux/modules/chat/chat-screen-types';
import * as selectors from 'src/redux/modules/chat/chat-selectors';
import { getHasMoreHistory,
  getHistoryRequestStatus,
  getGroupedPastChatsBySession } from 'src/redux/modules/chat/chat-history-selectors';
import { locals as styles } from './ChatOnline.scss';
import { chatNameDefault } from 'src/util/utils';
import { CONNECTION_STATUSES, DEPARTMENT_STATUSES } from 'constants/chat';

const mapStateToProps = (state) => {
  const prechatForm = selectors.getPrechatFormSettings(state);
  const prechatFormFields = selectors.getPrechatFormFields(state);

  return {
    attachmentsEnabled: selectors.getAttachmentsEnabled(state),
    chats: selectors.getChatMessages(state),
    events: selectors.getChatEvents(state),
    chatLog: selectors.getGroupedChatLog(state),
    hasMoreHistory: getHasMoreHistory(state),
    historyRequestStatus: getHistoryRequestStatus(state),
    chatHistoryLog: getGroupedPastChatsBySession(state),
    lastAgentLeaveEvent: selectors.getLastAgentLeaveEvent(state),
    currentMessage: selectors.getCurrentMessage(state),
    screen: selectors.getChatScreen(state),
    concierges: selectors.getCurrentConcierges(state),
    prechatFormSettings: { ...prechatForm, form: prechatFormFields },
    postChatFormSettings: selectors.getPostchatFormSettings(state),
    isChatting: selectors.getIsChatting(state),
    allAgents: selectors.getAllAgents(state),
    activeAgents: selectors.getActiveAgents(state),
    agentsTyping: selectors.getAgentsTyping(state),
    rating: selectors.getChatRating(state),
    visitor: selectors.getChatVisitor(state),
    userSoundSettings: selectors.getUserSoundSettings(state),
    ratingSettings: selectors.getRatingSettings(state),
    emailTranscript: selectors.getEmailTranscript(state),
    showAvatar: selectors.getThemeShowAvatar(state),
    preChatFormState: selectors.getPreChatFormState(state),
    queuePosition: selectors.getQueuePosition(state),
    editContactDetails: selectors.getEditContactDetails(state),
    menuVisible: selectors.getMenuVisible(state),
    agentJoined: selectors.getAgentJoined(state),
    connection: selectors.getConnection(state),
    loginSettings: selectors.getLoginSettings(state),
    departments: selectors.getDepartments(state),
    offlineMessage: selectors.getOfflineMessage(state),
    firstMessageTimestamp: selectors.getFirstMessageTimestamp(state)
  };
};

class Chat extends Component {
  static propTypes = {
    attachmentsEnabled: PropTypes.bool.isRequired,
    concierges: PropTypes.array.isRequired,
    chats: PropTypes.array.isRequired,
    events: PropTypes.array.isRequired,
    chatLog: PropTypes.object.isRequired,
    hasMoreHistory: PropTypes.bool,
    historyRequestStatus: PropTypes.string,
    chatHistoryLog: PropTypes.array,
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
    onBackButtonClick: PropTypes.func,
    getAccountSettings: PropTypes.func.isRequired,
    handleReconnect: PropTypes.func.isRequired,
    sendChatRating: PropTypes.func.isRequired,
    sendChatComment: PropTypes.func.isRequired,
    updateChatScreen: PropTypes.func.isRequired,
    isChatting: PropTypes.bool.isRequired,
    allAgents: PropTypes.object.isRequired,
    activeAgents: PropTypes.object.isRequired,
    agentsTyping: PropTypes.array.isRequired,
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
    updateFrameSize: PropTypes.func.isRequired,
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
    clearDepartment: PropTypes.func,
    fetchConversationHistory: PropTypes.func,
    hideZendeskLogo: PropTypes.bool,
    firstMessageTimestamp: PropTypes.number
  };

  static defaultProps = {
    attachmentsEnabled: false,
    isMobile: false,
    position: 'right',
    onBackButtonClick: () => {},
    getAccountSettings: () => {},
    concierges: [],
    rating: {},
    chats: [],
    events: [],
    agentsTyping: [],
    chatLog: {},
    hasMoreHistory: false,
    historyRequestStatus: '',
    chatHistoryLog: [],
    lastAgentLeaveEvent: {},
    preChatFormSettings: {},
    postChatFormSettings: {},
    handleSoundIconClick: () => {},
    userSoundSettings: true,
    ratingSettings: { enabled: false },
    allAgents: {},
    activeAgents: {},
    getFrameDimensions: () => {},
    sendEmailTranscript: () => {},
    emailTranscript: {},
    resetEmailTranscript: () => {},
    editContactDetails: {},
    updateChatBackButtonVisibility: () => {},
    updateMenuVisibility: () => {},
    updateFrameSize: () => {},
    menuVisible: false,
    agentJoined: false,
    connection: '',
    resetCurrentMessage: () => {},
    loginSettings: {},
    visitor: {},
    departments: {},
    offlineMessage: {},
    sendOfflineMessage: () => {},
    clearDepartment: () => {},
    fetchConversationHistory: () => {},
    hideZendeskLogo: false,
    firstMessageTimestamp: null
  };

  constructor(props) {
    super(props);

    this.state = {
      showEndChatMenu: false
    };

    this.scrollContainer = null;

    this.chatHistoryLog = null;
    this.chatHistoryLogLength = null;
    this.chatScrollPos = null;
    this.chatScrolledToBottom = true;

    this.updateFrameSizeTimer = null;
    this.scrollToBottomTimer = null;
  }

  componentDidMount() {
    const { screen, chats, events } = this.props;
    const hasMessages = (chats.length + events.length) > 0;

    if (screen === screens.CHATTING_SCREEN && hasMessages) {
      this.scrollToBottom();
    }

    this.props.updateChatBackButtonVisibility();
  }

  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.chats && !nextProps.events) return;

    this.props.updateChatBackButtonVisibility();
  }

  componentWillUpdate(nextProps) {
    if (
      this.props.screen === screens.CHATTING_SCREEN &&
      nextProps.screen === screens.CHATTING_SCREEN
    ) {
      if (this.chatHistoryLog) {
        this.chatHistoryLogLength = this.chatHistoryLog.getScrollHeight();
        this.updateChatScrollPos();
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.screen !== screens.CHATTING_SCREEN) return;

    if (
      prevProps.screen !== screens.CHATTING_SCREEN ||
      this.chatScrolledToBottom
    ) {
      this.scrollToBottom();
      return;
    }

    if (this.chatHistoryLog) {
      const chatHistoryLogLengthDiff = this.chatHistoryLog.getScrollHeight() - this.chatHistoryLogLength;

      if (chatHistoryLogLengthDiff !== 0) {
        this.scrollContainer.scrollTo(this.chatScrollPos + chatHistoryLogLengthDiff);
      }

      // TODO: For now, scrollToBottom on new messages.
      // Change this later when working on https://zendesk.atlassian.net/browse/CE-3067
      const newLogCount =
        (this.props.chats.length + this.props.events.length) -
        (prevProps.chats.length + prevProps.events.length);

      if (newLogCount > 0) {
        this.scrollToBottom();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.updateFrameSizeTimer);
    clearTimeout(this.scrollToBottomTimer);
  }

  updateChatScrollPos = () => {
    if (this.props.screen !== screens.CHATTING_SCREEN) return;

    this.chatScrollPos = this.scrollContainer.getScrollTop();
    this.chatScrolledToBottom = this.scrollContainer.isAtBottom();
  }

  toggleMenu = () => {
    this.props.updateMenuVisibility(!this.props.menuVisible);
  }

  scrollToBottom = () => {
    this.scrollToBottomTimer = setTimeout(() => {
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
      const successCallback = () => this.props.updateChatScreen(screens.OFFLINE_MESSAGE_SCREEN);
      const failureCallback = () => this.props.updateChatScreen(screens.PRECHAT_SCREEN);

      this.props.updateChatScreen(screens.LOADING_SCREEN);
      this.props.sendOfflineMessage(info, successCallback, failureCallback);
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
      concierges,
      agentJoined,
      ratingSettings,
      updateChatScreen,
      screen,
      activeAgents
    } = this.props;
    const showRating = screen === screens.CHATTING_SCREEN && ratingSettings.enabled && agentJoined;
    const onAgentDetailsClick = (screen === screens.CHATTING_SCREEN && _.size(activeAgents) > 0)
      ? () => updateChatScreen(screens.AGENT_LIST_SCREEN)
      : null;

    return (
      <ChatHeader
        showRating={showRating}
        rating={rating.value}
        updateRating={sendChatRating}
        concierges={concierges}
        onAgentDetailsClick={onAgentDetailsClick} />
    );
  }

  renderPrechatScreen = () => {
    if (this.props.screen !== screens.PRECHAT_SCREEN &&
        this.props.screen !== screens.OFFLINE_MESSAGE_SCREEN &&
        this.props.screen !== screens.LOADING_SCREEN) return;

    const { form, message } = this.props.prechatFormSettings;
    const scrollContainerClasses = classNames(
      styles.scrollContainer,
      { [styles.mobileContainer]: this.props.isMobile }
    );
    const logoFooterClasses = classNames({
      [styles.logoFooter]: !this.props.hideZendeskLogo
    });
    let formScreen = null;

    if (this.props.screen === screens.PRECHAT_SCREEN) {
      formScreen = (
        <ChatPrechatForm
          form={form}
          formState={this.props.preChatFormState}
          onPrechatFormChange={this.props.handlePreChatFormChange}
          loginEnabled={this.props.loginSettings.enabled}
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
    } else if (this.props.screen === screens.LOADING_SCREEN) {
      formScreen = <LoadingSpinner className={styles.loadingSpinner} />;
    }

    return (
      <ScrollContainer
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        classes={scrollContainerClasses}
        containerClasses={styles.scrollContainerContent}
        footerClasses={logoFooterClasses}
        footerContent={this.renderZendeskLogo()}
        fullscreen={this.props.isMobile}>
        {formScreen}
      </ScrollContainer>
    );
  }

  renderAgentTyping = (typingAgents = []) => {
    let typingNotification;

    switch (typingAgents.length) {
      case 0: return null;
      case 1:
        const agent = typingAgents[0].display_name;

        typingNotification = i18n.t('embeddable_framework.chat.chatLog.isTyping', { agent });
        break;
      case 2:
        const agent1 = typingAgents[0].display_name,
          agent2 = typingAgents[1].display_name;

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

  renderHistoryFetching = () => {
    const { historyRequestStatus } = this.props;
    const duration = 250;
    const defaultStyle = {
      transition: `opacity ${duration}ms ease-in-out`,
      opacity: 0,
    };
    const transitionStyles = {
      entering: { opacity: 0 },
      entered:  { opacity: 1 },
    };

    return this.props.historyRequestStatus ? (
      <div className={styles.historyFetchingContainer}>
        <Transition in={historyRequestStatus === 'pending'} timeout={duration + 300}>
          {(state) => (
            <div
              style={{...defaultStyle, ...transitionStyles[state]}}
              className={styles.historyFetchingText}>
              {i18n.t('embeddable_framework.chat.fetching_history')}
            </div>
          )}
        </Transition>
      </div>
    ) : null;
  }

  renderChatScreen = () => {
    const { screen, isMobile, sendMsg, loginSettings, visitor, hideZendeskLogo, agentsTyping } = this.props;

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
      {
        [styles.footerMobile]: isMobile,
        [styles.footerMobileWithLogo]: isMobile && !hideZendeskLogo
      }
    );
    const logoClasses = classNames(
      { [styles.zendeskLogoChatMobile]: isMobile }
    );

    const visitorNameSet = visitor.display_name && !chatNameDefault(visitor.display_name);
    const emailSet = !!visitor.email;

    return (
      <ScrollContainer
        ref={(el) => { this.scrollContainer = el; }}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        onContentScrolled={_.debounce(this.handleChatScreenScrolled, 100)}
        headerContent={this.renderChatHeader()}
        headerClasses={styles.header}
        containerClasses={containerClasses}
        footerClasses={footerClasses}
        footerContent={this.renderChatFooter()}
        fullscreen={isMobile}
        classes={scrollContainerClasses}>
        <div className={chatLogContainerClasses}>
          <ChatHistoryLog
            ref={(el) => { this.chatHistoryLog = el; }}
            chatHistoryLog={this.props.chatHistoryLog}
            showAvatar={this.props.showAvatar}
            agents={this.props.allAgents}
            firstMessageTimestamp={this.props.firstMessageTimestamp}
          />
          <ChatLog
            showAvatar={this.props.showAvatar}
            chatLog={this.props.chatLog}
            lastAgentLeaveEvent={this.props.lastAgentLeaveEvent}
            agents={this.props.allAgents}
            chatCommentLeft={!!this.props.rating.comment}
            goToFeedbackScreen={() => this.props.updateChatScreen(screens.FEEDBACK_SCREEN)}
            handleSendMsg={sendMsg}
            onImageLoad={this.scrollToBottom}
            showUpdateInfo={!!loginSettings.enabled && !(visitorNameSet || emailSet)}
            updateInfoOnClick={this.showContactDetailsFn}
          />
          {this.renderQueuePosition()}
          {this.renderAgentTyping(agentsTyping)}
          {
            (!isMobile || !agentsTyping.length)
              ? this.renderZendeskLogo(logoClasses)
              : null
          }
          {this.renderHistoryFetching()}
        </div>
      </ScrollContainer>
    );
  }

  handleChatScreenScrolled = () => {
    if (!this.scrollContainer) return;

    if (
      this.scrollContainer.isAtTop() &&
      this.props.hasMoreHistory &&
      this.props.historyRequestStatus !== 'pending'
    ) {
      this.props.fetchConversationHistory();
    }
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
    const { queuePosition, activeAgents } = this.props;

    if (!queuePosition || _.size(activeAgents) > 0) return null;

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
    const logoFooterClasses = classNames({
      [styles.logoFooter]: !this.props.hideZendeskLogo
    });
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
        footerClasses={logoFooterClasses}
        footerContent={this.renderZendeskLogo()}
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
    const { screen, activeAgents, updateChatScreen, isMobile, hideZendeskLogo } = this.props;

    if (screen !== screens.AGENT_LIST_SCREEN) return null;

    const scrollContainerClasses = classNames(
      styles.scrollContainer,
      { [styles.mobileContainer]: isMobile }
    );
    const backToChatClasses = classNames(
      styles.agentListBackButton,
      { [styles.agentListBackButtonWithLogo]: !hideZendeskLogo }
    );
    const backButtonOnClick = () => { updateChatScreen(screens.CHATTING_SCREEN); };
    const backToChatButton = (
      <Button
        fullscreen={isMobile}
        label={i18n.t('embeddable_framework.chat.agentList.button.backToChat')}
        onTouchStartDisabled={true}
        onClick={backButtonOnClick}
        className={backToChatClasses} />
    );

    return (
      <ScrollContainer
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        classes={scrollContainerClasses}
        containerClasses={styles.scrollContainerContent}
        footerContent={backToChatButton}
        fullscreen={isMobile}
      >
        <ChatAgentList agents={activeAgents} />
        {this.renderZendeskLogo()}
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

  renderZendeskLogo = (extraClasses = '') => {
    return !this.props.hideZendeskLogo ?
      <ZendeskLogo
        className={`${styles.zendeskLogo} ${extraClasses}`}
        rtl={i18n.isRTL()}
        fullscreen={false}
      /> : null;
  }

  render = () => {
    const containerStyle = classNames(
      styles.container,
      { [styles.mobileContainer]: this.props.isMobile }
    );

    this.updateFrameSizeTimer = setTimeout(() => this.props.updateFrameSize(), 0);

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
  clearDepartment,
  fetchConversationHistory
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Chat);
