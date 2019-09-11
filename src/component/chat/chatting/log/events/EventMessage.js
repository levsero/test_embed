import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { DISCONNECTION_REASONS } from 'constants/chat'
import { i18n } from 'service/i18n'
import { locals as styles } from './EventMessage.scss'
import classNames from 'classnames'
import { TEST_IDS } from 'src/constants/shared'

export default class EventMessage extends Component {
  static propTypes = {
    event: PropTypes.object,
    children: PropTypes.object,
    divider: PropTypes.node,
    chatLogCreatedAt: PropTypes.number
  }

  static defaultProps = {
    event: {},
    divider: null,
    chatLogCreatedAt: 0
  }

  renderEventMessage(event) {
    const isAgent = nick => nick.indexOf('agent:') > -1

    switch (event.type) {
      case 'chat.memberjoin':
        return isAgent(event.nick)
          ? i18n.t('embeddable_framework.chat.chatLog.agentJoined', {
              agent: event.display_name
            })
          : i18n.t('embeddable_framework.chat.chatLog.chatStarted')

      case 'chat.memberleave':
        if (isAgent(event.nick)) {
          return i18n.t(
            _.includes(DISCONNECTION_REASONS, event.reason)
              ? 'embeddable_framework.chat.chatLog.agentDisconnected'
              : 'embeddable_framework.chat.chatLog.agentLeft',
            { agent: event.display_name }
          )
        }

        return i18n.t('embeddable_framework.chat.chatLog.chatEnded')

      case 'chat.rating':
        const ratingValue = event.new_rating

        if (!ratingValue) return i18n.t('embeddable_framework.chat.chatLog.rating.removed')

        const value = i18n.t(`embeddable_framework.chat.chatLog.rating.${ratingValue}`)
        return i18n.t('embeddable_framework.chat.chatLog.rating.description', { value })

      case 'chat.comment':
        return i18n.t('embeddable_framework.chat.chatlog.comment.submitted')

      case 'chat.contact_details.updated':
        return i18n.t('embeddable_framework.chat.contact_details.updated')
    }
  }

  render() {
    const { event, chatLogCreatedAt } = this.props
    const shouldAnimate = event.timestamp > chatLogCreatedAt
    const wrapperClasses = classNames(styles.eventMessage, {
      [styles.fadeIn]: shouldAnimate
    })

    return (
      <div key={event.timestamp} data-testid={TEST_IDS.CHAT_MSG_EVENT} className={wrapperClasses}>
        {this.props.divider}
        {this.renderEventMessage(event)}
        {this.props.children}
      </div>
    )
  }
}
