import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'
import { i18n } from 'service/i18n'
import { locals as styles } from './ChatLog.scss'

import ChatGroup from 'component/chat/chatting/log/messages/ConnectedChatGroup'
import EventMessage from 'src/embeds/chat/components/EventMessage'
import { Button } from '@zendeskgarden/react-buttons'
import {
  getChatLog,
  getFirstVisitorMessage,
  getLatestRating,
  getLatestRatingRequest,
  getLatestAgentLeaveEvent,
  getShowUpdateVisitorDetails,
  getIsChatting,
  getActiveAgentCount,
  getRatingSettings
} from 'src/redux/modules/chat/chat-selectors'
import chatPropTypes from 'types/chat'

const mapStateToProps = state => {
  return {
    chatLog: getChatLog(state),
    firstVisitorMessage: getFirstVisitorMessage(state),
    latestRating: getLatestRating(state),
    latestRatingRequest: getLatestRatingRequest(state),
    latestAgentLeaveEvent: getLatestAgentLeaveEvent(state),
    showUpdateInfo: getShowUpdateVisitorDetails(state),
    locale: i18n.getLocale(),
    isChatting: getIsChatting(state),
    activeAgentCount: getActiveAgentCount(state),
    canRateChat: getRatingSettings(state).enabled
  }
}

export class ChatLog extends PureComponent {
  static propTypes = {
    chatLog: PropTypes.arrayOf(chatPropTypes.chatLogEntry),
    firstVisitorMessage: PropTypes.number.isRequired,
    latestRating: PropTypes.number.isRequired,
    latestRatingRequest: PropTypes.number.isRequired,
    latestAgentLeaveEvent: PropTypes.number.isRequired,
    agents: PropTypes.object,
    chatRating: PropTypes.object.isRequired,
    goToFeedbackScreen: PropTypes.func.isRequired,
    showAvatar: PropTypes.bool.isRequired,
    handleSendMsg: PropTypes.func,
    onImageLoad: PropTypes.func,
    showUpdateInfo: PropTypes.bool.isRequired,
    updateInfoOnClick: PropTypes.func,
    socialLogin: PropTypes.object,
    conciergeAvatar: PropTypes.string,
    isMobile: PropTypes.bool.isRequired,
    isChatting: PropTypes.bool.isRequired,
    activeAgentCount: PropTypes.number.isRequired,
    canRateChat: PropTypes.bool.isRequired
  }

  static defaultProps = {
    socialLogin: {}
  }

  constructor(props) {
    super(props)

    this.createdTimestamp = Date.now()
  }

  renderGroup = group => {
    const {
      agents,
      showAvatar,
      handleSendMsg,
      onImageLoad,
      socialLogin,
      conciergeAvatar,
      isMobile
    } = this.props

    if (group.type === 'message') {
      const firstMessageKey = group.messages[0]
      const groupNick = group.author || 'visitor'
      const isAgent = group.author.indexOf('agent:') > -1
      const avatarPath = _.get(agents, `${groupNick}.avatar_path`) || conciergeAvatar

      return (
        <ChatGroup
          key={firstMessageKey}
          isAgent={isAgent}
          messageKeys={group.messages}
          avatarPath={avatarPath}
          showAvatar={showAvatar}
          onImageLoad={onImageLoad}
          handleSendMsg={handleSendMsg}
          socialLogin={socialLogin}
          chatLogCreatedAt={this.createdTimestamp}
          isMobile={isMobile}
        >
          {this.renderUpdateInfo(firstMessageKey)}
        </ChatGroup>
      )
    }

    if (group.type === 'event') {
      const eventKey = group.messages[0]

      return (
        <EventMessage
          isHistory={false}
          key={eventKey}
          eventKey={eventKey}
          chatLogCreatedAt={this.createdTimestamp}
        >
          {this.renderRequestRatingButton(eventKey)}
        </EventMessage>
      )
    }
  }

  ratingButtonLabel(eventKey) {
    const {
      activeAgentCount,
      chatRating,
      latestRating,
      latestRatingRequest,
      latestAgentLeaveEvent
    } = this.props

    const isLatestRating = latestRating === eventKey
    const isLatestRatingRequest = latestRatingRequest === eventKey
    const isLastAgentLeaveEvent = activeAgentCount < 1 && latestAgentLeaveEvent === eventKey
    const isLatestRatingWithNoComment = isLatestRating && !chatRating.comment
    const isLatestEventNotRatingOrAgentLeave = !(
      isLatestRatingRequest ||
      isLastAgentLeaveEvent ||
      isLatestRatingWithNoComment
    )

    if (isLatestEventNotRatingOrAgentLeave) {
      return
    }

    if (eventKey < Math.max(latestRating, latestRatingRequest, latestAgentLeaveEvent)) {
      return null
    }

    if (latestRating === -1 || !chatRating.value) {
      return 'embeddable_framework.chat.chatLog.button.rateChat'
    }

    // If the user hasn't left a comment, always display the leave comment button
    if (isLatestRatingWithNoComment) {
      return 'embeddable_framework.chat.chatLog.button.leaveComment'
    }

    return 'embeddable_framework.chat.chatLog.button.rateChat'
  }

  renderRequestRatingButton(eventKey) {
    const { goToFeedbackScreen, isChatting, canRateChat } = this.props

    if (!isChatting || !canRateChat) return

    const labelKey = this.ratingButtonLabel(eventKey)

    if (!labelKey) return

    return (
      <Button
        className={styles.requestRatingButton}
        aria-label={i18n.t(labelKey)}
        onClick={goToFeedbackScreen}
      >
        {i18n.t(labelKey)}
      </Button>
    )
  }

  renderUpdateInfo(firstMessageKey) {
    const { showUpdateInfo, firstVisitorMessage, updateInfoOnClick } = this.props

    if (!(showUpdateInfo && firstVisitorMessage === firstMessageKey)) return

    return (
      <button onClick={updateInfoOnClick} className={styles.updateInfo}>
        {i18n.t('embeddable_framework.chat.chatLog.login.updateInfo')}
      </button>
    )
  }

  render() {
    if (_.isEmpty(this.props.chatLog)) return null

    return (
      <div role="log" aria-live="polite">
        {_.map(this.props.chatLog, this.renderGroup)}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  {},
  null,
  { forwardRef: true }
)(ChatLog)
