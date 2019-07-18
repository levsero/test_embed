import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { i18n } from 'service/i18n'
import { Icon } from 'component/Icon'
import { Button } from '@zendeskgarden/react-buttons'
import { Dropzone } from 'component/Dropzone'
import { SlideAppear } from 'component/transition/SlideAppear'

import { locals as styles } from './ChatMenu.scss'
import classNames from 'classnames'

export class ChatMenu extends Component {
  static propTypes = {
    disableEndChat: PropTypes.bool.isRequired,
    attachmentsEnabled: PropTypes.bool.isRequired,
    playSound: PropTypes.bool.isRequired,
    onGoBackClick: PropTypes.func,
    onSendFileClick: PropTypes.func,
    contactDetailsOnClick: PropTypes.func,
    onSoundClick: PropTypes.func.isRequired,
    endChatOnClick: PropTypes.func,
    show: PropTypes.bool,
    emailTranscriptOnClick: PropTypes.func,
    emailTranscriptEnabled: PropTypes.bool,
    isMobile: PropTypes.bool,
    loginEnabled: PropTypes.bool,
    channelChoiceAvailable: PropTypes.bool.isRequired,
    helpCenterAvailable: PropTypes.bool.isRequired
  }

  static defaultProps = {
    endChatOnClick: () => {},
    onGoBackClick: () => {},
    onSendFileClick: () => {},
    contactDetailsOnClick: () => {},
    show: false,
    emailTranscriptOnClick: () => {},
    emailTranscriptEnabled: false,
    isMobile: false,
    loginEnabled: false
  }

  constructor(props) {
    super(props)

    this.state = {
      soundButtonClicked: false,
      soundButtonHovered: false
    }

    this.firstButton = null
  }

  handleSoundClick = e => {
    e.stopPropagation()
    this.props.onSoundClick()
    this.setState({
      soundButtonClicked: true
    })
  }

  handleSoundMouseOver = () => {
    this.setState({
      soundButtonHovered: true
    })
  }

  handleSoundMouseOut = () => {
    this.setState({
      soundButtonHovered: false
    })
  }

  preventContainerClick = e => {
    // This is needed to keep the menu being opened
    e.stopPropagation()
  }

  renderButton = (onClick, children, disabled = false) => {
    const classes = this.getItemClasses(disabled)

    return (
      <Button type="button" className={classes} onClick={onClick} disabled={disabled}>
        {children}
      </Button>
    )
  }

  focus = () => {
    this.firstButton.focus()
  }

  renderDivider = () => <div className={styles.itemLine} />

  getItemClasses = (disabled = false) =>
    classNames(this.props.isMobile ? styles.itemMobile : styles.item, {
      [styles.disabled]: disabled
    })

  renderSoundButton = () => {
    const iconType = this.props.playSound ? 'Icon--sound-on' : 'Icon--sound-off'
    const classes = classNames({
      [styles.soundButtonReset]: this.state.soundButtonClicked && !this.state.soundButtonHovered
    })
    const children = [
      i18n.t('embeddable_framework.chat.options.sound'),
      <Icon key="icon" className={styles.soundIcon} type={iconType} flipX={i18n.isRTL()} />
    ]

    return (
      <Button
        type="button"
        innerRef={el => (this.firstButton = el)}
        className={`${this.getItemClasses()} ${classes}`}
        onClick={this.handleSoundClick}
        onMouseOver={this.handleSoundMouseOver}
        onMouseOut={this.handleSoundMouseOut}
        onFocus={this.handleSoundMouseOver}
        onBlur={this.handleSoundMouseOut}
      >
        {children}
      </Button>
    )
  }

  renderEmailTranscriptButton = () => {
    const { emailTranscriptOnClick, emailTranscriptEnabled } = this.props

    if (!emailTranscriptEnabled) return null

    const label = i18n.t('embeddable_framework.chat.options.emailTranscript')
    return this.renderButton(emailTranscriptOnClick, label)
  }

  renderContactDetailsButton = () => {
    const { loginEnabled, contactDetailsOnClick } = this.props
    const label = i18n.t('embeddable_framework.chat.options.editContactDetails')

    return loginEnabled ? this.renderButton(contactDetailsOnClick, label) : null
  }

  renderEndChatButton = () => {
    const { isMobile, disableEndChat, endChatOnClick } = this.props
    const label = i18n.t('embeddable_framework.chat.options.endChat')
    const containerClasses = classNames(styles.endChatContainerMobile, {
      [styles.disabled]: this.props.disableEndChat
    })

    return isMobile ? (
      <div className={containerClasses} onClick={this.preventContainerClick}>
        <Button
          primary={true}
          type="button"
          onClick={endChatOnClick}
          className={styles.endChatMobileButton}
          disabled={disableEndChat}
        >
          {label}
        </Button>
      </div>
    ) : (
      this.renderButton(endChatOnClick, label, disableEndChat)
    )
  }

  renderGoBackButton = () => {
    const { onGoBackClick, helpCenterAvailable, channelChoiceAvailable } = this.props

    if (helpCenterAvailable || channelChoiceAvailable) {
      const label = i18n.t('embeddable_framework.common.button.goBack')

      return this.renderButton(onGoBackClick, label)
    } else {
      return null
    }
  }

  renderSendFileButton = () => {
    if (!this.props.attachmentsEnabled) return null

    return (
      <div onClick={this.preventContainerClick}>
        <Dropzone className={styles.dropzoneItem} onDrop={this.props.onSendFileClick}>
          {i18n.t('embeddable_framework.chat.options.sendFile')}
        </Dropzone>
      </div>
    )
  }

  renderDesktop = () => {
    return (
      <SlideAppear
        startPosHeight={'10px'}
        endPosHeight={'30px'}
        className={styles.container}
        trigger={this.props.show}
      >
        {this.renderSoundButton()}
        {this.renderDivider()}
        {this.renderEmailTranscriptButton()}
        {this.renderContactDetailsButton()}
        {this.renderDivider()}
        {this.renderEndChatButton()}
      </SlideAppear>
    )
  }

  renderMobile = () => {
    const containerClasses = classNames(styles.containerMobile, {
      [styles.hidden]: !this.props.show
    })

    return (
      <div className={containerClasses}>
        <div className={styles.overlayMobile} />
        <SlideAppear
          direction={'down'}
          duration={200}
          startPosHeight={'-10px'}
          endPosHeight={'0px'}
          className={styles.wrapperMobile}
          trigger={this.props.show}
        >
          {this.renderGoBackButton()}
          {this.renderContactDetailsButton()}
          {this.renderSendFileButton()}
          {this.renderEmailTranscriptButton()}
          {this.renderEndChatButton()}
        </SlideAppear>
      </div>
    )
  }

  render() {
    return this.props.isMobile ? this.renderMobile() : this.renderDesktop()
  }
}
