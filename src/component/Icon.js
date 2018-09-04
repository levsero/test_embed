import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { isMobileBrowser } from 'utility/devices';
import { i18n } from 'service/i18n';
import { ICONS } from 'constants/shared';
import { locals as styles } from './Icon.scss';
import { keyCodes } from 'utility/keyboard';
import classNames from 'classnames';

const icons = {
  'Icon': require('icons/widget-icon_help.svg'),
  [ICONS.BACK]: require('icons/widget-icon_back.svg'),
  [ICONS.DASH]: require('icons/widget-icon_dash.svg'),
  [ICONS.ELLIPSIS]: require('icons/widget-icon_ellipsis.svg'),
  [ICONS.END_CHAT]: require('icons/widget-icon_endChat.svg'),
  [ICONS.ERROR_FILL]: require('@zendeskgarden/svg-icons/src/14/error-fill.svg'),
  [ICONS.MENU]: require('icons/widget-icon_menu.svg'),
  [ICONS.PAPERCLIP_SMALL]: require('@zendeskgarden/svg-icons/src/14/attachment.svg'),
  [ICONS.SEND_CHAT]: require('icons/widget-icon_sendChat.svg'),
  'Icon--agent-avatar': require('icons/widget-icon_avatar.svg'),
  'Icon--avatar': require('icons/widget-icon_concierge.svg'),
  'Icon--channelChoice-contactForm': require('icons/widget-icon_channelChoice-contactForm.svg'),
  'Icon--channelChoice-talk': require('icons/widget-icon_channelChoice-talk.svg'),
  'Icon--chat': require('icons/widget-icon_chat.svg'),
  'Icon--checkmark-fill': require('@zendeskgarden/svg-icons/src/14/checkmark-fill.svg'),
  'Icon--clearInput': require('icons/widget-icon_clearInput.svg'),
  'Icon--close': require('@zendeskgarden/svg-icons/src/16/x-stroke.svg'),
  'Icon--error': require('@zendeskgarden/svg-icons/src/14/error.svg'),
  'Icon--launcher-talk': require('icons/widget-icon_launcher-talk.svg'),
  'Icon--arrow-down': require('icons/widget-icon_arrow-down-stroke.svg'),
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
  'Icon--search': require('icons/widget-icon_search.svg'),
  'Icon--sound-off': require('icons/widget-icon_sound_off.svg'),
  'Icon--sound-on': require('icons/widget-icon_sound_on.svg'),
  'Icon--thumbDown': require('@zendeskgarden/svg-icons/src/16/thumbs-down-stroke.svg'),
  'Icon--thumbUp': require('@zendeskgarden/svg-icons/src/16/thumbs-up-stroke.svg'),
  'Icon--tick': require('icons/widget-icon_tick.svg'),
  'Icon--zendesk': require('icons/widget-icon_zendesk.svg'),
  'Icon--facebook': require('icons/widget-icon_facebook.svg'),
  'Icon--google': require('icons/widget-icon_google-plus.svg'),
  'Icon--trash-fill': require('@zendeskgarden/svg-icons/src/16/trash-fill.svg'),
  'Icon--channelChoice-chat': require('icons/widget-icon_channelChoice-chat.svg'),
  'Icon--previous': require('@zendeskgarden/svg-icons/src/14/previous.svg'),
  [ICONS.MENU]: require('icons/widget-icon_menu.svg'),
  [ICONS.SUCCESS_CONTACT_FORM]: require('icons/widget-icon_success_contactForm.svg'),
  [ICONS.SUCCESS_TALK]: require('icons/widget-icon_success_talk.svg'),
  [ICONS.TALK]: require('icons/widget-icon_talk.svg')
};

export class Icon extends Component {
  static propTypes = {
    className: PropTypes.string,
    isMobile: PropTypes.bool,
    onClick: PropTypes.func,
    type: PropTypes.string
  };

  static defaultProps = {
    isMobile: isMobileBrowser()
  };

  render() {
    const icon = icons[this.props.type];
    const iconClasses = classNames(
      styles.container,
      this.props.className,
      this.props.type,
      { [styles.mobile]: this.props.isMobile }
    );

    return (
      <span onClick={this.props.onClick}
        className={iconClasses}
        type={this.props.type}
        dangerouslySetInnerHTML={{__html: icon}} />
    );
  }
}

export class IconButton extends Component {
  static propTypes = {
    altText: PropTypes.string.isRequired,
    buttonClassName: PropTypes.string,
    disabled: PropTypes.bool,
    disableTooltip: PropTypes.bool,
    className: PropTypes.string,
    isMobile: PropTypes.bool,
    onClick: PropTypes.func,
    type: PropTypes.string.isRequired
  };

  static defaultProps = {
    className: '',
    buttonClassName: '',
    disabled: false,
    disableTooltip: false,
    isMobile: isMobileBrowser(),
    onClick: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      showTooltip: false
    };
  }

  handleMouseOver = () => {
    this.setState({ showTooltip: true });
  }

  handleMouseOut = () => {
    this.setState({ showTooltip: false });
  }

  handleKeyDown = (e) => {
    if (e.keyCode === keyCodes.ENTER) {
      this.props.onClick(e, true);
    }
    e.stopPropagation(); // stops the onClick from also being called
  }

  render() {
    const {
      altText, buttonClassName, disabled, disableTooltip, onClick, ...iconProps
    } = this.props;

    const showTooltip = !disabled && !disableTooltip && this.state.showTooltip;
    const showTitle = !disabled && (disableTooltip || !this.state.showTooltip);
    const tooltipClass = i18n.isRTL() ? styles.tooltipRtl : styles.tooltip;
    const tooltipStyles = classNames(
      tooltipClass,
      {
        [styles.tooltipShown]: showTooltip,
        [styles.tooltipTransition]: showTooltip
      }
    );

    return (
      <div className={styles.wrapper}>
        <button
          type="button"
          className={`${buttonClassName} ${styles.button}`}
          onClick={onClick}
          onKeyDown={this.handleKeyDown}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          title={showTitle ? altText : null}>
          <Icon {...iconProps} />
          <span className={styles.altText}>
            {altText}
          </span>
        </button>
        <div className={tooltipStyles}>{altText}</div>
      </div>
    );
  }
}
