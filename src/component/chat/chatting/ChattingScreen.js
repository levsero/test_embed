import React, { useRef, useCallback } from 'react'
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
import ChatContactDetailsModal from 'src/embeds/chat/components/ContactDetails'
import {
  sendMsg,
  sendAttachments,
  handleChatBoxChange,
  sendChatRating,
  updateChatScreen,
  resetCurrentMessage,
  markAsRead,
  fetchConversationHistory,
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility
} from 'src/redux/modules/chat'
import * as screens from 'src/redux/modules/chat/chat-screen-types'
import {
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
import { getMenuVisible, getShowEditContactDetails } from 'embeds/chat/selectors'
import EmailTranscriptPopup from 'embeds/chat/components/EmailTranscriptPopup'
import {
  useMessagesOnMount,
  useHistoryUpdate,
  useAgentTyping,
  useNewMessages
} from 'src/embeds/chat/hooks/chattingScreenHooks'
import isFeatureEnabled from 'src/embeds/webWidget/selectors/feature-flags'

const mapStateToProps = state => {
  return {
    activeAgents: chatSelectors.getActiveAgents(state),
    agentsTyping: chatSelectors.getAgentsTyping(state),
    allAgents: chatSelectors.getAllAgents(state),
    attachmentsEnabled: chatSelectors.getAttachmentsEnabled(state),
    concierges: getCurrentConcierges(state),
    conciergeSettings: getConciergeSettings(state),
    currentMessage: chatSelectors.getCurrentMessage(state),
    emailTranscript: chatSelectors.getEmailTranscript(state),
    firstMessageTimestamp: chatSelectors.getFirstMessageTimestamp(state),
    hasMoreHistory: getHasMoreHistory(state),
    historyRequestStatus: getHistoryRequestStatus(state),
    isChatting: chatSelectors.getIsChatting(state),
    latestQuickReply: chatSelectors.getLatestQuickReply(state),
    menuVisible: getMenuVisible(state),
    notificationCount: chatSelectors.getNotificationCount(state),
    profileConfig: getProfileConfig(state),
    queuePosition: chatSelectors.getQueuePosition(state),
    rating: chatSelectors.getChatRating(state),
    shouldShowEditContactDetails: getShowEditContactDetails(state),
    showAvatar: chatSelectors.getThemeShowAvatar(state),
    showNewChatEmbed: isFeatureEnabled(state, 'chat_new_modal_support'),
    showRating: getShowRatingButtons(state),
    socialLogin: chatSelectors.getSocialLogin(state),
    visible: isInChattingScreen(state),
    visitor: chatSelectors.getChatVisitor(state)
  }
}

const ChattingScreen = ({
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
  attachmentsEnabled = false,
  isMobile = false,
  concierges = [],
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
  updateEmailTranscriptVisibility,
  updateContactDetailsVisibility,
  shouldShowEditContactDetails,
  showNewChatEmbed
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
      {shouldShowEditContactDetails && showNewChatEmbed && (
        <ChatContactDetailsModal onClose={() => updateContactDetailsVisibility(false)} />
      )}
    </Widget>
  )
}

ChattingScreen.propTypes = {
  activeAgents: PropTypes.object.isRequired,
  agentsTyping: PropTypes.array.isRequired,
  allAgents: PropTypes.object.isRequired,
  attachmentsEnabled: PropTypes.bool.isRequired,
  concierges: PropTypes.array.isRequired,
  conciergeSettings: PropTypes.object.isRequired,
  currentMessage: PropTypes.string.isRequired,
  emailTranscript: PropTypes.object.isRequired,
  fetchConversationHistory: PropTypes.func,
  firstMessageTimestamp: PropTypes.number,
  handleChatBoxChange: PropTypes.func.isRequired,
  hasMoreHistory: PropTypes.bool,
  hideZendeskLogo: PropTypes.bool,
  historyRequestStatus: PropTypes.string,
  isChatting: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool,
  isPreview: PropTypes.bool,
  latestQuickReply: PropTypes.object,
  markAsRead: PropTypes.func,
  menuVisible: PropTypes.bool,
  notificationCount: PropTypes.number,
  profileConfig: PropTypes.object.isRequired,
  queuePosition: PropTypes.number,
  rating: PropTypes.object.isRequired,
  resetCurrentMessage: PropTypes.func,
  sendAttachments: PropTypes.func.isRequired,
  sendChatRating: PropTypes.func.isRequired,
  sendMsg: PropTypes.func.isRequired,
  shouldShowEditContactDetails: PropTypes.bool.isRequired,
  showAvatar: PropTypes.bool.isRequired,
  showChatEndFn: PropTypes.func.isRequired,
  showContactDetails: PropTypes.func.isRequired,
  showNewChatEmbed: PropTypes.bool,
  showRating: PropTypes.bool,
  socialLogin: PropTypes.object,
  toggleMenu: PropTypes.func.isRequired,
  updateChatScreen: PropTypes.func.isRequired,
  updateContactDetailsVisibility: PropTypes.func.isRequired,
  updateEmailTranscriptVisibility: PropTypes.func.isRequired,
  visible: PropTypes.bool
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
  updateEmailTranscriptVisibility,
  updateContactDetailsVisibility
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(ChattingScreen)

export { connectedComponent as default, ChattingScreen as Component }
