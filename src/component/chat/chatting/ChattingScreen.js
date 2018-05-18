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
import { LoadingEllipses } from 'component/loading/LoadingEllipses';
import { ZendeskLogo } from 'component/ZendeskLogo';
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
import { locals as styles } from './ChattingScreen.scss';
import { isDefaultNickname } from 'src/util/chat';

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
    currentMessage: selectors.getCurrentMessage(state),
    screen: selectors.getChatScreen(state),
    concierges: selectors.getCurrentConcierges(state),
    isChatting: selectors.getIsChatting(state),
    allAgents: selectors.getAllAgents(state),
    activeAgents: selectors.getActiveAgents(state),
    agentsTyping: selectors.getAgentsTyping(state),
    rating: selectors.getChatRating(state),
    visitor: selectors.getChatVisitor(state),
    ratingSettings: selectors.getRatingSettings(state),
    showAvatar: selectors.getThemeShowAvatar(state),
    queuePosition: selectors.getQueuePosition(state),
    menuVisible: selectors.getMenuVisible(state),
    agentJoined: selectors.getAgentJoined(state),
    loginSettings: selectors.getLoginSettings(state),
    firstMessageTimestamp: selectors.getFirstMessageTimestamp(state)
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
    ratingSettings: PropTypes.object.isRequired,
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
    firstMessageTimestamp: PropTypes.number
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
    ratingSettings: { enabled: false },
    allAgents: {},
    activeAgents: {},
    menuVisible: false,
    agentJoined: false,
    resetCurrentMessage: () => {},
    loginSettings: {},
    visitor: {},
    fetchConversationHistory: () => {},
    hideZendeskLogo: false,
    firstMessageTimestamp: null
  };

  constructor(props) {
    super(props);

    this.scrollContainer = null;

    this.chatHistoryLog = null;
    this.chatScrollPos = null;
    this.chatScrolledToBottom = true;

    this.scrollToBottomTimer = null;

    this.scrollHeightAtFetch = null;
  }

  componentDidMount() {
    const { chats, events, chatHistoryLog } = this.props;
    const hasMessages = (chats.length + events.length + chatHistoryLog.length) > 0;

    if (hasMessages) {
      this.scrollToBottom();
    }
  }

  componentWillUpdate() {
    if (this.chatHistoryLog) {
      this.updateChatScrollPos();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.chatScrolledToBottom) {
      this.scrollToBottom();
      return;
    }

    if (this.scrollContainer) {
      const scrollContainerLengthDiff = this.scrollContainer.getScrollHeight() - this.scrollHeightAtFetch;

      if (scrollContainerLengthDiff !== 0) {
        this.scrollContainer.scrollTo(this.chatScrollPos + scrollContainerLengthDiff);
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
    clearTimeout(this.scrollToBottomTimer);
  }

  updateChatScrollPos = () => {
    this.chatScrollPos = this.scrollContainer.getScrollTop();
    this.chatScrolledToBottom = this.scrollContainer.isAtBottom();
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
      this.props.historyRequestStatus !== 'pending'
    ) {
      this.scrollHeightAtFetch = this.scrollContainer.getScrollHeight();
      this.props.fetchConversationHistory();
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
        <Transition in={historyRequestStatus === 'pending'} timeout={0}>
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
      ratingSettings,
      updateChatScreen,
      activeAgents
    } = this.props;
    const showRating = ratingSettings.enabled && agentJoined;
    const onAgentDetailsClick = _.size(activeAgents) > 0
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

  renderZendeskLogo = () => {
    const logoClasses = classNames(
      { [styles.zendeskLogoChatMobile]: this.props.isMobile }
    );

    return !this.props.hideZendeskLogo ?
      <ZendeskLogo
        className={`${styles.zendeskLogo} ${logoClasses}`}
        rtl={i18n.isRTL()}
        fullscreen={false}
      /> : null;
  }

  render = () => {
    const { isMobile, sendMsg, loginSettings, visitor, hideZendeskLogo, agentsTyping } = this.props;
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

    const visitorNameSet = visitor.display_name && !isDefaultNickname(visitor.display_name);
    const emailSet = !!visitor.email;

    return (
      <ScrollContainer
        ref={(el) => { this.scrollContainer = el; }}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        onContentScrolled={this.handleChatScreenScrolled}
        headerContent={this.renderChatHeader()}
        headerClasses={styles.header}
        containerClasses={containerClasses}
        footerClasses={footerClasses}
        footerContent={this.renderChatFooter()}
        fullscreen={isMobile}
        classes={scrollContainerClasses}>
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
            showUpdateInfo={!!loginSettings.enabled && !(visitorNameSet || emailSet)}
            updateInfoOnClick={this.showContactDetailsFn}
          />
          {this.renderQueuePosition()}
          {this.renderAgentTyping(agentsTyping)}
          {
            (!isMobile || !agentsTyping.length)
              ? this.renderZendeskLogo()
              : null
          }
          {this.renderHistoryFetching()}
        </div>
      </ScrollContainer>
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
