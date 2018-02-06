import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './Icon.scss';
import { isMobileBrowser } from 'utility/devices';

const icons = {
  'Icon': require('icons/widget-icon_help.svg'),
  'Icon--thumbUp': require('icons/widget-icon_thumb-up.svg'),
  'Icon--thumbDown': require('icons/widget-icon_thumb-down.svg'),
  'Icon--avatar': require('icons/widget-icon_concierge.svg'),
  'Icon--back': require('icons/widget-icon_back.svg'),
  'Icon--chevron': require('zd-svg-icons/src/14-chevron.svg'),
  'Icon--channelChoice-contactForm': require('icons/widget-icon_channelChoice-contactForm.svg'),
  'Icon--channelChoice-talk': require('icons/widget-icon_channelChoice-talk.svg'),
  'Icon--chat': require('icons/widget-icon_chat.svg'),
  'Icon--check': require('icons/widget-icon_checkboxCheck.svg'),
  'Icon--clearInput': require('icons/widget-icon_clearInput.svg'),
  'Icon--close': require('icons/widget-icon_close.svg'),
  'Icon--dash': require('icons/widget-icon_dash.svg'),
  'Icon--ellipsis': require('icons/widget-icon_ellipsis.svg'),
  'Icon--endChat': require('icons/widget-icon_endChat.svg'),
  'Icon--error': require('zd-svg-icons/src/14-error.svg'),
  'Icon--launcher-talk': require('icons/widget-icon_launcher-talk.svg'),
  'Icon--link': require('icons/widget-icon_link.svg'),
  'Icon--paperclip-large': require('zd-svg-icons/src/14-attachment.svg'),
  'Icon--paperclip-small': require('zd-svg-icons/src/14-attachment.svg'),
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
  'Icon--link-external': require('zd-svg-icons/src/14-link-external.svg')
};

export class Icon extends Component {
  static propTypes = {
    className: PropTypes.string,
    isMobile: PropTypes.bool,
    onClick: PropTypes.func,
    type: PropTypes.string
  };

  static defaultProps = {
    className: '',
    isMobile: isMobileBrowser(),
    onClick: () => {},
    type: ''
  };

  render = () => {
    const icon = icons[this.props.type];
    const deviceStyle = this.props.isMobile ? styles.mobile : '';
    const iconClasses = `
      ${this.props.type}
      ${this.props.className}
      ${deviceStyle}
    `;

    return (
      <span
        onClick={this.props.onClick}
        className={iconClasses}
        type={this.props.type}
        dangerouslySetInnerHTML={{__html: icon}} />
    );
  }
}
