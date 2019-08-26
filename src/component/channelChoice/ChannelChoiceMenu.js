import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import _ from 'lodash'

import { i18n } from 'service/i18n'
import { ButtonIcon } from 'component/button/ButtonIcon'
import { locals as styles } from './ChannelChoiceMenu.scss'
import {
  getContactOptionsChatLabelOnline,
  getContactOptionsChatLabelOffline,
  getContactOptionsContactFormLabel
} from 'src/redux/modules/selectors'

const mapStateToProps = state => ({
  chatOnlineAvailableLabel: getContactOptionsChatLabelOnline(state),
  chatOfflineLabel: getContactOptionsChatLabelOffline(state),
  chatOfflineAvailableLabel: getContactOptionsContactFormLabel(state),
  submitTicketLabel: getContactOptionsContactFormLabel(state)
})

class ChannelChoiceMenu extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    onNextClick: PropTypes.func.isRequired,
    callbackEnabled: PropTypes.bool.isRequired,
    buttonClasses: PropTypes.string,
    labelClasses: PropTypes.string,
    talkOnline: PropTypes.bool,
    chatAvailable: PropTypes.bool,
    chatOfflineAvailable: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatOnlineAvailableLabel: PropTypes.string.isRequired,
    chatOfflineLabel: PropTypes.string.isRequired,
    chatOfflineAvailableLabel: PropTypes.string.isRequired,
    submitTicketLabel: PropTypes.string.isRequired
  }

  static defaultProps = {
    isMobile: false,
    buttonClasses: '',
    labelClasses: '',
    talkOnline: false,
    submitTicketAvailable: true,
    chatAvailable: false,
    chatOfflineAvailable: false
  }

  state = {
    chatWasOnline: false,
    talkWasOnline: false
  }

  static getDerivedStateFromProps(props, state) {
    let newState = {}

    if ((props.chatAvailable || props.chatOfflineAvailable) && !state.chatWasOnline) {
      newState.chatWasOnline = true
    }
    if (props.talkOnline && !state.talkWasOnline) {
      newState.talkWasOnline = true
    }

    return _.isEmpty(newState) ? null : newState
  }

  handleChatClick = () => {
    return this.props.chatAvailable || this.props.chatOfflineAvailable
      ? this.handleNextClick('chat')
      : e => e.stopPropagation() // prevent container from hiding channelChoice
  }

  handleNextClick = embed => {
    return () => this.props.onNextClick(embed)
  }

  getIconFlipX = () => {
    // Needs to flip icons for RTL languages: https://zendesk.atlassian.net/browse/CE-4045
    return i18n.isRTL()
  }

  getListStyle = () => classNames(styles.listItem, { [styles.listItemMobile]: this.props.isMobile })

  renderTalkLabel = () => {
    const { callbackEnabled, talkOnline } = this.props
    const optionLabel = callbackEnabled
      ? i18n.t('embeddable_framework.channelChoice.button.label.request_callback')
      : i18n.t('embeddable_framework.channelChoice.button.label.call_us')
    const offlineLabel = (
      <span className={styles.offlineOptionContainer}>
        <div className={styles.offlineLabelOption}>{optionLabel}</div>
        <div>{i18n.t('embeddable_framework.channelChoice.button.label.no_available_agents')}</div>
      </span>
    )

    return talkOnline ? optionLabel : offlineLabel
  }

  renderTalkButton = () => {
    const { talkOnline, buttonClasses } = this.props

    if (!this.state.talkWasOnline && !talkOnline) return null

    const iconStyle = classNames(styles.iconTalk, {
      [styles.newIcon]: talkOnline,
      [styles.newIconDisabled]: !talkOnline
    })
    const buttonStyle = classNames(buttonClasses, styles.btn, {
      [styles.btnEnabled]: talkOnline,
      [styles.talkBtnDisabled]: !talkOnline
    })

    return (
      <li className={this.getListStyle()}>
        <ButtonIcon
          actionable={talkOnline}
          containerStyles={buttonStyle}
          labelClassName={this.props.labelClasses}
          onClick={this.handleNextClick('talk')}
          iconClasses={iconStyle}
          label={this.renderTalkLabel()}
          flipX={this.getIconFlipX()}
          icon={'Icon--channelChoice-talk'}
        />
      </li>
    )
  }

  renderSubmitTicketButton = () => {
    if (!this.props.submitTicketAvailable) return null

    const { buttonClasses, submitTicketLabel } = this.props
    const iconStyle = classNames(styles.newIcon, styles.iconSubmitTicket)
    const buttonStyle = classNames(buttonClasses, styles.btn, styles.btnEnabled)

    return (
      <li className={this.getListStyle()}>
        <ButtonIcon
          containerStyles={buttonStyle}
          iconClasses={iconStyle}
          labelClassName={this.props.labelClasses}
          onClick={this.handleNextClick('ticketSubmissionForm')}
          label={submitTicketLabel}
          flipX={this.getIconFlipX()}
          icon={'Icon--channelChoice-contactForm'}
        />
      </li>
    )
  }

  renderChatLabel = () => {
    const {
      chatAvailable,
      chatOfflineAvailable,
      chatOnlineAvailableLabel,
      chatOfflineLabel,
      chatOfflineAvailableLabel
    } = this.props
    const offlineLabel = (
      <span className={styles.offlineOptionContainer}>
        <div className={styles.offlineLabelOption}>{chatOfflineLabel}</div>
        <div>{i18n.t('embeddable_framework.channelChoice.button.label.no_available_agents')}</div>
      </span>
    )

    if (chatOfflineAvailable) {
      return chatOfflineAvailableLabel
    } else if (chatAvailable) {
      return chatOnlineAvailableLabel
    }
    return offlineLabel
  }

  renderChatButton = () => {
    const { chatAvailable, chatOfflineAvailable, buttonClasses, labelClasses } = this.props
    const showChatChannel = chatAvailable || chatOfflineAvailable

    if (!this.state.chatWasOnline && !showChatChannel) return null

    const iconStyle = classNames(styles.iconChat, {
      [styles.newIcon]: showChatChannel,
      [styles.newIconDisabled]: !showChatChannel
    })
    const buttonStyle = classNames(buttonClasses, styles.btn, {
      [styles.btnEnabled]: showChatChannel,
      [styles.chatBtnDisabled]: !showChatChannel
    })

    return (
      <li className={this.getListStyle()}>
        <ButtonIcon
          actionable={showChatChannel}
          containerStyles={buttonStyle}
          iconClasses={iconStyle}
          labelClassName={labelClasses}
          onClick={this.handleChatClick()}
          label={this.renderChatLabel()}
          flipX={this.getIconFlipX()}
          icon={'Icon--channelChoice-chat'}
        />
      </li>
    )
  }

  render = () => {
    return (
      <ul>
        {this.renderTalkButton()}
        {this.renderChatButton()}
        {this.renderSubmitTicketButton()}
      </ul>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(ChannelChoiceMenu)

export { connectedComponent as default, ChannelChoiceMenu as Component }
