import _ from 'lodash'
import PropTypes from 'prop-types'

import { DISCONNECTION_REASONS } from 'constants/chat'
import useTranslate from 'src/hooks/useTranslate'
import { TEST_IDS } from 'src/constants/shared'
import { Message } from './styles'

import { connect } from 'react-redux'
import { getHistoryEventMessage, getEventMessage } from 'src/embeds/chat/selectors'

const getEventText = (event, translate) => {
  const isAgent = event.nick && event.nick.indexOf('agent:') > -1 ? true : false

  switch (event.type) {
    case 'chat.memberjoin':
      return isAgent
        ? translate('embeddable_framework.chat.chatLog.agentJoined', {
            agent: event.display_name,
          })
        : translate('embeddable_framework.chat.chatLog.chatStarted')

    case 'chat.memberleave':
      if (isAgent) {
        return translate(
          _.includes(DISCONNECTION_REASONS, event.reason)
            ? 'embeddable_framework.chat.chatLog.agentDisconnected'
            : 'embeddable_framework.chat.chatLog.agentLeft',
          { agent: event.display_name }
        )
      }

      return translate('embeddable_framework.chat.chatLog.chatEnded')

    case 'chat.rating':
      const ratingValue = event.new_rating
      const oldRating = event.rating

      if (!ratingValue) {
        if (oldRating) return translate('embeddable_framework.chat.chatLog.rating.removed')
        return
      }

      const value = translate(`embeddable_framework.chat.chatLog.rating.${ratingValue}`)
      return translate('embeddable_framework.chat.chatLog.rating.description', { value })

    case 'chat.comment':
      return translate('embeddable_framework.chat.chatlog.comment.submitted')

    case 'chat.contact_details.updated':
      return translate('embeddable_framework.chat.contact_details.updated')
  }
}

const EventMessage = ({ event = {}, children, divider = null, chatLogCreatedAt = 0 }) => {
  const translate = useTranslate()
  return (
    <Message
      key={event.timestamp}
      data-testid={TEST_IDS.CHAT_MSG_EVENT}
      showAnimation={event.timestamp > chatLogCreatedAt}
    >
      {divider}
      {getEventText(event, translate)}
      {children}
    </Message>
  )
}

EventMessage.propTypes = {
  event: PropTypes.shape({
    timestamp: PropTypes.number,
    nick: PropTypes.string,
    type: PropTypes.string,
    display_name: PropTypes.string,
  }),
  children: PropTypes.node,
  divider: PropTypes.node,
  chatLogCreatedAt: PropTypes.number,
}

const mapStateToProps = (state, props) => ({
  event: props.isHistory
    ? getHistoryEventMessage(state, props.eventKey)
    : getEventMessage(state, props.eventKey),
})

const connectedComponent = connect(mapStateToProps, {}, null)(EventMessage)

export { connectedComponent as default, EventMessage as Component }
