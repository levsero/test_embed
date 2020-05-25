import React, { useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import ChatBox from 'src/embeds/chat/components/InputBox'
import ChattingFooter from 'src/embeds/chat/components/ChattingFooter'
import ChatLog from 'component/chat/chatting/ChatLog'
import HistoryLog from 'component/chat/chatting/HistoryLog'
import ChatHeader from 'embeds/chat/components/ChatHeader'
import getScrollBottom from 'utility/get-scroll-bottom'
import ScrollPill from 'src/embeds/chat/components/ScrollPill'
import { QuickReply, QuickReplies } from 'src/embeds/chat/components/QuickReplies'
import ChatLogFooter from 'src/embeds/chat/components/ChatLogFooter'
import {
  fetchConversationHistory,
  handleChatBoxChange,
  markAsRead,
  resetCurrentMessage,
  sendChatRating,
  sendMsg,
  updateChatScreen
} from 'src/redux/modules/chat'
import * as screens from 'src/redux/modules/chat/chat-screen-types'
import {
  getHasMoreHistory,
  getHistoryRequestStatus
} from 'src/redux/modules/chat/chat-history-selectors'
import * as chatSelectors from 'src/redux/modules/chat/chat-selectors'
import {
  getConciergeSettings,
  getCurrentConcierges,
  getProfileConfig,
  getShowRatingButtons,
  isInChattingScreen
} from 'src/redux/modules/selectors'
import {
  SCROLL_BOTTOM_THRESHOLD,
  HISTORY_REQUEST_STATUS,
  CONNECTION_STATUSES
} from 'constants/chat'
import { onNextTick } from 'src/util/utils'
import ChatWidgetHeader from 'embeds/chat/components/ChatWidgetHeader'
import { Widget, Main } from 'components/Widget'
import LoadingMessagesIndicator from 'embeds/chat/components/LoadingMessagesIndicator'
import QueuePosition from 'src/embeds/chat/components/QueuePosition'
import {
  useMessagesOnMount,
  useHistoryUpdate,
  useAgentTyping,
  useNewMessages
} from 'src/embeds/chat/hooks/chattingScreenHooks'
import ChatModalController from 'src/embeds/chat/components/Modals/Controller'
import { ChatLogContainer } from './styles'
import * as selectors from 'src/redux/modules/chat/chat-selectors'

const mapStateToProps = state => {
  return {
    activeAgents: chatSelectors.getActiveAgents(state),
    agentsTyping: chatSelectors.getAgentsTyping(state),
    allAgents: chatSelectors.getAllAgents(state),
    concierges: getCurrentConcierges(state),
    conciergeSettings: getConciergeSettings(state),
    currentMessage: chatSelectors.getCurrentMessage(state),
    firstMessageTimestamp: chatSelectors.getFirstMessageTimestamp(state),
    hasMoreHistory: getHasMoreHistory(state),
    historyRequestStatus: getHistoryRequestStatus(state),
    latestQuickReply: chatSelectors.getLatestQuickReply(state),
    notificationCount: chatSelectors.getNotificationCount(state),
    profileConfig: getProfileConfig(state),
    queuePosition: chatSelectors.getQueuePosition(state),
    rating: chatSelectors.getChatRating(state),
    showAvatar: chatSelectors.getThemeShowAvatar(state),
    showRating: getShowRatingButtons(state),
    socialLogin: chatSelectors.getSocialLogin(state),
    visible: isInChattingScreen(state),
    connection: selectors.getConnection(state)
  }
}

const ChattingScreen = ({
  latestQuickReply,
  currentMessage,
  showChatEndFn,
  sendMsg,
  handleChatBoxChange,
  sendChatRating,
  updateChatScreen,
  toggleMenu,
  showAvatar,
  queuePosition,
  showRating,
  isMobile = false,
  concierges = [],
  rating = {},
  agentsTyping = [],
  hasMoreHistory = false,
  historyRequestStatus = '',
  allAgents = {},
  activeAgents = {},
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
  connection
}) => {
  const scrollContainer = useRef(null)
  const agentTypingRef = useRef(null)

  const isScrollCloseToBottom = () => {
    return scrollContainer.current
      ? getScrollBottom(scrollContainer.current) < SCROLL_BOTTOM_THRESHOLD
      : false
  }
  const scrollToBottom = useCallback(() => {
    onNextTick(() => {
      if (scrollContainer.current) {
        scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight
      }
    })
  })

  useMessagesOnMount(scrollToBottom)
  useHistoryUpdate(scrollContainer.current, scrollToBottom)
  useAgentTyping(agentTypingRef.current, scrollContainer.current, scrollToBottom)
  useNewMessages(scrollToBottom, isScrollCloseToBottom())

  const handleChatScreenScrolled = () => {
    if (!scrollContainer.current) return

    if (
      scrollContainer.current.scrollTop === 0 &&
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
      if (connection !== CONNECTION_STATUSES.CONNECTED) {
        return
      }

      if (!_.isEmpty(currentMessage.trim())) {
        sendMsg(currentMessage)
      }

      resetCurrentMessage()
    }

    return (
      <ChattingFooter
        endChat={showChatEndFn}
        sendChat={sendChatFn}
        toggleMenu={toggleMenu}
        isPreview={isPreview}
      >
        <ChatBox
          isMobile={isMobile}
          currentMessage={currentMessage}
          sendChat={sendChatFn}
          handleChatBoxChange={message => {
            if (connection !== CONNECTION_STATUSES.CONNECTED) {
              return
            }

            handleChatBoxChange(message)
          }}
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

  return (
    <Widget>
      <ChatWidgetHeader />
      {renderChatHeader()}
      <Main ref={scrollContainer} onScroll={handleChatScreenScrolled}>
        <ChatLogContainer>
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
        </ChatLogContainer>
        {renderQuickReply()}
      </Main>
      {renderChatFooter()}
      <ChatModalController />
    </Widget>
  )
}

ChattingScreen.propTypes = {
  activeAgents: PropTypes.object.isRequired,
  agentsTyping: PropTypes.array.isRequired,
  allAgents: PropTypes.object.isRequired,
  concierges: PropTypes.array.isRequired,
  conciergeSettings: PropTypes.object.isRequired,
  currentMessage: PropTypes.string.isRequired,
  fetchConversationHistory: PropTypes.func,
  firstMessageTimestamp: PropTypes.number,
  handleChatBoxChange: PropTypes.func.isRequired,
  hasMoreHistory: PropTypes.bool,
  hideZendeskLogo: PropTypes.bool,
  historyRequestStatus: PropTypes.string,
  isMobile: PropTypes.bool,
  isPreview: PropTypes.bool,
  latestQuickReply: PropTypes.object,
  markAsRead: PropTypes.func,
  notificationCount: PropTypes.number,
  profileConfig: PropTypes.object.isRequired,
  queuePosition: PropTypes.number,
  rating: PropTypes.object.isRequired,
  resetCurrentMessage: PropTypes.func,
  sendChatRating: PropTypes.func.isRequired,
  sendMsg: PropTypes.func.isRequired,
  showAvatar: PropTypes.bool.isRequired,
  showChatEndFn: PropTypes.func.isRequired,
  showContactDetails: PropTypes.func.isRequired,
  showRating: PropTypes.bool,
  socialLogin: PropTypes.object,
  toggleMenu: PropTypes.func.isRequired,
  updateChatScreen: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  connection: PropTypes.string
}

const actionCreators = {
  fetchConversationHistory,
  handleChatBoxChange,
  markAsRead,
  resetCurrentMessage,
  sendChatRating,
  sendMsg,
  updateChatScreen
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(ChattingScreen)

export { connectedComponent as default, ChattingScreen as Component }
