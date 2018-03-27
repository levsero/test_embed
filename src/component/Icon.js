import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { isMobileBrowser } from 'utility/devices';
import { ICONS } from 'constants/shared';
import { locals as styles } from './Icon.scss';
import classNames from 'classnames';

const icons = {
  'Icon': require('icons/widget-icon_help.svg'),
  'Icon--thumbUp': require('icons/widget-icon_thumb-up.svg'),
  'Icon--thumbDown': require('icons/widget-icon_thumb-down.svg'),
  'Icon--agent-avatar': require('icons/widget-icon_avatar.svg'),
  'Icon--avatar': require('icons/widget-icon_concierge.svg'),
  [ICONS.BACK]: require('icons/widget-icon_back.svg'),
  'Icon--chevron': require('zd-svg-icons/src/14-chevron.svg'),
  'Icon--channelChoice-contactForm': require('icons/widget-icon_channelChoice-contactForm.svg'),
  'Icon--channelChoice-talk': require('icons/widget-icon_channelChoice-talk.svg'),
  'Icon--chat': require('icons/widget-icon_chat.svg'),
  'Icon--check': require('icons/widget-icon_checkboxCheck.svg'),
  'Icon--clearInput': require('icons/widget-icon_clearInput.svg'),
  'Icon--close': require('icons/widget-icon_close.svg'),
  [ICONS.DASH]: require('icons/widget-icon_dash.svg'),
  [ICONS.ELLIPSIS]: require('icons/widget-icon_ellipsis.svg'),
  [ICONS.SEND_CHAT]: require('icons/widget-icon_sendChat.svg'),
  [ICONS.END_CHAT]: require('icons/widget-icon_endChat.svg'),
  'Icon--error': require('zd-svg-icons/src/14-error.svg'),
  'Icon--launcher-talk': require('icons/widget-icon_launcher-talk.svg'),
  'Icon--link': require('icons/widget-icon_link.svg'),
  'Icon--paperclip-large': require('zd-svg-icons/src/14-attachment.svg'),
  [ICONS.PAPERCLIP_SMALL]: require('zd-svg-icons/src/14-attachment.svg'),
  'Icon--preview-default': require('zd-svg-icons/src/26-file.svg'),
  'Icon--preview-pdf': require('zd-svg-icons/src/26-file-pdf.svg'),
  'Icon--preview-presentation': require('zd-svg-icons/src/26-file-presentation.svg'),
  'Icon--preview-spreadsheet': require('zd-svg-icons/src/26-file-spreadsheet.svg'),
  'Icon--preview-document': require('zd-svg-icons/src/26-file-document.svg'),
  'Icon--preview-image': require('zd-svg-icons/src/26-file-image.svg'),
  'Icon--preview-zip': require('zd-svg-icons/src/26-file-zip.svg'),
  'Icon--preview-error': require('zd-svg-icons/src/26-file-error.svg'),
  'Icon--search': require('icons/widget-icon_search.svg'),
  'Icon--tick': require('icons/widget-icon_tick.svg'),
  'Icon--zendesk': require('icons/widget-icon_zendesk.svg'),
  'Icon--sound-on': require('icons/widget-icon_sound_on.svg'),
  'Icon--sound-off': require('icons/widget-icon_sound_off.svg'),
  'Icon--link-external': require('zd-svg-icons/src/14-link-external.svg'),
  'Icon--checkmark-fill': require('zd-svg-icons/src/14-checkmark-fill.svg'),
  'Icon--remove': require('zd-svg-icons/src/14-remove.svg'),
  [ICONS.MENU]: require('icons/widget-icon_menu.svg'),
  [ICONS.ERROR_FILL]: require('zd-svg-icons/src/14-error-fill.svg')
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
      this.props.className,
      this.props.type,
      { [styles.mobile]: this.props.isMobile }
    );

    return (
      <span
        onClick={this.props.onClick}
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
    className: PropTypes.string,
    isMobile: PropTypes.bool,
    onClick: PropTypes.func,
    type: PropTypes.string.isRequired
  };

  static defaultProps = {
    className: '',
    buttonClassName: '',
    isMobile: isMobileBrowser(),
    onClick: () => {}
  };

  render() {
    const { altText, buttonClassName, onClick, ...iconProps } = this.props;

    return (
      <button
        type="button"
        className={`${buttonClassName} ${styles.button}`}
        onClick={onClick}
        title={altText}
      >
        <Icon {...iconProps} />
        <span className={styles.altText}>
          {altText}
        </span>
      </button>
    );
  }
}
