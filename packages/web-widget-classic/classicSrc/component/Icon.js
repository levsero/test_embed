import { ICONS } from 'classicSrc/constants/shared'
import { triggerOnEnter } from 'classicSrc/util/keyboard'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { isMobileBrowser } from '@zendesk/widget-shared-services/util/devices'
import { locals as styles } from './Icon.scss'

const icons = {
  Icon: require('classicSrc/asset/icons/widget-icon_help.svg'),
  [ICONS.DASH]: require('classicSrc/asset/icons/widget-icon_dash.svg'),
  [ICONS.ERROR_FILL]: require('@zendeskgarden/svg-icons/src/14/error-fill.svg'),
  [ICONS.SEND_CHAT]: require('classicSrc/asset/icons/widget-icon_sendChat.svg'),
  [ICONS.AGENT_AVATAR]: require('classicSrc/asset/icons/widget-icon_avatar.svg'),
  'Icon--clock-stroke': require('@zendeskgarden/svg-icons/src/16/clock-stroke.svg'),
  [ICONS.AVATAR]: require('classicSrc/asset/icons/widget-icon_concierge.svg'),
  [ICONS.CC_SUPPORT]: require('classicSrc/asset/icons/widget-icon_channelChoice-contactForm.svg'),
  [ICONS.CC_TALK]: require('classicSrc/asset/icons/widget-icon_channelChoice-talk.svg'),
  [ICONS.CC_CLICK_TO_CALL]: require('classicSrc/embeds/talk/icons/channel_choice_click_to_call.svg'),
  [ICONS.CHAT]: require('classicSrc/asset/icons/widget-icon_chat.svg'),
  'Icon--checkmark-fill': require('@zendeskgarden/svg-icons/src/14/checkmark-fill.svg'),
  'Icon--chevron-left-fill': require('@zendeskgarden/svg-icons/src/16/chevron-left-fill.svg'),
  'Icon--chevron-right-fill': require('@zendeskgarden/svg-icons/src/16/chevron-right-fill.svg'),
  'Icon--close': require('@zendeskgarden/svg-icons/src/16/x-stroke.svg'),
  'Icon--launcher-talk': require('classicSrc/asset/icons/widget-icon_launcher-talk.svg'),
  'Icon--image-stroke': require('@zendeskgarden/svg-icons/src/16/image-stroke.svg'),
  'Icon--mini-tick': require('@zendeskgarden/svg-icons/src/12/check-sm-stroke.svg'),
  'Icon--preview-default': require('@zendeskgarden/svg-icons/src/26/file.svg'),
  'Icon--preview-document': require('@zendeskgarden/svg-icons/src/26/file-document.svg'),
  'Icon--preview-error': require('@zendeskgarden/svg-icons/src/26/file-error.svg'),
  'Icon--preview-image': require('@zendeskgarden/svg-icons/src/26/file-image.svg'),
  'Icon--preview-pdf': require('@zendeskgarden/svg-icons/src/26/file-pdf.svg'),
  'Icon--preview-presentation': require('@zendeskgarden/svg-icons/src/26/file-presentation.svg'),
  'Icon--preview-spreadsheet': require('@zendeskgarden/svg-icons/src/26/file-spreadsheet.svg'),
  'Icon--preview-zip': require('@zendeskgarden/svg-icons/src/26/file-zip.svg'),
  'Icon--remove': require('@zendeskgarden/svg-icons/src/14/remove.svg'),
  'Icon--sound-off': require('classicSrc/asset/icons/widget-icon_sound_off.svg'),
  'Icon--sound-on': require('classicSrc/asset/icons/widget-icon_sound_on.svg'),
  'Icon--thumbDown': require('@zendeskgarden/svg-icons/src/16/thumbs-down-stroke.svg'),
  'Icon--thumbUp': require('@zendeskgarden/svg-icons/src/16/thumbs-up-stroke.svg'),
  'Icon--zendesk': require('classicSrc/asset/icons/widget-icon_zendesk.svg'),
  'Icon--trash-fill': require('@zendeskgarden/svg-icons/src/16/trash-fill.svg'),
  [ICONS.CC_CHAT]: require('classicSrc/asset/icons/widget-icon_channelChoice-chat.svg'),
  'Icon--previous': require('@zendeskgarden/svg-icons/src/14/previous.svg'),
}

export class Icon extends Component {
  static propTypes = {
    className: PropTypes.string,
    isMobile: PropTypes.bool,
    onClick: PropTypes.func,
    type: PropTypes.string,
    flipX: PropTypes.bool,
  }

  static defaultProps = {
    isMobile: isMobileBrowser(),
    flipX: false,
  }

  render() {
    const { type, onClick, className, isMobile, flipX } = this.props
    const IconSVG = icons[type].default
    const iconClasses = classNames(styles.container, className, type, {
      [styles.mobile]: isMobile,
      [styles.flipX]: flipX,
    })

    const spanProps = onClick
      ? {
          tabIndex: 0,
          role: 'button',
          onKeyDown: triggerOnEnter(onClick),
          onClick: onClick,
        }
      : {}

    return (
      <span {...spanProps} data-testid={type} className={iconClasses} type={type}>
        <IconSVG aria-hidden={'true'} />
      </span>
    )
  }
}
