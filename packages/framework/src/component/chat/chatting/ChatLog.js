import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'
import { i18n } from 'service/i18n'
import { locals as styles } from './ChatLog.scss'

import ChatGroup from 'component/chat/chatting/log/messages/ConnectedChatGroup'
import EventMessage from 'src/embeds/chat/components/EventMessage'
import RequestRatingButton from 'src/embeds/chat/components/RequestRatingButton'
import {
  getChatLog,
  getFirstVisitorMessage,
  getShowUpdateVisitorDetails,
  getIsChatting
} from 'src/redux/modules/chat/chat-selectors'
import chatPropTypes from 'types/chat'

const mapStateToProps = state => {
  return {
    chatLog: getChatLog(state),
    firstVisitorMessage: getFirstVisitorMessage(state),
    showUpdateInfo: getShowUpdateVisitorDetails(state),
    locale: i18n.getLocale(),
    isChatting: getIsChatting(state)
  }
}

export class ChatLog extends PureComponent {
  static propTypes = {
    chatLog: PropTypes.arrayOf(chatPropTypes.chatLogEntry),
    firstVisitorMessage: PropTypes.number.isRequired,
    agents: PropTypes.object,
    goToFeedbackScreen: PropTypes.func.isRequired,
    showAvatar: PropTypes.bool.isRequired,
    handleSendMsg: PropTypes.func,
    onImageLoad: PropTypes.func,
    showUpdateInfo: PropTypes.bool.isRequired,
    updateInfoOnClick: PropTypes.func,
    socialLogin: PropTypes.object,
    conciergeAvatar: PropTypes.string,
    isMobile: PropTypes.bool.isRequired,
    isChatting: PropTypes.bool.isRequired
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
          {this.props.isChatting && (
            <RequestRatingButton onClick={this.props.goToFeedbackScreen} eventKey={eventKey} />
          )}
        </EventMessage>
      )
    }
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
