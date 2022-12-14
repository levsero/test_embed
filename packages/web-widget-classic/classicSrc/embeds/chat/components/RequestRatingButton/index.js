import {
  getLatestRating,
  getLatestRatingRequest,
  getLatestAgentLeaveEvent,
  getActiveAgentCount,
  getRatingSettings,
  getChatRating,
} from 'classicSrc/embeds/chat/selectors'
import ChatPropTypes from 'classicSrc/embeds/chat/utils/ChatPropTypes'
import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from './styles'

const ratingButtonLabel = (
  eventKey,
  activeAgentCount,
  chatRating,
  latestRating,
  latestRatingRequest,
  latestAgentLeaveEvent
) => {
  const isLatestRating = latestRating === eventKey
  const isLatestRatingRequest = latestRatingRequest === eventKey
  const isLastAgentLeaveEventWithoutRatingCheck =
    activeAgentCount < 1 && latestAgentLeaveEvent === eventKey

  // Hide display button if visitor has rated during the chat after agent ends the chat.
  const hasRating = chatRating.value || chatRating.comment
  const isLastAgentLeaveEvent = isLastAgentLeaveEventWithoutRatingCheck && !hasRating

  const isLatestRatingWithNoComment = isLatestRating && !chatRating.comment
  const isLatestEventNotRatingOrAgentLeave = !(
    isLatestRatingRequest ||
    isLastAgentLeaveEvent ||
    isLatestRatingWithNoComment
  )

  if (isLatestEventNotRatingOrAgentLeave) return

  if (eventKey < Math.max(latestRating, latestRatingRequest, latestAgentLeaveEvent)) return

  if (latestRating === -1 || !chatRating.value) {
    return 'embeddable_framework.chat.chatLog.button.rateChat'
  }

  // If the user hasn't left a comment, always display the leave comment button
  if (isLatestRatingWithNoComment) {
    return 'embeddable_framework.chat.chatLog.button.leaveComment'
  }

  return 'embeddable_framework.chat.chatLog.button.rateChat'
}

const RequestRatingButton = ({
  eventKey,
  onClick,
  canRateChat,
  activeAgentCount,
  chatRating,
  latestRating,
  latestRatingRequest,
  latestAgentLeaveEvent,
}) => {
  const translate = useTranslate()

  const label = ratingButtonLabel(
    eventKey,
    activeAgentCount,
    chatRating,
    latestRating,
    latestRatingRequest,
    latestAgentLeaveEvent
  )

  if (!canRateChat || !label) return null

  return (
    <div>
      <Button aria-label={translate(label)} onClick={onClick}>
        {translate(label)}
      </Button>
    </div>
  )
}

RequestRatingButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  eventKey: PropTypes.number.isRequired,
  canRateChat: PropTypes.bool.isRequired,
  latestRating: PropTypes.number.isRequired,
  latestRatingRequest: PropTypes.number.isRequired,
  latestAgentLeaveEvent: PropTypes.number.isRequired,
  activeAgentCount: PropTypes.number.isRequired,
  chatRating: ChatPropTypes.chatRating.isRequired,
}

const mapStateToProps = (state) => ({
  latestRating: getLatestRating(state),
  latestRatingRequest: getLatestRatingRequest(state),
  latestAgentLeaveEvent: getLatestAgentLeaveEvent(state),
  activeAgentCount: getActiveAgentCount(state),
  canRateChat: getRatingSettings(state).enabled,
  chatRating: getChatRating(state),
})

const connectedComponent = connect(mapStateToProps, {}, null)(RequestRatingButton)

export { connectedComponent as default, RequestRatingButton as Component }
