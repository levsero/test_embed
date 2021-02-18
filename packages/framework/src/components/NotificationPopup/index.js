import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ChatPopup from './PopupContainer'
import { i18n } from 'src/apps/webWidget/services/i18n'
import {
  AgentContainerStyle,
  ProactiveContainer,
  StyledAvatar,
  AgentName,
  AgentMessage,
} from './styles'

import { locals as styles } from './styles.scss'
import classNames from 'classnames'

export default class NotificationPopup extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    notification: PropTypes.shape({
      show: PropTypes.bool,
      proactive: PropTypes.bool,
      avatar_path: PropTypes.string,
      display_name: PropTypes.string,
      msg: PropTypes.string,
    }).isRequired,
    resultsCount: PropTypes.number.isRequired,
    chatNotificationDismissed: PropTypes.func.isRequired,
    chatNotificationRespond: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isMobile: false,
    resultsCount: 0,
  }

  constructor() {
    super()

    this.agentMessage = null
  }

  renderAgentName = (agentName) => {
    if (agentName === '') return null

    return <AgentName>{agentName}</AgentName>
  }

  renderAgentMessage = (message) => {
    const { scrollHeight, clientHeight } = this.agentMessage || {}

    return (
      <AgentMessage
        ref={(el) => (this.agentMessage = el)}
        hasOverflow={scrollHeight > clientHeight}
      >
        {message}
      </AgentMessage>
    )
  }

  renderAvatar = (avatarPath, proactive) => {
    if (avatarPath === '') return null

    return <StyledAvatar proactive={proactive} src={avatarPath} fallbackIcon="Icon--avatar" />
  }

  renderProactiveContent = () => {
    const {
      avatar_path: avatarPath,
      display_name: displayName,
      proactive,
      msg,
    } = this.props.notification // eslint-disable-line camelcase
    const noAvatar = avatarPath === ''

    return (
      <ProactiveContainer>
        {this.renderAvatar(avatarPath, proactive)}
        <AgentContainerStyle noAvatar={noAvatar} proactive={proactive}>
          {this.renderAgentName(displayName)}
          {this.renderAgentMessage(msg)}
        </AgentContainerStyle>
      </ProactiveContainer>
    )
  }

  render = () => {
    const {
      notification,
      chatNotificationDismissed,
      chatNotificationRespond,
      isMobile,
      resultsCount,
    } = this.props
    const { proactive } = notification
    const hasArticleResults = resultsCount > 0
    const componentStyles = classNames({
      [styles.proactiveNotificationMobile]: proactive && isMobile,
      [styles.ongoingNotificationDesktop]: hasArticleResults && !proactive && !isMobile,
      [styles.ongoingNotificationMobile]: !proactive && isMobile,
      [styles.ongoingNotificationNoResultsDesktop]: !hasArticleResults && !proactive && !isMobile,
    })

    return (
      <ChatPopup
        proactive={proactive}
        hasArticleResults={hasArticleResults}
        isMobile={isMobile}
        showCta={proactive}
        isDismissible={true}
        onCloseIconClick={chatNotificationDismissed}
        className={componentStyles}
        show={notification.show}
        leftCtaLabel={i18n.t('embeddable_framework.chat.popup.button.dismiss')}
        leftCtaFn={chatNotificationDismissed}
        rightCtaLabel={i18n.t('embeddable_framework.chat.popup.button.reply')}
        rightCtaFn={chatNotificationRespond}
        childrenOnClick={chatNotificationRespond}
      >
        {this.renderProactiveContent()}
      </ChatPopup>
    )
  }
}
