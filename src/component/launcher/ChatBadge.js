import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import _ from 'lodash'

import { triggerOnEnter } from 'utility/keyboard'
import { handleChatBadgeMessageChange, sendChatBadgeMessage } from 'src/redux/modules/chat'
import { handleChatBadgeMinimize, chatBadgeClicked } from 'src/redux/modules/base'
import { getCurrentMessage } from 'src/redux/modules/chat/chat-selectors'
import { getLauncherBadgeSettings } from 'src/redux/modules/selectors'
import { Field, Input } from '@zendeskgarden/react-forms'
import { Icon } from 'component/Icon'
import { ICONS, TEST_IDS } from 'constants/shared'
import { i18n } from 'service/i18n'

import { locals as styles } from './ChatBadge.scss'

const mapStateToProps = state => {
  return {
    currentMessage: getCurrentMessage(state),
    bannerSettings: getLauncherBadgeSettings(state)
  }
}

class ChatBadge extends Component {
  static propTypes = {
    onSend: PropTypes.func.isRequired,
    handleChatBadgeMessageChange: PropTypes.func.isRequired,
    currentMessage: PropTypes.string,
    sendMsg: PropTypes.func.isRequired,
    handleChatBadgeMinimize: PropTypes.func.isRequired,
    bannerSettings: PropTypes.object.isRequired,
    chatBadgeClicked: PropTypes.func.isRequired,
    hideBranding: PropTypes.bool
  }

  static defaultProps = {
    currentMessage: '',
    bannerSettings: {},
    hideBranding: false
  }

  constructor(props, context) {
    super(props, context)
    this.input = null
  }

  renderMinimizeButton = () => {
    return (
      <Icon
        className={styles.minimizeButton}
        type={ICONS.DASH}
        onClick={this.props.handleChatBadgeMinimize}
      />
    )
  }

  renderTitle = () => {
    if (this.props.hideBranding) return

    // Zendesk branding doesn't need to be translated.
    return <div className={styles.title}>zendesk chat</div>
  }

  renderLabel = () => {
    const labelClasses = classNames(styles.textContainer, {
      [styles.textOnLeft]: this.props.bannerSettings.layout === 'image_right',
      [styles.textOnRight]: this.props.bannerSettings.layout === 'image_left',
      [styles.textOnly]: this.props.bannerSettings.layout === 'text_only'
    })

    return (
      <td key={'label'} className={labelClasses}>
        {this.props.bannerSettings.label}
      </td>
    )
  }

  renderImage = () => {
    let imageElement
    const { image, layout } = this.props.bannerSettings

    let imgClasses = classNames({
      [styles.chatIcon]: !image,
      [styles.imgRight]: layout === 'image_right',
      [styles.imgLeft]: layout === 'image_left',
      [styles.imgOnly]: !image && layout === 'image_only',
      [styles.customImg]: image && layout !== 'image_only',
      [styles.customImgOnly]: image && layout === 'image_only'
    })

    if (image) {
      imageElement = (
        <img
          alt={this.props.bannerSettings.label}
          src={this.props.bannerSettings.image}
          className={imgClasses}
        />
      )
    } else {
      imageElement = <Icon className={imgClasses} type={ICONS.CC_CHAT} />
    }

    return (
      <td key={'image'} className={styles.imageContainer}>
        {imageElement}
      </td>
    )
  }

  renderContent = () => {
    switch (this.props.bannerSettings.layout) {
      case 'text_only':
        return [this.renderLabel()]

      case 'image_only':
        return [this.renderImage()]

      case 'image_left':
        return [this.renderImage(), this.renderLabel()]

      default:
        return [this.renderLabel(), this.renderImage()]
    }
  }

  renderSplashDisplay = () => {
    const displayClasses = classNames(styles.splashDisplayContainer, {
      [styles.splashPadding]: this.props.bannerSettings.layout !== 'image_only'
    })

    return (
      <div
        onKeyPress={triggerOnEnter(this.props.chatBadgeClicked)}
        role="button"
        tabIndex="0"
        onClick={this.props.chatBadgeClicked}
        className={displayClasses}
      >
        <table className={styles.splashTable}>
          <tbody>
            <tr>{this.renderContent()}</tr>
          </tbody>
        </table>
      </div>
    )
  }

  renderInputContainer = () => {
    const sendButtonClasses = classNames(styles.sendButton, {
      [styles.sendButtonActive]: this.props.currentMessage.length > 0
    })

    return (
      <div className={styles.inputContainer}>
        <Field>
          <Input
            ref={el => {
              this.input = el
            }}
            className={styles.input}
            placeholder={i18n.t('embeddable_framework.chat.chatBox.placeholder.type_your_message')}
            onChange={this.handleChange}
            onKeyDown={triggerOnEnter(this.sendChatMsg)}
            defaultValue={this.props.currentMessage}
            data-testid={TEST_IDS.MESSAGE_FIELD}
          />
        </Field>
        <Icon onClick={this.sendChatMsg} className={sendButtonClasses} type={ICONS.SEND_CHAT} />
      </div>
    )
  }

  sendChatMsg = e => {
    if (_.isEmpty(this.props.currentMessage)) return
    this.props.sendMsg(this.props.currentMessage)
    this.props.onSend(e)
  }

  handleChange = e => {
    this.props.handleChatBadgeMessageChange(e.target.value)
  }

  render = () => {
    return (
      <div className={styles.container}>
        {this.renderTitle()}
        {this.renderSplashDisplay()}
        {this.renderInputContainer()}
        {this.renderMinimizeButton()}
      </div>
    )
  }
}

const actionCreators = {
  sendMsg: sendChatBadgeMessage,
  handleChatBadgeMessageChange,
  handleChatBadgeMinimize,
  chatBadgeClicked
}

export default connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(ChatBadge)
