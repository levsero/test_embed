import PropTypes from 'prop-types'
import { createRef, Component } from 'react'
import { connect } from 'react-redux'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { Icon } from 'src/component/Icon'
import WidgetLauncherTitle from 'src/component/launcher/WidgetLauncherTitle'
import { TEST_IDS, ICONS } from 'src/constants/shared'
import {
  getLauncherChatLabel,
  getLauncherTalkLabel,
  getLauncherLabel,
} from 'src/embeds/launcher/settings/selectors'
import { FrameStyle } from 'src/embeds/webWidget/components/BaseFrame/FrameStyleContext'
import { launcherClicked } from 'src/redux/modules/base/'
import { getActiveEmbed } from 'src/redux/modules/base/base-selectors'
import { getNotificationCount } from 'src/redux/modules/chat/chat-selectors'
import {
  getChatAvailable,
  getTalkOnline,
  getChatOfflineAvailable,
  getHelpCenterAvailable,
} from 'src/redux/modules/selectors'
import { getSettingsLauncherMobile } from 'src/redux/modules/settings/settings-selectors'
import { isCallbackEnabled } from 'src/redux/modules/talk/talk-selectors'
import { isSafari } from 'src/util/devices'
import { onNextTick } from 'src/util/utils'
import { locals as styles } from './WidgetLauncher.scss'

const baseLauncherStyle = {
  width: 240,
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeEmbed: getActiveEmbed(state),
    chatAvailable: getChatAvailable(state),
    helpCenterAvailable: getHelpCenterAvailable(state),
    talkOnline: getTalkOnline(state),
    callbackEnabled: isCallbackEnabled(state),
    notificationCount: getNotificationCount(state),
    chatOfflineAvailable: getChatOfflineAvailable(state),
    chatLabel: getLauncherChatLabel(state),
    launcherLabel: getLauncherLabel(state, ownProps.label),
    talkLabel: getLauncherTalkLabel(state),
    showLabelMobile: getSettingsLauncherMobile(state).labelVisible,
  }
}

class WidgetLauncher extends Component {
  static propTypes = {
    activeEmbed: PropTypes.string.isRequired,
    chatAvailable: PropTypes.bool.isRequired,
    helpCenterAvailable: PropTypes.bool.isRequired,
    talkOnline: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    notificationCount: PropTypes.number.isRequired,
    updateFrameTitle: PropTypes.func,
    launcherClicked: PropTypes.func.isRequired,
    chatOfflineAvailable: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool,
    launcherLabel: PropTypes.string.isRequired,
    chatLabel: PropTypes.string.isRequired,
    showLabelMobile: PropTypes.bool.isRequired,
    talkLabel: PropTypes.string.isRequired,
  }

  static defaultProps = {
    isMobile: false,
  }

  constructor(props, context) {
    super(props, context)

    this.container = createRef()
    this.state = {
      style: baseLauncherStyle,
    }
  }

  componentDidUpdate() {
    onNextTick(() => {
      if (!this.container.current) return

      // Check if the component has unmounted since we are updating state onNextTick
      if (this.hasUnmounted) return

      const newWidth = this.getBrowserSafeWidth(this.container.current)

      // If the container size has not changed, do nothing
      if (this.state.style.width === newWidth) return

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        style: {
          ...baseLauncherStyle,
          width: newWidth,
        },
      })
    })
  }

  componentWillUnmount() {
    this.hasUnmounted = true
  }

  getBrowserSafeWidth = (element) => {
    const width = element.getBoundingClientRect().width

    // Mitigate Safari visual bug by rounding launcher width up to nearest integer
    if (isSafari) return Math.ceil(width)

    return width
  }

  getLabel = () => {
    const {
      helpCenterAvailable,
      talkOnline,
      chatAvailable,
      launcherLabel,
      chatLabel,
      notificationCount,
      talkLabel,
    } = this.props

    if (notificationCount) {
      return notificationCount > 1
        ? i18n.t('embeddable_framework.chat.notification_multiple', {
            count: notificationCount,
          })
        : i18n.t('embeddable_framework.chat.notification')
    } else if (chatAvailable && talkOnline) {
      return launcherLabel
    } else if (chatAvailable && !helpCenterAvailable) {
      return chatLabel
    } else if (talkOnline && !helpCenterAvailable) {
      return talkLabel
    }
    return launcherLabel
  }

  getActiveEmbedLabel = () => {
    const {
      launcherLabel,
      chatAvailable,
      chatLabel,
      chatOfflineAvailable,
      activeEmbed,
      notificationCount,
      talkLabel,
    } = this.props

    if (notificationCount) {
      return notificationCount > 1
        ? i18n.t('embeddable_framework.chat.notification_multiple', {
            count: notificationCount,
          })
        : i18n.t('embeddable_framework.chat.notification')
    }

    switch (activeEmbed) {
      case 'ticketSubmissionForm':
      case 'helpCenterForm':
        return launcherLabel
      case 'chat':
        if (chatOfflineAvailable) {
          return launcherLabel
        }
        if (chatAvailable) {
          return chatLabel
        }
        return this.getLabel()
      case 'talk':
        return talkLabel
      default:
        return this.getLabel()
    }
  }

  getTitle = () => {
    const defaultTitle = i18n.t('embeddable_framework.launcher.frame.title')

    switch (this.props.activeEmbed) {
      case 'chat':
        if (this.props.chatAvailable) return i18n.t('embeddable_framework.launcher.chat.title')
        return defaultTitle
      case 'talk':
        return i18n.t('embeddable_framework.launcher.talk.title')
      default:
        return defaultTitle
    }
  }

  getIconType = () => {
    const { talkOnline, chatAvailable, chatOfflineAvailable } = this.props

    if (chatAvailable && talkOnline) return 'Icon'
    if (chatAvailable && !chatOfflineAvailable) return ICONS.CHAT
    if (talkOnline) return 'Icon--launcher-talk'

    return 'Icon'
  }

  getActiveEmbedIconType = () => {
    switch (this.props.activeEmbed) {
      case 'ticketSubmissionForm':
        return 'Icon'
      case 'chat':
        if (this.props.chatAvailable && !this.props.chatOfflineAvailable) return ICONS.CHAT
        return this.getIconType()
      case 'talk':
        return 'Icon--launcher-talk'
      default:
        return this.getIconType()
    }
  }

  render = () => {
    const { isMobile } = this.props
    const baseMobileClasses = isMobile ? styles.wrapperMobile : ''
    const shouldShowMobileClasses =
      isMobile && !(this.props.notificationCount > 0) && !this.props.showLabelMobile
    const iconMobileClasses = shouldShowMobileClasses ? styles.iconMobile : ''
    const labelMobileClasses = shouldShowMobileClasses ? styles.labelMobile : ''
    const type = this.getActiveEmbedIconType()
    /**
     * - Question mark needs to be flipped in RTL languages except Hebrew: https://zendesk.atlassian.net/browse/CE-4044
     * - Chat icon needs to be flipped in all RTL languages: https://zendesk.atlassian.net/browse/CE-4045
     */
    const locale = i18n.getLocale()
    const isRTL = i18n.isRTL()
    const shouldFlipX =
      (type === 'Icon' && isRTL && locale !== 'he') || (type === ICONS.CHAT && isRTL)

    return (
      <>
        <FrameStyle style={this.state.style} />
        <div ref={this.container}>
          <button
            data-testid={TEST_IDS.LAUNCHER}
            aria-label={this.getActiveEmbedLabel()}
            className={`${styles.wrapper} ${baseMobileClasses}`}
            onClick={(e) => {
              this.props.onClick(e)
              this.props.launcherClicked()
            }}
          >
            <Icon
              type={type}
              flipX={shouldFlipX}
              className={`${styles.icon} ${iconMobileClasses}`}
            />
            <span
              className={`${styles.label} ${labelMobileClasses}`}
              data-testid={TEST_IDS.LAUNCHER_LABEL}
            >
              {this.getActiveEmbedLabel()}
            </span>
          </button>
        </div>
        <WidgetLauncherTitle
          title={this.getTitle()}
          onTitleChange={(title) => {
            this.props.updateFrameTitle?.(title)
          }}
        />
      </>
    )
  }
}

const actionCreators = {
  launcherClicked,
}

export default connect(mapStateToProps, actionCreators, null, { forwardRef: true })(WidgetLauncher)
