import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { Icon } from 'component/Icon'
import Messages from './messages'
import {
  makeGetGroupMessages,
  getLastScreenClosed
} from 'src/redux/modules/answerBot/conversation/selectors'
import { getBrandLogoUrl } from 'src/redux/modules/base/base-selectors'

import { Avatar } from 'src/component/Avatar'
import { locals as styles } from './MessageGroup.scss'
import classNames from 'classnames'
import { i18n } from 'service/i18n'

const makeMapStateToProps = () => {
  const getGroupMessages = makeGetGroupMessages()

  return (state, props) => ({
    messages: getGroupMessages(state, props),
    lastConversationScreenClosed: getLastScreenClosed(state),
    brandLogoUrl: getBrandLogoUrl(state)
  })
}

class MessageGroup extends Component {
  static propTypes = {
    messages: PropTypes.array,
    isVisitor: PropTypes.bool.isRequired,
    lastConversationScreenClosed: PropTypes.number,
    scrollToBottom: PropTypes.func,
    agentAvatarName: PropTypes.string,
    agentAvatarUrl: PropTypes.string,
    brandLogoUrl: PropTypes.string.isRequired
  }

  static defaultProps = {
    messages: [],
    lastConversationScreenClosed: 0,
    scrollToBottom: () => {},
    agentAvatarName: '',
    agentAvatarUrl: '',
    brandLogoUrl: ''
  }

  constructor(props) {
    super(props)

    this.container = null
    this.avatar = null

    this.renderTimer = null
    this.lastAnimatedTimestamp = null

    this.state = { messages: [] }
  }

  componentDidMount() {
    this.renderMessages(this.props.messages, this.props.lastConversationScreenClosed)
    this.updateAvatarPosition()
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.messages, nextProps.messages)) {
      this.renderMessages(nextProps.messages, nextProps.lastConversationScreenClosed)
    }
  }

  componentDidUpdate() {
    this.updateAvatarPosition()
  }

  componentWillUnmount() {
    if (this.renderTimer) {
      this.renderTimer = clearInterval(this.renderTimer)
    }
  }

  isNewMessage = (timestamp, lastConversationScreenClosed) => {
    return timestamp > lastConversationScreenClosed && timestamp > this.lastAnimatedTimestamp
  }

  isFeedbackMessage = messages => {
    return _.get(messages, '0.type') === 'feedback'
  }

  updateAvatarPosition = () => {
    if (!this.container || !this.avatar) return

    const containerHeight = this.container.getBoundingClientRect().height - 5
    const avatarHeight = this.avatar.getBoundingClientRect().height
    let newTopPosition = containerHeight - avatarHeight

    if (this.props.agentAvatarUrl || this.props.brandLogoUrl) {
      newTopPosition -= 7
    }

    if (_.get(this.props.messages, '0.type') === 'botTyping') {
      newTopPosition += 7
    }

    if (this.avatar.style.top !== newTopPosition) {
      this.avatar.style.top = newTopPosition
    }
  }

  shouldAnimate = () => {
    const firstMessageTimestamp = _.get(this.props.messages, '0.timestamp')

    return this.isNewMessage(firstMessageTimestamp, this.props.lastConversationScreenClosed)
  }

  renderMessages = (messages, lastConversationScreenClosed) => {
    if (this.renderTimer) {
      this.renderTimer = clearInterval(this.renderTimer)
    }

    // Ignore messages which belong to previous screen or already animated
    let oldMessages = _.filter(messages, message => {
      return !this.isNewMessage(message.timestamp, lastConversationScreenClosed)
    })
    let newMessages = _.difference(messages, oldMessages)

    // For old messages, no delay or animation
    this.setState({ messages: oldMessages })

    // Run callback of old messages
    _.forEach(oldMessages, message => {
      if (_.isFunction(message.callback)) {
        message.callback()
      }
    })

    if (this.props.isVisitor && !this.isFeedbackMessage(newMessages)) {
      // For visitor, only animation and no delay
      newMessages = _.map(newMessages, message => ({
        ...message,
        shouldAnimate: true
      }))
      this.setState({ messages: oldMessages.concat(newMessages) })
    } else {
      // For bot, both delay and animation
      this.renderTimer = setInterval(() => {
        this.renderNextMessage(oldMessages, newMessages)
      }, 1000)
    }
  }

  renderNextMessage = (oldMessages, newMessages) => {
    if (!newMessages.length) {
      this.renderTimer = clearInterval(this.renderTimer)
      return
    }

    // We need to mutate oldMessages and newMessages here so that the updated
    // value would be used in the next run of renderNextMessage 1s later
    oldMessages.push({
      ...newMessages.shift(),
      shouldAnimate: true
    })

    // Clone oldMessages here in order to setState with a new object
    // instead of mutating the existing one
    this.setState({ messages: oldMessages.slice(0) })
  }

  handleMessageAnimated = message => {
    this.lastAnimatedTimestamp = message.timestamp

    // Always scroll to bottom after a new message has completed its animation
    this.props.scrollToBottom()

    // Run callback of the new message after animation completed
    if (_.isFunction(message.callback)) {
      message.callback()
    }
  }

  renderName = () => {
    const nameClasses = classNames(styles.name, {
      [styles.fadeIn]: this.shouldAnimate()
    })

    return !this.props.isVisitor ? (
      <div className={nameClasses}>
        <span>{this.props.agentAvatarName}</span>
        &nbsp; &middot; &nbsp;
        <span>{i18n.t('embeddable_framework.answerBot.tag.bot')}</span>
      </div>
    ) : null
  }

  renderAvatar = () => {
    const avatarClasses = classNames(styles.avatar, {
      [styles.fadeIn]: this.shouldAnimate()
    })

    if (this.props.isVisitor) return

    const customUrl = this.props.agentAvatarUrl || this.props.brandLogoUrl

    if (customUrl) {
      return (
        <Avatar
          src={customUrl}
          className={avatarClasses}
          ref={el => {
            this.avatar = ReactDOM.findDOMNode(el)
          }}
        />
      )
    }

    return (
      <Icon
        ref={el => {
          this.avatar = ReactDOM.findDOMNode(el)
        }}
        className={avatarClasses}
        type={'Icon--answerBot'}
      />
    )
  }

  render() {
    return this.state.messages.length ? (
      <div
        ref={el => {
          this.container = el
        }}
        className={styles.container}
      >
        {this.renderName()}
        <Messages
          messages={this.state.messages}
          isVisitor={this.props.isVisitor}
          onMessageAnimated={this.handleMessageAnimated}
        />
        {this.renderAvatar()}
      </div>
    ) : null
  }
}

const ConnectedMessageGroup = connect(
  makeMapStateToProps,
  {},
  null,
  { withRef: true }
)(MessageGroup)

export { ConnectedMessageGroup as default, MessageGroup as Component }
