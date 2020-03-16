import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import classNames from 'classnames'
import ChatBox from 'src/embeds/chat/components/InputBox'
import { ChattingFooter } from 'component/chat/chatting/ChattingFooter'
import ChatLog from 'component/chat/chatting/ChatLog'
import HistoryLog from 'component/chat/chatting/HistoryLog'
import ChatHeader from 'embeds/chat/components/ChatHeader'
import getScrollBottom from 'utility/get-scroll-bottom'
import ScrollPill from 'src/embeds/chat/components/ScrollPill'
import { QuickReply, QuickReplies } from 'component/shared/QuickReplies'
import ChatLogFooter from 'src/embeds/chat/components/ChatLogFooter'
import { isAgent } from 'utility/chat'
import {
  sendMsg,
  sendAttachments,
  handleChatBoxChange,
  sendChatRating,
  updateChatScreen,
  resetCurrentMessage,
  markAsRead,
  fetchConversationHistory,
  updateEmailTranscriptVisibility
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
import QueuePosition from 'src/embeds/chat/components/QueuePosition'
import { getMenuVisible } from 'embeds/chat/selectors'
import EmailTranscriptPopup from 'embeds/chat/components/EmailTranscriptPopup'

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
    menuVisible: getMenuVisible(state),
    showRating: getShowRatingButtons(state),
    firstMessageTimestamp: chatSelectors.getFirstMessageTimestamp(state),
    socialLogin: chatSelectors.getSocialLogin(state),
    conciergeSettings: getConciergeSettings(state),
    profileConfig: getProfileConfig(state),
    notificationCount: chatSelectors.getNotificationCount(state),
    visible: isInChattingScreen(state),
    unreadMessages: chatSelectors.hasUnseenAgentMessage(state),
    emailTranscript: chatSelectors.getEmailTranscript(state)
  }
}

const ChattingScreen = ({
  lastMessageAuthor,
  latestQuickReply,
  currentMessage,
  sendAttachments,
  showChatEndFn,
  sendMsg,
  handleChatBoxChange,
  sendChatRating,
  updateChatScreen,
  isChatting,
  toggleMenu,
  showAvatar,
  queuePosition,
  showRating,
  unreadMessages,
  attachmentsEnabled = false,
  isMobile = false,
  concierges = [],
  chatsLength = 0,
  historyLength = 0,
  rating = {},
  agentsTyping = [],
  hasMoreHistory = false,
  historyRequestStatus = '',
  allAgents = {},
  activeAgents = {},
  menuVisible = false,
  resetCurrentMessage = () => {},
  fetchConversationHistory = () => {},
  hideZendeskLogo = false,
  firstMessageTimestamp = null,
  socialLogin = {},
  conciergeSettings = {},
  showContactDetails = () => {},
  profileConfig = {},
  notificationCount = 0,
  markAsRead = () => {},
  visible = false,
  isPreview = false,
  emailTranscript,
  updateEmailTranscriptVisibility
}) => {
  const scrollContainer = useRef(null)
  const [scrollHeight, setScrollHeight] = useState(false)
  let scrollToBottomTimer = null
  let agentTypingRef = useRef(null)

  const isScrollCloseToBottom = () => {
    return scrollContainer.current
      ? getScrollBottom(scrollContainer.current) < SCROLL_BOTTOM_THRESHOLD
      : false
  }
  const scrollToBottom = useCallback(() => {
    scrollToBottomTimer = onNextTick(() => {
      if (scrollContainer.current) {
        scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight
      }
    })
  })
  // const clearScrollTimer = () => {
  //   clearTimeout(scrollToBottomTimer)
  // }

  useEffect(() => {
    const hasMessages = chatsLength + historyLength > 0

    if (hasMessages) {
      scrollToBottom()
    }

    if (unreadMessages && isScrollCloseToBottom()) {
      markAsRead()
    }
  }, [chatsLength, historyLength, unreadMessages])

  useEffect(() => {
    if (historyRequestStatus === HISTORY_REQUEST_STATUS.DONE) {
      setScrollHeight(scrollContainer.scrollHeight)
    }
  }, [historyRequestStatus])

  useEffect(() => {
    if (!scrollHeight) return

    const scrollTop = scrollContainer.current.scrollTop
    const scrollPosition = scrollContainer.current.scrollHeight
    const lengthDifference = scrollPosition - scrollHeight

    // Maintain the current scroll position after adding the new chat history
    if (lengthDifference !== 0) {
      scrollContainer.current.scrollTop = scrollTop + lengthDifference
    }
  }, [scrollHeight])

  useEffect(() => {
    if (!agentTypingRef.current) return

    const isTyping = agentsTyping.length !== 0
    if (!isTyping) return

    if (getScrollBottom(scrollContainer) <= agentTypingRef.current.offsetHeight) {
      scrollToBottom()
    }
  }, [agentsTyping, scrollToBottom])

  useEffect(() => {
    const scrollCloseToBottom = isScrollCloseToBottom()

    if (scrollCloseToBottom && isAgent(lastMessageAuthor)) {
      markAsRead()
    }

    if (scrollCloseToBottom || lastMessageAuthor === 'visitor') {
      scrollToBottom()
    }
  }, [chatsLength, lastMessageAuthor])

  const handleChatScreenScrolled = () => {
    if (!scrollContainer.current) return

    if (
      scrollContainer.scrollTop === 0 &&
      hasMoreHistory &&
      historyRequestStatus !== HISTORY_REQUEST_STATUS.PENDING
    ) {
      fetchConversationHistory()
    }

    if (visible && isScrollCloseToBottom()) {
      markAsRead()
    }
  }

  const renderQueuePosition = () => {
    if (!queuePosition || _.size(activeAgents) > 0) return null

    return <QueuePosition queuePosition={queuePosition} />
  }

  const renderChatFooter = () => {
    const sendChatFn = () => {
      if (!_.isEmpty(currentMessage.trim())) {
        sendMsg(currentMessage)
      }

      resetCurrentMessage()
    }

    return (
      <ChattingFooter
        attachmentsEnabled={attachmentsEnabled}
        isMobile={isMobile}
        endChat={showChatEndFn}
        sendChat={sendChatFn}
        isChatting={isChatting}
        handleAttachmentDrop={sendAttachments}
        menuVisible={menuVisible}
        toggleMenu={toggleMenu}
        hideZendeskLogo={hideZendeskLogo}
        isPreview={isPreview}
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

  const renderChatHeader = () => {
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

  const renderScrollPill = () => {
    if (notificationCount === 0 || isScrollCloseToBottom()) return null

    return (
      <ScrollPill
        notificationCount={notificationCount}
        onClick={() => {
          markAsRead()
          scrollToBottom()
        }}
      />
    )
  }

  /**
   * Render QuickReplies component if one should be shown
   */
  const renderQuickReply = () => {
    if (!latestQuickReply) return null
    const { timestamp, items } = latestQuickReply
    if (!items) return null

    return (
      <QuickReplies key={timestamp} isMobile={isMobile}>
        {items.map((item, idx) => {
          const { action, text } = item
          const actionFn = () => sendMsg(action.value)

          return <QuickReply key={idx} label={text} onClick={actionFn} />
        })}
      </QuickReplies>
    )
  }

  const goToFeedbackScreen = () => {
    updateChatScreen(screens.FEEDBACK_SCREEN)
  }

  const chatLogContainerClasses = classNames(styles.chatLogContainer, {
    [styles.chatLogContainerMobile]: isMobile
  })

  return (
    <Widget>
      <ChatWidgetHeader />
      {renderChatHeader()}
      <Main ref={scrollContainer} onScroll={handleChatScreenScrolled}>
        <div className={chatLogContainerClasses}>
          <HistoryLog
            isMobile={isMobile}
            showAvatar={showAvatar}
            agents={allAgents}
            firstMessageTimestamp={firstMessageTimestamp}
          />
          <ChatLog
            isMobile={isMobile}
            showAvatar={showAvatar}
            agents={allAgents}
            chatRating={rating}
            goToFeedbackScreen={goToFeedbackScreen}
            handleSendMsg={sendMsg}
            onImageLoad={scrollToBottom}
            conciergeAvatar={conciergeSettings.avatar_path}
            updateInfoOnClick={showContactDetails}
            socialLogin={socialLogin}
          />
          {renderQueuePosition()}
          <ChatLogFooter
            agentsTyping={agentsTyping}
            ref={agentTypingRef}
            isMobile={isMobile}
            hideZendeskLogo={hideZendeskLogo}
          />
          <LoadingMessagesIndicator loading={historyRequestStatus === 'pending'} />
          {renderScrollPill()}
        </div>
        {renderQuickReply()}
      </Main>
      {renderChatFooter()}
      {emailTranscript?.show && (
        <EmailTranscriptPopup
          onClose={() => {
            updateEmailTranscriptVisibility(false)
          }}
        />
      )}
    </Widget>
  )
}

ChattingScreen.propTypes = {
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
  isPreview: PropTypes.bool,
  emailTranscript: PropTypes.object.isRequired,
  updateEmailTranscriptVisibility: PropTypes.func.isRequired
}

const actionCreators = {
  updateChatScreen,
  fetchConversationHistory,
  sendMsg,
  resetCurrentMessage,
  handleChatBoxChange,
  sendAttachments,
  sendChatRating,
  markAsRead,
  updateEmailTranscriptVisibility
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(ChattingScreen)

export { connectedComponent as default, ChattingScreen as Component }
