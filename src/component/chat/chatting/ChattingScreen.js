import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import Transition from 'react-transition-group/Transition';

import { ChatBox } from 'component/chat/chatting/ChatBox';
import { ChattingFooter } from 'component/chat/chatting/ChattingFooter';
import { ChatLog } from 'component/chat/chatting/ChatLog';
import { HistoryLog } from 'component/chat/chatting/HistoryLog';
import { ChatHeader } from 'component/chat/ChatHeader';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ButtonPill } from 'component/button/ButtonPill';
import { LoadingEllipses } from 'component/loading/LoadingEllipses';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { QuickReply, QuickReplies } from 'component/shared/QuickReplies';
import { i18n } from 'service/i18n';
import { isFirefox, isIE } from 'utility/devices';
import {
  sendMsg,
  sendAttachments,
  handleChatBoxChange,
  sendChatRating,
  updateChatScreen,
  resetCurrentMessage,
  fetchConversationHistory } from 'src/redux/modules/chat';
import * as screens from 'src/redux/modules/chat/chat-screen-types';
import * as selectors from 'src/redux/modules/chat/chat-selectors';
import { getHasMoreHistory,
  getHistoryRequestStatus,
  getGroupedPastChatsBySession } from 'src/redux/modules/chat/chat-history-selectors';
import { SCROLL_BOTTOM_THRESHOLD, HISTORY_REQUEST_STATUS } from 'constants/chat';
import { locals as styles } from './ChattingScreen.scss';
import { isDefaultNickname, isAgent } from 'src/util/chat';

const mapStateToProps = (state) => {
  return {
    attachmentsEnabled: selectors.getAttachmentsEnabled(state),
    chats: selectors.getChatMessages(state),
    events: selectors.getChatEvents(state),
    chatLog: selectors.getGroupedChatLog(state),
    hasMoreHistory: getHasMoreHistory(state),
    historyRequestStatus: getHistoryRequestStatus(state),
    chatHistoryLog: getGroupedPastChatsBySession(state),
    lastAgentLeaveEvent: selectors.getLastAgentLeaveEvent(state),
    getQuickRepliesFromChatLog: selectors.getQuickRepliesFromChatLog(state),
    currentMessage: selectors.getCurrentMessage(state),
    screen: selectors.getChatScreen(state),
    concierges: selectors.getCurrentConcierges(state),
    isChatting: selectors.getIsChatting(state),
    allAgents: selectors.getAllAgents(state),
    activeAgents: selectors.getActiveAgents(state),
    agentsTyping: selectors.getAgentsTyping(state),
    rating: selectors.getChatRating(state),
    visitor: selectors.getChatVisitor(state),
    showAvatar: selectors.getThemeShowAvatar(state),
    queuePosition: selectors.getQueuePosition(state),
    menuVisible: selectors.getMenuVisible(state),
    agentJoined: selectors.getAgentJoined(state),
    loginSettings: selectors.getLoginSettings(state),
    firstMessageTimestamp: selectors.getFirstMessageTimestamp(state),
    socialLogin: selectors.getSocialLogin(state),
    conciergeSettings: selectors.getConciergeSettings(state),
    title: selectors.getChatTitle(state),
    profileConfig: selectors.getProfileConfig(state)
  };
};

class ChattingScreen extends Component {
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
    getQuickRepliesFromChatLog: PropTypes.object,
    currentMessage: PropTypes.string.isRequired,
    screen: PropTypes.string.isRequired,
    sendAttachments: PropTypes.func.isRequired,
    showChatEndFn: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    sendMsg: PropTypes.func.isRequired,
    handleChatBoxChange: PropTypes.func.isRequired,
    sendChatRating: PropTypes.func.isRequired,
    updateChatScreen: PropTypes.func.isRequired,
    isChatting: PropTypes.bool.isRequired,
    allAgents: PropTypes.object.isRequired,
    activeAgents: PropTypes.object.isRequired,
    agentsTyping: PropTypes.array.isRequired,
    visitor: PropTypes.object.isRequired,
    rating: PropTypes.object.isRequired,
    toggleMenu: PropTypes.func.isRequired,
    showAvatar: PropTypes.bool.isRequired,
    handlePreChatFormChange: PropTypes.func,
    queuePosition: PropTypes.number,
    menuVisible: PropTypes.bool,
    agentJoined: PropTypes.bool,
    resetCurrentMessage: PropTypes.func,
    loginSettings: PropTypes.object.isRequired,
    fetchConversationHistory: PropTypes.func,
    hideZendeskLogo: PropTypes.bool,
    firstMessageTimestamp: PropTypes.number,
    socialLogin: PropTypes.object,
    conciergeSettings: PropTypes.object.isRequired,
    showContactDetails: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    profileConfig: PropTypes.object.isRequired
  };

  static defaultProps = {
    attachmentsEnabled: false,
    isMobile: false,
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
    allAgents: {},
    activeAgents: {},
    menuVisible: false,
    agentJoined: false,
    resetCurrentMessage: () => {},
    loginSettings: {},
    visitor: {},
    fetchConversationHistory: () => {},
    hideZendeskLogo: false,
    firstMessageTimestamp: null,
    socialLogin: {},
    conciergeSettings: {},
    showContactDetails: () => {},
    profileConfig: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      notificationCount: 0
    };

    this.chatHistoryLog = null;

    this.scrollContainer = null;
    this.scrollHeightBeforeUpdate = null;
    this.scrollToBottomTimer = null;
  }

  componentDidMount() {
    const { chats, events, chatHistoryLog } = this.props;
    const hasMessages = (chats.length + events.length + chatHistoryLog.length) > 0;

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
    const newMessage = ((this.props.chats.length) - (prevProps.chats.length)) > 0;
    const newEvent = ((this.props.events.length) - (prevProps.events.length)) > 0;
    const lastUserMessage = _.get(_.last(this.props.chats), 'nick');
    const scrollCloseToBottom = this.isScrollCloseToBottom();

    if (newMessage && isAgent(lastUserMessage)) {
      (scrollCloseToBottom)
        ? this.setState({ notificationCount: 0 })
        : this.setState({ notificationCount: this.state.notificationCount + 1 });
    }

    if ((newMessage && (scrollCloseToBottom || lastUserMessage === 'visitor')) ||
        (newEvent && scrollCloseToBottom)) {
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

    if (this.isScrollCloseToBottom()) {
      this.setState({ notificationCount: 0 });
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
              style={{...defaultStyle, ...transitionStyles[state]}}
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
        rtl={i18n.isRTL()}
        fullscreen={false}
        utm='webwidgetchat'
      /> : null;
  }

  renderScrollPill = () => {
    if (this.state.notificationCount === 0) return null;

    const { notificationCount } = this.state;
    const containerStyles = (this.props.isMobile) ? styles.scrollBottomPillMobile : styles.scrollBottomPill;
    const goToBottomFn = () => {
      this.scrollToBottom();
      this.setState({ notificationCount: 0 });
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
   * Render QuickReplies component if `getQuickRepliesFromChatLog` returns a chat log
   */
  renderQuickReply = () => {
    const quickReply = this.props.getQuickRepliesFromChatLog;

    if (!quickReply) return null;

    const {timestamp, items} = quickReply;

    return (
      <QuickReplies key={timestamp} isMobile={this.props.isMobile}>
        {items.map((item, idx) => {
          const {action, text} = item;
          const actionFn = () => this.props.sendMsg(action.value);

          return <QuickReply key={idx} label={text} onClick={actionFn} />;
        })}
      </QuickReplies>
    );
  }

  render = () => {
    const { isMobile, sendMsg, loginSettings, visitor, hideZendeskLogo, agentsTyping } = this.props;
    const containerClasses = classNames({
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

    const visitorNameSet = visitor.display_name && !isDefaultNickname(visitor.display_name);
    const emailSet = !!visitor.email;

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
          fullscreen={isMobile}>
          <div className={chatLogContainerClasses}>
            <HistoryLog
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
              conciergeAvatar={this.props.conciergeSettings.avatar_path}
              showUpdateInfo={!!loginSettings.enabled && !(visitorNameSet || emailSet)}
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
  sendChatRating
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(ChattingScreen);
