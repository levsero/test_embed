import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { MessageBubbleChoices } from 'component/shared/MessageBubbleChoices'
import { Icon } from 'component/Icon'
import {
  getSubmitTicketAvailable,
  getChatAvailable,
  getChatOfflineAvailable,
  getTalkOnline,
  getContactOptionsChatLabelOnline,
  getContactOptionsContactFormLabel
} from 'src/redux/modules/selectors'
import { isCallbackEnabled } from 'src/redux/modules/talk/talk-selectors'
import { updateActiveEmbed, updateBackButtonVisibility } from 'src/redux/modules/base'
import { getLocale, getZopimChatEmbed } from 'src/redux/modules/base/base-selectors'
import { i18n } from 'service/i18n'

import { locals as styles } from './style.scss'

class ChannelChoice extends Component {
  static propTypes = {
    leadingMessage: PropTypes.string,
    useLeadingMessageAsFallback: PropTypes.bool,
    callbackAvailable: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool.isRequired,
    submitTicketAvailable: PropTypes.bool.isRequired,
    chatAvailable: PropTypes.bool.isRequired,
    chatOfflineAvailable: PropTypes.bool.isRequired,
    oldChat: PropTypes.bool,
    submitTicketLabel: PropTypes.string.isRequired,
    chatOnlineAvailableLabel: PropTypes.string.isRequired,
    chatOfflineAvailableLabel: PropTypes.string.isRequired,
    actions: PropTypes.shape({
      updateBackButtonVisibility: PropTypes.func.isRequired,
      updateActiveEmbed: PropTypes.func.isRequired
    })
  }

  static defaultProps = {
    useLeadingMessageAsFallback: false,
    oldChat: false
  }

  constructor(props) {
    super(props)

    this.state = {
      availableChannels: this.getAvailableChannels(this.props)
    }
  }

  componentWillReceiveProps(props) {
    this.setState({ availableChannels: this.getAvailableChannels(props) })
  }

  getAvailableChannels = props => {
    const {
      chatAvailable,
      chatOfflineAvailable,
      talkAvailable,
      callbackAvailable,
      submitTicketAvailable
    } = props
    let availableChannels = []

    if (chatAvailable || chatOfflineAvailable) {
      availableChannels.push('chat')
    }

    if (callbackAvailable) {
      availableChannels.push('request_callback')
    } else if (talkAvailable) {
      availableChannels.push('call_us')
    }

    if (submitTicketAvailable) {
      availableChannels.push('submit_ticket')
    }

    return availableChannels
  }

  handleClick = channel => {
    return () => {
      this.props.actions.updateBackButtonVisibility(true)
      if (this.props.oldChat && channel === 'chat') {
        channel = 'zopimChat'
      }
      this.props.actions.updateActiveEmbed(channel)
    }
  }

  leadingMessage = () => {
    const { leadingMessage, useLeadingMessageAsFallback } = this.props

    if (!useLeadingMessageAsFallback && leadingMessage) return leadingMessage

    if (this.state.availableChannels.length === 1) {
      return i18n.t(
        `embeddable_framework.answerBot.msg.channel_choice.${
          this.state.availableChannels[0]
        }_only.title`
      )
    } else if (leadingMessage) {
      return leadingMessage
    } else {
      return i18n.t('embeddable_framework.answerBot.msg.channel_choice.title')
    }
  }

  renderChannel = (icon, label, channel) => {
    const iconClasses = `${styles.icon}`
    const singleChannelStyles =
      this.state.availableChannels.length === 1 ? styles.singleChannel : ''

    return (
      <div
        className={`${styles.channel} ${singleChannelStyles}`}
        onClick={this.handleClick(channel)}
      >
        <Icon className={iconClasses} type={icon} />
        <div className={styles.optionText}>{label}</div>
      </div>
    )
  }

  renderChatChoice = () => {
    const {
      chatAvailable,
      chatOfflineAvailable,
      chatOnlineAvailableLabel,
      chatOfflineAvailableLabel
    } = this.props

    if (!chatAvailable && !chatOfflineAvailable) return null
    const label = chatOfflineAvailable ? chatOfflineAvailableLabel : chatOnlineAvailableLabel

    return this.renderChannel('Icon--channelChoice-chat', label, 'chat')
  }

  renderTalkChoice = () => {
    if (!this.props.talkAvailable) return null

    const label = this.props.callbackAvailable
      ? 'embeddable_framework.channelChoice.button.label.request_callback'
      : 'embeddable_framework.channelChoice.button.label.call_us'

    return this.renderChannel('Icon--channelChoice-talk', i18n.t(label), 'talk')
  }

  renderSubmitTicketChoice = () => {
    if (!this.props.submitTicketAvailable) return null

    return this.renderChannel(
      'Icon--channelChoice-contactForm',
      this.props.submitTicketLabel,
      'ticketSubmissionForm'
    )
  }

  render = () => {
    return this.state.availableChannels.length > 0 ? (
      <MessageBubbleChoices
        leadingMessage={this.leadingMessage()}
        containerStyle={styles.container}
        leadingMessageStyle={styles.title}
      >
        {this.renderChatChoice()}
        {this.renderTalkChoice()}
        {this.renderSubmitTicketChoice()}
      </MessageBubbleChoices>
    ) : null
  }
}

const mapStateToProps = state => ({
  talkAvailable: getTalkOnline(state),
  callbackAvailable: getTalkOnline(state) && isCallbackEnabled(state),
  chatAvailable: getChatAvailable(state),
  chatOfflineAvailable: getChatOfflineAvailable(state),
  oldChat: getZopimChatEmbed(state),
  submitTicketAvailable: getSubmitTicketAvailable(state),
  chatOnlineAvailableLabel: getContactOptionsChatLabelOnline(state),
  chatOfflineAvailableLabel: getContactOptionsContactFormLabel(state),
  submitTicketLabel: getContactOptionsContactFormLabel(state),
  locale: getLocale(state)
})

const actionCreators = dispatch => ({
  actions: bindActionCreators(
    {
      updateBackButtonVisibility,
      updateActiveEmbed
    },
    dispatch
  )
})

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { withRef: true }
)(ChannelChoice)

export { connectedComponent as default, ChannelChoice as Component }
