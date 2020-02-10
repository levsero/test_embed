import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import MessageBubbleChoices from 'src/embeds/answerBot/components/MessageBubbleChoices'
import { Icon } from 'component/Icon'
import {
  getSubmitTicketAvailable,
  getChatAvailable,
  getChatOfflineAvailable,
  getTalkOnline,
  getContactOptionsChatLabelOnline,
  getContactOptionsContactFormLabel
} from 'src/redux/modules/selectors'
import { CLICK_TO_CALL } from 'src/redux/modules/talk/talk-capability-types'
import { isCallbackEnabled } from 'src/redux/modules/talk/talk-selectors'
import { getCapability } from 'src/embeds/talk/selectors'
import { updateActiveEmbed, updateBackButtonVisibility } from 'src/redux/modules/base'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import { i18n } from 'service/i18n'
import { triggerOnEnter } from 'utility/keyboard'
import { ICONS, TEST_IDS } from 'src/constants/shared'

import { locals as styles } from './style.scss'

class ChannelChoice extends Component {
  static propTypes = {
    leadingMessage: PropTypes.string,
    useLeadingMessageAsFallback: PropTypes.bool,
    callbackAvailable: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool.isRequired,
    talkCapability: PropTypes.string,
    submitTicketAvailable: PropTypes.bool.isRequired,
    chatAvailable: PropTypes.bool.isRequired,
    chatOfflineAvailable: PropTypes.bool.isRequired,
    submitTicketLabel: PropTypes.string.isRequired,
    chatOnlineAvailableLabel: PropTypes.string.isRequired,
    chatOfflineAvailableLabel: PropTypes.string.isRequired,
    actions: PropTypes.shape({
      updateBackButtonVisibility: PropTypes.func.isRequired,
      updateActiveEmbed: PropTypes.func.isRequired
    })
  }

  static defaultProps = {
    useLeadingMessageAsFallback: false
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
    const singleChannelStyles =
      this.state.availableChannels.length === 1 ? styles.singleChannel : ''

    return (
      <div
        tabIndex="0"
        role="button"
        className={`${styles.channel} ${singleChannelStyles}`}
        onClick={this.handleClick(channel)}
        onKeyPress={triggerOnEnter(() => this.handleClick(channel))}
        data-testid={TEST_IDS.LIST_ITEM}
      >
        <Icon className={styles.icon} type={icon} />
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

    return this.renderChannel(ICONS.CC_CHAT, label, 'chat')
  }

  talkOptionLabel = talkCapability => {
    if (talkCapability == CLICK_TO_CALL) {
      return 'embeddable_framework.channelChoice.button.label.click_to_call'
    }

    return this.props.callbackAvailable
      ? 'embeddable_framework.channelChoice.button.label.request_callback'
      : 'embeddable_framework.channelChoice.button.label.call_us'
  }

  renderTalkChoice = () => {
    const { talkAvailable, talkCapability } = this.props
    if (!talkAvailable) return null

    const label = this.talkOptionLabel(talkCapability)
    const icon = talkCapability == CLICK_TO_CALL ? ICONS.CC_CLICK_TO_CALL : ICONS.CC_TALK
    return this.renderChannel(icon, i18n.t(label), 'talk')
  }

  renderSubmitTicketChoice = () => {
    if (!this.props.submitTicketAvailable) return null

    return this.renderChannel(
      ICONS.CC_SUPPORT,
      this.props.submitTicketLabel,
      'ticketSubmissionForm'
    )
  }

  render = () => {
    return this.state.availableChannels.length > 0 ? (
      <MessageBubbleChoices leadingMessage={this.leadingMessage()}>
        {this.renderChatChoice()}
        {this.renderTalkChoice()}
        {this.renderSubmitTicketChoice()}
      </MessageBubbleChoices>
    ) : null
  }
}

const mapStateToProps = state => ({
  talkAvailable: getTalkOnline(state),
  talkCapability: getCapability(state),
  callbackAvailable: getTalkOnline(state) && isCallbackEnabled(state),
  chatAvailable: getChatAvailable(state),
  chatOfflineAvailable: getChatOfflineAvailable(state),
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
  { forwardRef: true }
)(ChannelChoice)

export { connectedComponent as default, ChannelChoice as Component }
