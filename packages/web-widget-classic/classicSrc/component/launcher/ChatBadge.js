import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import SendChatIcon from 'classicSrc/asset/icons/widget-icon_sendChat.svg'
import { Icon } from 'classicSrc/component/Icon'
import { ICONS, TEST_IDS } from 'classicSrc/constants/shared'
import { getCurrentMessage } from 'classicSrc/embeds/chat/selectors'
import { FrameStyle } from 'classicSrc/embeds/webWidget/components/BaseFrame/FrameStyleContext'
import { handleChatBadgeMinimize, chatBadgeClicked } from 'classicSrc/redux/modules/base'
import { handleChatBadgeMessageChange, sendChatBadgeMessage } from 'classicSrc/redux/modules/chat'
import { getLauncherBadgeSettings } from 'classicSrc/redux/modules/selectors'
import { triggerOnEnter } from 'classicSrc/util/keyboard'
import classNames from 'classnames'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { Button, IconButton } from '@zendeskgarden/react-buttons'
import { Field, Input } from '@zendeskgarden/react-forms'
import MinimiseIcon from '@zendeskgarden/svg-icons/src/16/dash-fill.svg'
import { locals as styles } from './ChatBadge.scss'

const frameStyle = {
  height: 215,
  minHeight: 215,
  width: 260,
  marginTop: 7,
  marginBottom: 7,
  marginLeft: 7,
  marginRight: 7,
}

const mapStateToProps = (state) => {
  return {
    currentMessage: getCurrentMessage(state),
    bannerSettings: getLauncherBadgeSettings(state),
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
    hideBranding: PropTypes.bool,
    isPreviewer: PropTypes.bool,
  }

  static defaultProps = {
    currentMessage: '',
    bannerSettings: {},
    hideBranding: false,
  }

  constructor(props, context) {
    super(props, context)
    this.input = null
  }

  renderMinimizeButton = () => {
    return (
      <IconButton
        isPill={false}
        className={styles.minimizeButton}
        ignoreThemeOverride={true}
        onClick={this.props.handleChatBadgeMinimize}
        size="small"
      >
        <MinimiseIcon data-testid={TEST_IDS.ICON_DASH} />
      </IconButton>
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
      [styles.textOnly]: this.props.bannerSettings.layout === 'text_only',
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
      [styles.customImgOnly]: image && layout === 'image_only',
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
      [styles.splashPadding]: this.props.bannerSettings.layout !== 'image_only',
    })

    return (
      <Button
        isBasic={true}
        ignoreThemeOverride={true}
        onKeyPress={triggerOnEnter(this.props.chatBadgeClicked)}
        tabIndex="0"
        onClick={this.props.chatBadgeClicked}
        className={displayClasses}
      >
        {this.renderTitle()}

        <table className={styles.splashTable}>
          <tbody>
            <tr>{this.renderContent()}</tr>
          </tbody>
        </table>
      </Button>
    )
  }

  renderInputContainer = () => {
    const sendButtonClasses = classNames(styles.sendButton, {
      [styles.sendButtonActive]: this.props.currentMessage.length > 0,
    })

    return (
      <div className={styles.inputContainer}>
        <Field>
          <Input
            ref={(el) => {
              this.input = el
            }}
            focusInset={true}
            ignoreThemeOverride={true}
            className={styles.input}
            placeholder={i18n.t('embeddable_framework.chat.chatBox.placeholder.type_your_message')}
            onChange={this.handleChange}
            onKeyDown={triggerOnEnter(this.sendChatMsg)}
            defaultValue={this.props.currentMessage}
            data-testid={TEST_IDS.MESSAGE_FIELD}
          />
        </Field>
        <IconButton
          isPill={false}
          ignoreThemeOverride={true}
          onClick={this.sendChatMsg}
          className={sendButtonClasses}
          focusInset={true}
        >
          <SendChatIcon />
        </IconButton>
      </div>
    )
  }

  sendChatMsg = (e) => {
    if (_.isEmpty(this.props.currentMessage)) return
    this.props.sendMsg(this.props.currentMessage)
    this.props.onSend(e)
  }

  handleChange = (e) => {
    this.props.handleChatBadgeMessageChange(e.target.value)
  }

  render = () => {
    return (
      <>
        <FrameStyle style={frameStyle} />
        <div
          data-testid={TEST_IDS.CHAT_BADGE}
          className={classNames({
            [styles.container]: true,
            [styles.containerForWidget]: !this.props.isPreviewer,
          })}
        >
          {this.renderSplashDisplay()}
          {this.renderInputContainer()}
          {this.renderMinimizeButton()}
        </div>
      </>
    )
  }
}

const actionCreators = {
  sendMsg: sendChatBadgeMessage,
  handleChatBadgeMessageChange,
  handleChatBadgeMinimize,
  chatBadgeClicked,
}

export default connect(mapStateToProps, actionCreators, null, { forwardRef: true })(ChatBadge)
