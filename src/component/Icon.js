import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { isMobileBrowser } from 'utility/devices'
import { ICONS } from 'constants/shared'
import { locals as styles } from './Icon.scss'
import { triggerOnEnter } from 'utility/keyboard'
import classNames from 'classnames'

const icons = {
  Icon: require('icons/widget-icon_help.svg'),
  [ICONS.BACK]: require('icons/widget-icon_back.svg'),
  [ICONS.POPOUT]: require('icons/widget-icon_popout.svg'),
  [ICONS.DASH]: require('icons/widget-icon_dash.svg'),
  [ICONS.ELLIPSIS]: require('icons/widget-icon_ellipsis.svg'),
  [ICONS.END_CHAT]: require('icons/widget-icon_endChat.svg'),
  [ICONS.ERROR_FILL]: require('@zendeskgarden/svg-icons/src/14/error-fill.svg'),
  [ICONS.MENU]: require('icons/widget-icon_menu.svg'),
  [ICONS.PAPERCLIP_SMALL]: require('@zendeskgarden/svg-icons/src/14/attachment.svg'),
  [ICONS.SEND_CHAT]: require('icons/widget-icon_sendChat.svg'),
  'Icon--agent-avatar': require('icons/widget-icon_avatar.svg'),
  'Icon--answerBot': require('icons/widget-icon_answerBot.svg'),
  'Icon--clock-stroke': require('@zendeskgarden/svg-icons/src/16/clock-stroke.svg'),
  'Icon--article': require('icons/widget-icon_article.svg'),
  'Icon--avatar': require('icons/widget-icon_concierge.svg'),
  'Icon--channelChoice-contactForm': require('icons/widget-icon_channelChoice-contactForm.svg'),
  'Icon--channelChoice-talk': require('icons/widget-icon_channelChoice-talk.svg'),
  'Icon--chat': require('icons/widget-icon_chat.svg'),
  'Icon--checkmark-fill': require('@zendeskgarden/svg-icons/src/14/checkmark-fill.svg'),
  'Icon--chevron-left-fill': require('@zendeskgarden/svg-icons/src/16/chevron-left-fill.svg'),
  'Icon--chevron-right-fill': require('@zendeskgarden/svg-icons/src/16/chevron-right-fill.svg'),
  'Icon--close': require('@zendeskgarden/svg-icons/src/16/x-stroke.svg'),
  'Icon--launcher-talk': require('icons/widget-icon_launcher-talk.svg'),
  'Icon--arrow-down': require('icons/widget-icon_arrow-down-stroke.svg'),
  'Icon--image-stroke': require('@zendeskgarden/svg-icons/src/16/image-stroke.svg'),
  'Icon--link-external': require('@zendeskgarden/svg-icons/src/14/link-external.svg'),
  'Icon--mini-tick': require('@zendeskgarden/svg-icons/src/12/check-sm-stroke.svg'),
  'Icon--paperclip-large': require('@zendeskgarden/svg-icons/src/14/attachment.svg'),
  'Icon--preview-default': require('@zendeskgarden/svg-icons/src/26/file.svg'),
  'Icon--preview-document': require('@zendeskgarden/svg-icons/src/26/file-document.svg'),
  'Icon--preview-error': require('@zendeskgarden/svg-icons/src/26/file-error.svg'),
  'Icon--preview-image': require('@zendeskgarden/svg-icons/src/26/file-image.svg'),
  'Icon--preview-pdf': require('@zendeskgarden/svg-icons/src/26/file-pdf.svg'),
  'Icon--preview-presentation': require('@zendeskgarden/svg-icons/src/26/file-presentation.svg'),
  'Icon--preview-spreadsheet': require('@zendeskgarden/svg-icons/src/26/file-spreadsheet.svg'),
  'Icon--preview-zip': require('@zendeskgarden/svg-icons/src/26/file-zip.svg'),
  'Icon--remove': require('@zendeskgarden/svg-icons/src/14/remove.svg'),
  'Icon--sound-off': require('icons/widget-icon_sound_off.svg'),
  'Icon--sound-on': require('icons/widget-icon_sound_on.svg'),
  'Icon--thumbDown': require('@zendeskgarden/svg-icons/src/16/thumbs-down-stroke.svg'),
  'Icon--thumbUp': require('@zendeskgarden/svg-icons/src/16/thumbs-up-stroke.svg'),
  'Icon--zendesk': require('icons/widget-icon_zendesk.svg'),
  'Icon--facebook': require('icons/widget-icon_facebook.svg'),
  'Icon--google': require('icons/widget-icon_google.svg'),
  'Icon--messenger': require('icons/widget-icon_messenger.svg'),
  'Icon--twitter': require('icons/widget-icon_twitter.svg'),
  'Icon--trash-fill': require('@zendeskgarden/svg-icons/src/16/trash-fill.svg'),
  'Icon--channelChoice-chat': require('icons/widget-icon_channelChoice-chat.svg'),
  'Icon--previous': require('@zendeskgarden/svg-icons/src/14/previous.svg'),
  [ICONS.MENU]: require('icons/widget-icon_menu.svg'),
  [ICONS.SUCCESS_CONTACT_FORM]: require('icons/widget-icon_success_contactForm.svg')
}

export class Icon extends Component {
  static propTypes = {
    className: PropTypes.string,
    isMobile: PropTypes.bool,
    onClick: PropTypes.func,
    type: PropTypes.string,
    flipX: PropTypes.bool
  }

  static defaultProps = {
    isMobile: isMobileBrowser(),
    flipX: false
  }

  render() {
    const { type, onClick, className, isMobile, flipX } = this.props
    const IconSVG = icons[type].default
    const iconClasses = classNames(styles.container, className, type, {
      [styles.mobile]: isMobile,
      [styles.flipX]: flipX
    })

    const spanProps = onClick
      ? {
          tabIndex: 0,
          role: 'button',
          onKeyDown: triggerOnEnter(onClick),
          onClick: onClick
        }
      : {}

    return (
      <span {...spanProps} data-testid={type} className={iconClasses} type={type}>
        <IconSVG aria-hidden={'true'} />
      </span>
    )
  }
}
