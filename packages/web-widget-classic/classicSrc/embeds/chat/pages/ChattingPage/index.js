import ChatLog from 'classicSrc/component/chat/chatting/ChatLog'
import HistoryLog from 'classicSrc/component/chat/chatting/HistoryLog'
import { Widget, Main } from 'classicSrc/components/Widget'
import {
  SCROLL_BOTTOM_THRESHOLD,
  HISTORY_REQUEST_STATUS,
  CONNECTION_STATUSES,
} from 'classicSrc/constants/chat'
import { TEST_IDS } from 'classicSrc/constants/shared'
import ChatHeader from 'classicSrc/embeds/chat/components/ChatHeader'
import ChatLogFooter from 'classicSrc/embeds/chat/components/ChatLogFooter'
import ChatWidgetHeader from 'classicSrc/embeds/chat/components/ChatWidgetHeader'
import ChattingFooter from 'classicSrc/embeds/chat/components/ChattingFooter'
import ChatBox from 'classicSrc/embeds/chat/components/InputBox'
import LoadingMessagesIndicator from 'classicSrc/embeds/chat/components/LoadingMessagesIndicator'
import ChatModalController from 'classicSrc/embeds/chat/components/Modals/Controller'
import QueuePosition from 'classicSrc/embeds/chat/components/QueuePosition'
import { QuickReply, QuickReplies } from 'classicSrc/embeds/chat/components/QuickReplies'
import ScrollPill from 'classicSrc/embeds/chat/components/ScrollPill'
import {
  useMessagesOnMount,
  useHistoryUpdate,
  useAgentTyping,
  useNewMessages,
} from 'classicSrc/embeds/chat/hooks/chattingScreenHooks'
import * as chatSelectors from 'classicSrc/embeds/chat/selectors'
import {
  fetchConversationHistory,
  handleChatBoxChange,
  markAsRead,
  resetCurrentMessage,
  sendMsg,
  updateChatScreen,
} from 'classicSrc/redux/modules/chat'
import {
  getHasMoreHistory,
  getHistoryRequestStatus,
} from 'classicSrc/redux/modules/chat/chat-history-selectors'
import * as screens from 'classicSrc/redux/modules/chat/chat-screen-types'
import { getConciergeSettings, isInChattingScreen } from 'classicSrc/redux/modules/selectors'
import getScrollBottom from 'classicSrc/util/get-scroll-bottom'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { useRef, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { onNextTick } from '@zendesk/widget-shared-services'
import { ChatLogContainer, Shadow } from './styles'

const mapStateToProps = (state) => {
  return {
    activeAgents: chatSelectors.getActiveAgents(state),
    agentsTyping: chatSelectors.getAgentsTyping(state),
    allAgents: chatSelectors.getAllAgents(state),
    conciergeSettings: getConciergeSettings(state),
    currentMessage: chatSelectors.getCurrentMessage(state),
    firstMessageTimestamp: chatSelectors.getFirstMessageTimestamp(state),
    hasMoreHistory: getHasMoreHistory(state),
    historyRequestStatus: getHistoryRequestStatus(state),
    latestQuickReply: chatSelectors.getLatestQuickReply(state),
    notificationCount: chatSelectors.getNotificationCount(state),
    queuePosition: chatSelectors.getQueuePosition(state),
    showAvatar: chatSelectors.getThemeShowAvatar(state),
    socialLogin: chatSelectors.getSocialLogin(state),
    visible: isInChattingScreen(state),
    connection: chatSelectors.getConnection(state),
  }
}

const ChattingScreen = ({
  latestQuickReply,
  currentMessage,
  showChatEndFn,
  sendMsg,
  handleChatBoxChange,
  updateChatScreen,
  toggleMenu,
  showAvatar,
  queuePosition,
  isMobile = false,
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
  notificationCount = 0,
  markAsRead = () => {},
  visible = false,
  isPreview = false,
  connection,
}) => {
  const scrollContainer = useRef(null)
  const agentTypingRef = useRef(null)
  const [isComposerFocused, setIsComposerFocused] = useState(false)

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
  useNewMessages(scrollToBottom, scrollContainer.current)

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
        isComposerFocused={isComposerFocused}
      >
        <ChatBox
          isMobile={isMobile}
          currentMessage={currentMessage}
          sendChat={sendChatFn}
          handleChatBoxChange={(message) => {
            if (connection !== CONNECTION_STATUSES.CONNECTED) {
              return
            }

            handleChatBoxChange(message)
          }}
          onFocus={() => {
            setIsComposerFocused(true)
          }}
          onBlur={() => {
            setIsComposerFocused(false)
          }}
        />
      </ChattingFooter>
    )
  }

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
  const showScrollPill = Boolean(notificationCount > 0 && !isScrollCloseToBottom())
  const showQueuePosition = Boolean(queuePosition && _.size(activeAgents) === 0)
  const onAgentDetailsClick =
    _.size(activeAgents) > 0 ? () => updateChatScreen(screens.AGENT_LIST_SCREEN) : null

  return (
    <Widget>
      <ChatWidgetHeader />
      <ChatHeader
        agentsActive={Object.keys(activeAgents).length > 0}
        onAgentDetailsClick={onAgentDetailsClick}
      />
      <Main ref={scrollContainer} onScroll={handleChatScreenScrolled}>
        <ChatLogContainer data-testid={TEST_IDS.CHAT_LOG}>
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
            goToFeedbackScreen={goToFeedbackScreen}
            handleSendMsg={sendMsg}
            onImageLoad={scrollToBottom}
            conciergeAvatar={conciergeSettings.avatar_path}
            updateInfoOnClick={showContactDetails}
            socialLogin={socialLogin}
          />
          {showQueuePosition && <QueuePosition queuePosition={queuePosition} />}
          <ChatLogFooter
            agentsTyping={agentsTyping}
            ref={agentTypingRef}
            isMobile={isMobile}
            hideZendeskLogo={hideZendeskLogo}
          />
          <LoadingMessagesIndicator loading={historyRequestStatus === 'pending'} />
          {showScrollPill && (
            <ScrollPill
              notificationCount={notificationCount}
              onClick={() => {
                markAsRead()
                scrollToBottom()
              }}
            />
          )}
        </ChatLogContainer>
        {renderQuickReply()}
      </Main>
      <Shadow />
      {renderChatFooter()}
      <ChatModalController />
    </Widget>
  )
}

ChattingScreen.propTypes = {
  activeAgents: PropTypes.object.isRequired,
  agentsTyping: PropTypes.array.isRequired,
  allAgents: PropTypes.object.isRequired,
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
  queuePosition: PropTypes.number,
  resetCurrentMessage: PropTypes.func,
  sendMsg: PropTypes.func.isRequired,
  showAvatar: PropTypes.bool.isRequired,
  showChatEndFn: PropTypes.func.isRequired,
  showContactDetails: PropTypes.func.isRequired,
  socialLogin: PropTypes.object,
  toggleMenu: PropTypes.func.isRequired,
  updateChatScreen: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  connection: PropTypes.string,
}

const actionCreators = {
  fetchConversationHistory,
  handleChatBoxChange,
  markAsRead,
  resetCurrentMessage,
  sendMsg,
  updateChatScreen,
}

const connectedComponent = connect(mapStateToProps, actionCreators, null, { forwardRef: true })(
  ChattingScreen
)

export { connectedComponent as default, ChattingScreen as Component }
