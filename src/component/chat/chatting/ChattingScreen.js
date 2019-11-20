import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import classNames from 'classnames'
import { ChatBox } from 'component/chat/chatting/ChatBox'
import { ChattingFooter } from 'component/chat/chatting/ChattingFooter'
import ChatLog from 'component/chat/chatting/ChatLog'
import HistoryLog from 'component/chat/chatting/HistoryLog'
import { ChatHeader } from 'component/chat/ChatHeader'
import getScrollBottom from 'utility/get-scroll-bottom'
import { ButtonPill } from 'component/button/ButtonPill'
import { QuickReply, QuickReplies } from 'component/shared/QuickReplies'
import { AgentTyping } from 'src/embeds/chat/online/components/AgentTyping'
import { i18n } from 'service/i18n'
import { isAgent } from 'utility/chat'
import { isFirefox, isIE } from 'utility/devices'
import {
  sendMsg,
  sendAttachments,
  handleChatBoxChange,
  sendChatRating,
  updateChatScreen,
  resetCurrentMessage,
  markAsRead,
  fetchConversationHistory
} from 'src/redux/modules/chat'
import * as screens from 'src/redux/modules/chat/chat-screen-types'
import {
  getHistoryLength,
  getHasMoreHistory,
  getHistoryRequestStatus
} from 'src/redux/modules/chat/chat-history-selectors'
import * as chatSelectors from 'src/redux/modules/chat/chat-selectors'
import {
  getProfileConfig,
  getConciergeSettings,
  getCurrentConcierges,
  isInChattingScreen,
  getShowRatingButtons
} from 'src/redux/modules/selectors'
import { SCROLL_BOTTOM_THRESHOLD, HISTORY_REQUEST_STATUS } from 'constants/chat'
import { locals as styles } from './ChattingScreen.scss'
import { onNextTick } from 'src/util/utils'
import ChatWidgetHeader from 'embeds/chat/components/ChatWidgetHeader'
import { Widget, Main } from 'components/Widget'
import LoadingMessagesIndicator from 'embeds/chat/components/LoadingMessagesIndicator'

const mapStateToProps = state => {
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
    showAvatar: chatSelectors.getThemeShowAvatar(state),
    queuePosition: chatSelectors.getQueuePosition(state),
    menuVisible: chatSelectors.getMenuVisible(state),
    showRating: getShowRatingButtons(state),
    firstMessageTimestamp: chatSelectors.getFirstMessageTimestamp(state),
    socialLogin: chatSelectors.getSocialLogin(state),
    conciergeSettings: getConciergeSettings(state),
    profileConfig: getProfileConfig(state),
    notificationCount: chatSelectors.getNotificationCount(state),
    visible: isInChattingScreen(state),
    unreadMessages: chatSelectors.hasUnseenAgentMessage(state)
  }
}

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
    activeAgents: PropTypes.object.isRequired,
    agentsTyping: PropTypes.array.isRequired,
    rating: PropTypes.object.isRequired,
    toggleMenu: PropTypes.func.isRequired,
    showAvatar: PropTypes.bool.isRequired,
    queuePosition: PropTypes.number,
    menuVisible: PropTypes.bool,
    showRating: PropTypes.bool,
    resetCurrentMessage: PropTypes.func,
    fetchConversationHistory: PropTypes.func,
    hideZendeskLogo: PropTypes.bool,
    firstMessageTimestamp: PropTypes.number,
    socialLogin: PropTypes.object,
    conciergeSettings: PropTypes.object.isRequired,
    showContactDetails: PropTypes.func.isRequired,
    profileConfig: PropTypes.object.isRequired,
    notificationCount: PropTypes.number,
    markAsRead: PropTypes.func,
    visible: PropTypes.bool,
    unreadMessages: PropTypes.bool,
    isPreview: PropTypes.bool
  }

  static defaultProps = {
    attachmentsEnabled: false,
    isMobile: false,
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
    resetCurrentMessage: () => {},
    fetchConversationHistory: () => {},
    hideZendeskLogo: false,
    firstMessageTimestamp: null,
    socialLogin: {},
    conciergeSettings: {},
    showContactDetails: () => {},
    profileConfig: {},
    notificationCount: 0,
    markAsRead: () => {},
    visible: false,
    isPreview: false
  }

  constructor(props) {
    super(props)

    this.scrollContainer = null
    this.scrollHeightBeforeUpdate = null
    this.scrollToBottomTimer = null
  }

  componentDidMount() {
    const { chatsLength, historyLength } = this.props
    const hasMessages = chatsLength + historyLength > 0

    if (hasMessages) {
      this.scrollToBottom()
    }

    if (this.props.unreadMessages && this.props.visible && this.isScrollCloseToBottom()) {
      this.props.markAsRead()
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.historyRequestStatus === HISTORY_REQUEST_STATUS.PENDING &&
      this.props.historyRequestStatus === HISTORY_REQUEST_STATUS.DONE
    ) {
      this.scrollHeightBeforeUpdate = this.scrollContainer.scrollHeight
    }

    if (this.scrollContainer) {
      this.didUpdateFetchHistory()
      this.didUpdateNewEntry(prevProps)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.scrollToBottomTimer)
  }

  didUpdateFetchHistory = () => {
    if (!this.scrollHeightBeforeUpdate) return

    const scrollTop = this.scrollContainer.scrollTop
    const scrollHeight = this.scrollContainer.scrollHeight
    const lengthDifference = scrollHeight - this.scrollHeightBeforeUpdate

    // When chat history is fetched, we record the scroll just before
    // the component updates in order to adjust the  scrollTop
    // by the difference in container height of pre and post update.
    if (lengthDifference !== 0) {
      this.scrollContainer.scrollTop = scrollTop + lengthDifference
      this.scrollHeightBeforeUpdate = null
    }
  }

  didUpdateNewEntry = prevProps => {
    const newMessage = this.props.chatsLength - prevProps.chatsLength > 0
    const lastUserMessage = this.props.lastMessageAuthor
    const scrollCloseToBottom = this.isScrollCloseToBottom()

    if (
      this.props.visible &&
      scrollCloseToBottom &&
      ((newMessage && isAgent(lastUserMessage)) || !prevProps.visible)
    ) {
      this.props.markAsRead()
    }

    if (newMessage && (scrollCloseToBottom || lastUserMessage === 'visitor')) {
      this.scrollToBottom()
    }
  }

  isScrollCloseToBottom = () => {
    return this.scrollContainer
      ? getScrollBottom(this.scrollContainer) < SCROLL_BOTTOM_THRESHOLD
      : false
  }

  scrollToBottom = () => {
    this.scrollToBottomTimer = onNextTick(() => {
      if (this.scrollContainer) {
        this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
      }
    })
  }

  handleChatScreenScrolled = () => {
    if (!this.scrollContainer) return

    if (
      this.scrollContainer.scrollTop === 0 &&
      this.props.hasMoreHistory &&
      this.props.historyRequestStatus !== HISTORY_REQUEST_STATUS.PENDING
    ) {
      this.props.fetchConversationHistory()
    }

    if (this.props.visible && this.isScrollCloseToBottom()) {
      this.props.markAsRead()
    }
  }

  renderQueuePosition = () => {
    const { queuePosition, activeAgents } = this.props

    if (!queuePosition || _.size(activeAgents) > 0) return null

    return (
      <div className={styles.queuePosition} role="status" aria-live="polite">
        {i18n.t('embeddable_framework.chat.chatLog.queuePosition', {
          value: queuePosition
        })}
      </div>
    )
  }

  renderChatFooter = () => {
    const {
      currentMessage,
      sendMsg,
      resetCurrentMessage,
      handleChatBoxChange,
      isMobile,
      menuVisible
    } = this.props

    const sendChatFn = () => {
      if (!_.isEmpty(currentMessage.trim())) {
        sendMsg(currentMessage)
      }

      resetCurrentMessage()
    }

    return (
      <ChattingFooter
        attachmentsEnabled={this.props.attachmentsEnabled}
        isMobile={isMobile}
        endChat={this.props.showChatEndFn}
        sendChat={sendChatFn}
        isChatting={this.props.isChatting}
        handleAttachmentDrop={this.props.sendAttachments}
        menuVisible={menuVisible}
        toggleMenu={this.props.toggleMenu}
        hideZendeskLogo={this.props.hideZendeskLogo}
        isPreview={this.props.isPreview}
      >
        <ChatBox
          isMobile={isMobile}
          currentMessage={currentMessage}
          sendChat={sendChatFn}
          handleChatBoxChange={handleChatBoxChange}
        />
      </ChattingFooter>
    )
  }

  renderChatHeader = () => {
    const {
      rating,
      sendChatRating,
      concierges,
      updateChatScreen,
      activeAgents,
      profileConfig,
      showRating
    } = this.props
    const onAgentDetailsClick =
      _.size(activeAgents) > 0 ? () => updateChatScreen(screens.AGENT_LIST_SCREEN) : null

    return (
      <ChatHeader
        agentsActive={Object.keys(activeAgents).length > 0}
        showRating={showRating}
        showTitle={profileConfig.title}
        showAvatar={profileConfig.avatar}
        rating={rating.value}
        updateRating={sendChatRating}
        concierges={concierges}
        onAgentDetailsClick={onAgentDetailsClick}
      />
    )
  }

  renderScrollPill = () => {
    if (this.props.notificationCount === 0) return null
    if (this.isScrollCloseToBottom()) return null

    const { notificationCount } = this.props
    const containerStyles = this.props.isMobile
      ? styles.scrollBottomPillMobile
      : styles.scrollBottomPill
    const goToBottomFn = () => {
      this.scrollToBottom()
      this.props.markAsRead()
    }

    const pillLabel =
      notificationCount > 1
        ? i18n.t('embeddable_framework.common.notification.manyMessages', {
            plural_number: notificationCount
          })
        : i18n.t('embeddable_framework.common.notification.oneMessage')

    return (
      <ButtonPill
        showIcon={true}
        containerClass={containerStyles}
        onClick={goToBottomFn}
        label={pillLabel}
      />
    )
  }

  /**
   * Render QuickReplies component if one should be shown
   */
  renderQuickReply = () => {
    const quickReply = this.props.latestQuickReply

    if (!quickReply) return null

    const { timestamp, items } = quickReply

    return (
      <QuickReplies key={timestamp} isMobile={this.props.isMobile}>
        {items.map((item, idx) => {
          const { action, text } = item
          const actionFn = () => this.props.sendMsg(action.value)

          return <QuickReply key={idx} label={text} onClick={actionFn} />
        })}
      </QuickReplies>
    )
  }

  goToFeedbackScreen = () => {
    this.props.updateChatScreen(screens.FEEDBACK_SCREEN)
  }

  render = () => {
    const { isMobile, sendMsg, agentsTyping } = this.props
    const chatLogContainerClasses = classNames(styles.chatLogContainer, {
      [styles.chatLogContainerMobile]: isMobile
    })

    return (
      <Widget>
        <ChatWidgetHeader />
        {this.renderChatHeader()}
        <Main
          ref={el => {
            this.scrollContainer = el
          }}
          onScroll={this.handleChatScreenScrolled}
          className={classNames({
            [styles.scrollBarFix]: isFirefox() || isIE()
          })}
        >
          <div className={chatLogContainerClasses}>
            <HistoryLog
              isMobile={this.props.isMobile}
              showAvatar={this.props.showAvatar}
              agents={this.props.allAgents}
              firstMessageTimestamp={this.props.firstMessageTimestamp}
            />
            <ChatLog
              isMobile={this.props.isMobile}
              showAvatar={this.props.showAvatar}
              agents={this.props.allAgents}
              chatRating={this.props.rating}
              goToFeedbackScreen={this.goToFeedbackScreen}
              handleSendMsg={sendMsg}
              onImageLoad={this.scrollToBottom}
              conciergeAvatar={this.props.conciergeSettings.avatar_path}
              updateInfoOnClick={this.props.showContactDetails}
              socialLogin={this.props.socialLogin}
            />
            {this.renderQueuePosition()}
            <AgentTyping agentsTyping={agentsTyping} />
            <LoadingMessagesIndicator loading={this.props.historyRequestStatus === 'pending'} />
            {this.renderScrollPill()}
          </div>
          {this.renderQuickReply()}
        </Main>
        {this.renderChatFooter()}
      </Widget>
    )
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
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(ChattingScreen)

export { connectedComponent as default, ChattingScreen as Component }
