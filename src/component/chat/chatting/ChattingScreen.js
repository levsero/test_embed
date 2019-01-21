import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import Transition from 'react-transition-group/Transition';

import { ChatBox } from 'component/chat/chatting/ChatBox';
import { ChattingFooter } from 'component/chat/chatting/ChattingFooter';
import ChatLog from 'component/chat/chatting/ChatLog';
import HistoryLog from 'component/chat/chatting/HistoryLog';
import { ChatHeader } from 'component/chat/ChatHeader';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ButtonPill } from 'component/button/ButtonPill';
import { LoadingEllipses } from 'component/loading/LoadingEllipses';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { QuickReply, QuickReplies } from 'component/shared/QuickReplies';
import { i18n } from 'service/i18n';
import { isAgent } from 'utility/chat';
import { isFirefox, isIE } from 'utility/devices';
import {
  sendMsg,
  sendAttachments,
  handleChatBoxChange,
  sendChatRating,
  updateChatScreen,
  resetCurrentMessage,
  markAsRead,
  fetchConversationHistory } from 'src/redux/modules/chat';
import * as screens from 'src/redux/modules/chat/chat-screen-types';
import {
  getHistoryLength,
  getHasMoreHistory,
  getHistoryRequestStatus } from 'src/redux/modules/chat/chat-history-selectors';
import * as chatSelectors from 'src/redux/modules/chat/chat-selectors';
import {
  getProfileConfig,
  getChatTitle,
  getConciergeSettings,
  getCurrentConcierges,
  isInChattingScreen } from 'src/redux/modules/selectors';
import { SCROLL_BOTTOM_THRESHOLD, HISTORY_REQUEST_STATUS } from 'constants/chat';
import { locals as styles } from './ChattingScreen.scss';

const mapStateToProps = (state) => {
  return {
    attachmentsEnabled: chatSelectors.getAttachmentsEnabled(state),
    chatsLength: chatSelectors.getChatsLength(state),
    historyLength: getHistoryLength(state),
    hasMoreHistory: getHasMoreHistory(state),
    historyRequestStatus: getHistoryRequestStatus(state),
    lastMessageAuthor: chatSelectors.getLastMessageAuthor(state),
    latestQuickReply: chatSelectors.getLatestQuickReply(state),
    currentMessage: chatSelectors.getCurrentMessage(state),
    concierges: getCurrentConcierges(state),
    isChatting: chatSelectors.getIsChatting(state),
    allAgents: chatSelectors.getAllAgents(state),
    activeAgents: chatSelectors.getActiveAgents(state),
    agentsTyping: chatSelectors.getAgentsTyping(state),
    rating: chatSelectors.getChatRating(state),
    visitor: chatSelectors.getChatVisitor(state),
    luxon: chatSelectors.getLuxonVendor(state),
    showAvatar: chatSelectors.getThemeShowAvatar(state),
    queuePosition: chatSelectors.getQueuePosition(state),
    menuVisible: chatSelectors.getMenuVisible(state),
    agentJoined: chatSelectors.getAgentJoined(state),
    firstMessageTimestamp: chatSelectors.getFirstMessageTimestamp(state),
    socialLogin: chatSelectors.getSocialLogin(state),
    conciergeSettings: getConciergeSettings(state),
    title: getChatTitle(state),
    profileConfig: getProfileConfig(state),
    notificationCount: chatSelectors.getNotificationCount(state),
    visible: isInChattingScreen(state)
  };
};

class ChattingScreen extends Component {
  static propTypes = {
    attachmentsEnabled: PropTypes.bool.isRequired,
    concierges: PropTypes.array.isRequired,
    chatsLength: PropTypes.number,
    historyLength: PropTypes.number,
    hasMoreHistory: PropTypes.bool,
    historyRequestStatus: PropTypes.string,
    lastMessageAuthor: PropTypes.string.isRequired,
    latestQuickReply: PropTypes.object,
    currentMessage: PropTypes.string.isRequired,
    sendAttachments: PropTypes.func.isRequired,
    showChatEndFn: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    sendMsg: PropTypes.func.isRequired,
    handleChatBoxChange: PropTypes.func.isRequired,
    sendChatRating: PropTypes.func.isRequired,
    updateChatScreen: PropTypes.func.isRequired,
    isChatting: PropTypes.bool.isRequired,
    allAgents: PropTypes.object.isRequired,
    luxon: PropTypes.object.isRequired,
    activeAgents: PropTypes.object.isRequired,
    agentsTyping: PropTypes.array.isRequired,
    rating: PropTypes.object.isRequired,
    toggleMenu: PropTypes.func.isRequired,
    showAvatar: PropTypes.bool.isRequired,
    queuePosition: PropTypes.number,
    menuVisible: PropTypes.bool,
    agentJoined: PropTypes.bool,
    resetCurrentMessage: PropTypes.func,
    fetchConversationHistory: PropTypes.func,
    hideZendeskLogo: PropTypes.bool,
    chatId: PropTypes.string,
    firstMessageTimestamp: PropTypes.number,
    socialLogin: PropTypes.object,
    conciergeSettings: PropTypes.object.isRequired,
    showContactDetails: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    profileConfig: PropTypes.object.isRequired,
    notificationCount: PropTypes.number,
    markAsRead: PropTypes.func,
    visible: PropTypes.bool,
    fullscreen: PropTypes.bool
  };

  static defaultProps = {
    attachmentsEnabled: false,
    isMobile: false,
    fullscreen: false,
    concierges: [],
    chatsLength: 0,
    historyLength: 0,
    rating: {},
    agentsTyping: [],
    chatLog: {},
    hasMoreHistory: false,
    historyRequestStatus: '',
    allAgents: {},
    activeAgents: {},
    menuVisible: false,
    agentJoined: false,
    resetCurrentMessage: () => {},
    fetchConversationHistory: () => {},
    hideZendeskLogo: false,
    chatId: '',
    firstMessageTimestamp: null,
    socialLogin: {},
    conciergeSettings: {},
    showContactDetails: () => {},
    profileConfig: {},
    notificationCount: 0,
    markAsRead: () => {},
    visible: false
  };

  constructor(props) {
    super(props);

    this.scrollContainer = null;
    this.scrollHeightBeforeUpdate = null;
    this.scrollToBottomTimer = null;
  }

  componentDidMount() {
    const { chatsLength, historyLength } = this.props;
    const hasMessages = (chatsLength + historyLength) > 0;

    if (hasMessages) {
      this.scrollToBottom();
    }
  }

  componentWillUpdate(prevProps) {
    if (prevProps.historyRequestStatus === HISTORY_REQUEST_STATUS.PENDING &&
        this.props.historyRequestStatus === HISTORY_REQUEST_STATUS.DONE) {
      this.scrollHeightBeforeUpdate = this.scrollContainer.getScrollHeight();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.scrollContainer) {
      this.didUpdateFetchHistory();
      this.didUpdateNewEntry(prevProps);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.scrollToBottomTimer);
  }

  didUpdateFetchHistory = () => {
    if (!this.scrollHeightBeforeUpdate) return;

    const scrollTop = this.scrollContainer.getScrollTop();
    const scrollHeight = this.scrollContainer.getScrollHeight();
    const lengthDifference = scrollHeight - this.scrollHeightBeforeUpdate;

    // When chat history is fetched, we record the scroll just before
    // the component updates in order to adjust the  scrollTop
    // by the difference in container height of pre and post update.
    if (lengthDifference !== 0) {
      this.scrollContainer.scrollTo(scrollTop + lengthDifference);
      this.scrollHeightBeforeUpdate = null;
    }
  }

  didUpdateNewEntry = (prevProps) => {
    const newMessage = (this.props.chatsLength - prevProps.chatsLength) > 0;
    const lastUserMessage = this.props.lastMessageAuthor;
    const scrollCloseToBottom = this.isScrollCloseToBottom();

    if (
      this.props.visible && scrollCloseToBottom &&
      (newMessage && isAgent(lastUserMessage) || !prevProps.visible)
    ) {
      this.props.markAsRead();
    }

    if ((newMessage && (scrollCloseToBottom || lastUserMessage === 'visitor'))) {
      this.scrollToBottom();
    }
  }

  isScrollCloseToBottom = () => {
    return (this.scrollContainer)
      ? this.scrollContainer.getScrollBottom() < SCROLL_BOTTOM_THRESHOLD
      : false;
  }

  scrollToBottom = () => {
    this.scrollToBottomTimer = setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.scrollToBottom();
      }
    }, 0);
  }

  handleChatScreenScrolled = () => {
    if (!this.scrollContainer) return;

    if (
      this.scrollContainer.isAtTop() &&
      this.props.hasMoreHistory &&
      this.props.historyRequestStatus !== HISTORY_REQUEST_STATUS.PENDING
    ) {
      this.props.fetchConversationHistory();
    }

    if (this.props.visible && this.isScrollCloseToBottom()) {
      this.props.markAsRead();
    }
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

  renderAgentTyping = (typingAgents = []) => {
    let typingNotification;
    const agentTypingStyles = (this.props.isMobile)
      ? styles.agentTypingMobile
      : styles.agentTyping;
    const noAgentTypingStyles = (this.props.isMobile)
      ? styles.noAgentTypingMobile
      : styles.noAgentTyping;

    switch (typingAgents.length) {
      case 0: return <div className={noAgentTypingStyles} />;
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
      <div className={agentTypingStyles}>
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
    const duration = 300;
    const defaultStyle = {
      transition: `opacity ${duration}ms ease-in-out`,
      opacity: 0,
    };
    const transitionStyles = {
      entering: { opacity: 0.9 },
      entered:  { opacity: 1 },
    };

    return this.props.historyRequestStatus ? (
      <div className={styles.historyFetchingContainer}>
        <Transition in={historyRequestStatus === HISTORY_REQUEST_STATUS.PENDING} timeout={0}>
          {(state) => (
            <div
              style={{ ...defaultStyle, ...transitionStyles[state] }}
              className={styles.historyFetchingText}>
              {i18n.t('embeddable_framework.chat.fetching_history')}
            </div>
          )}
        </Transition>
      </div>
    ) : null;
  }

  renderChatFooter = () => {
    const { currentMessage, sendMsg, resetCurrentMessage, handleChatBoxChange, isMobile, menuVisible } = this.props;

    const sendChatFn = () => {
      if (_.isEmpty(currentMessage)) return;
      sendMsg(currentMessage);
      resetCurrentMessage();
    };

    return (
      <ChattingFooter
        attachmentsEnabled={this.props.attachmentsEnabled}
        isMobile={isMobile}
        endChat={this.props.showChatEndFn}
        sendChat={sendChatFn}
        isChatting={this.props.isChatting}
        handleAttachmentDrop={this.props.sendAttachments}
        menuVisible={menuVisible}
        toggleMenu={this.props.toggleMenu}>
        <ChatBox
          isMobile={isMobile}
          currentMessage={currentMessage}
          sendChat={sendChatFn}
          handleChatBoxChange={handleChatBoxChange} />
      </ChattingFooter>
    );
  }

  renderChatHeader = () => {
    const {
      rating,
      sendChatRating,
      concierges,
      agentJoined,
      updateChatScreen,
      activeAgents,
      profileConfig
    } = this.props;
    const showRating = profileConfig.rating && agentJoined;
    const onAgentDetailsClick = _.size(activeAgents) > 0
      ? () => updateChatScreen(screens.AGENT_LIST_SCREEN)
      : null;

    return (
      <ChatHeader
        showRating={showRating}
        showTitle={profileConfig.title}
        showAvatar={profileConfig.avatar}
        rating={rating.value}
        updateRating={sendChatRating}
        concierges={concierges}
        onAgentDetailsClick={onAgentDetailsClick} />
    );
  }

  renderZendeskLogo = () => {
    const logoClasses = classNames(
      { [styles.zendeskLogoChatMobile]: this.props.isMobile }
    );

    return !this.props.hideZendeskLogo ?
      <ZendeskLogo
        className={`${styles.zendeskLogo} ${logoClasses}`}
        fullscreen={false}
        chatId={this.props.chatId}
        logoLink='chat'
      /> : null;
  }

  renderScrollPill = () => {
    if (this.props.notificationCount === 0) return null;
    if (this.isScrollCloseToBottom()) return null;

    const { notificationCount } = this.props;
    const containerStyles = (this.props.isMobile) ? styles.scrollBottomPillMobile : styles.scrollBottomPill;
    const goToBottomFn = () => {
      this.scrollToBottom();
      this.props.markAsRead();
    };

    const pillLabel = (notificationCount > 1)
      ? i18n.t('embeddable_framework.common.notification.manyMessages', { plural_number: notificationCount })
      : i18n.t('embeddable_framework.common.notification.oneMessage');

    return (
      <ButtonPill
        showIcon={true}
        containerClass={containerStyles}
        onClick={goToBottomFn}
        label={pillLabel} />
    );
  }

  /**
   * Render QuickReplies component if one should be shown
   */
  renderQuickReply = () => {
    const quickReply = this.props.latestQuickReply;

    if (!quickReply) return null;

    const { timestamp, items } = quickReply;

    return (
      <QuickReplies key={timestamp} isMobile={this.props.isMobile}>
        {items.map((item, idx) => {
          const { action, text } = item;
          const actionFn = () => this.props.sendMsg(action.value);

          return <QuickReply key={idx} label={text} onClick={actionFn} />;
        })}
      </QuickReplies>
    );
  }

  render = () => {
    const { isMobile,
      sendMsg,
      hideZendeskLogo,
      agentsTyping,
      profileConfig,
      agentJoined,
      fullscreen } = this.props;
    const containerClasses = classNames({
      [styles.headerMargin]: profileConfig.avatar || profileConfig.title || (profileConfig.rating && agentJoined),
      [styles.scrollContainerMessagesContent]: isMobile,
      [styles.scrollContainerMessagesContentDesktop]: !isMobile,
      [styles.scrollContainerMobile]: isMobile,
      [styles.scrollBarFix]: isFirefox() || isIE()
    });
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

    return (
      <div>
        <ScrollContainer
          ref={(el) => { this.scrollContainer = el; }}
          title={this.props.title}
          onContentScrolled={this.handleChatScreenScrolled}
          headerContent={this.renderChatHeader()}
          headerClasses={styles.header}
          containerClasses={containerClasses}
          footerClasses={footerClasses}
          footerContent={this.renderChatFooter()}
          fullscreen={fullscreen}
          isMobile={isMobile}>
          <div className={chatLogContainerClasses}>
            <HistoryLog
              isMobile={this.props.isMobile}
              showAvatar={this.props.showAvatar}
              agents={this.props.allAgents}
              luxon={this.props.luxon}
              firstMessageTimestamp={this.props.firstMessageTimestamp}
            />
            <ChatLog
              isMobile={this.props.isMobile}
              showAvatar={this.props.showAvatar}
              agents={this.props.allAgents}
              chatCommentLeft={!!this.props.rating.comment}
              goToFeedbackScreen={() => this.props.updateChatScreen(screens.FEEDBACK_SCREEN)}
              handleSendMsg={sendMsg}
              onImageLoad={this.scrollToBottom}
              conciergeAvatar={this.props.conciergeSettings.avatar_path}
              updateInfoOnClick={this.props.showContactDetails}
              socialLogin={this.props.socialLogin}
            />
            {this.renderQueuePosition()}
            {this.renderAgentTyping(agentsTyping)}
            {this.renderHistoryFetching()}
            {this.renderScrollPill()}
          </div>
          {this.renderQuickReply()}

        </ScrollContainer>
        {this.renderZendeskLogo()}
      </div>
    );
  }
}

const actionCreators = {
  updateChatScreen,
  fetchConversationHistory,
  sendMsg,
  resetCurrentMessage,
  handleChatBoxChange,
  sendAttachments,
  sendChatRating,
  markAsRead
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(ChattingScreen);
