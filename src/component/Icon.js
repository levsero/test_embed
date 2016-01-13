import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { isMobileBrowser } from 'utility/devices';

const icons = {
  'Icon--link': require('icons/widget-icon_link.svg'),
  'Icon--back': require('icons/widget-icon_back.svg'),
  'Icon--close': require('icons/widget-icon_close.svg'),
  'Icon--chat': require('icons/widget-icon_chat.svg'),
  'Icon--help': require('icons/widget-icon_help.svg'),
  'Icon--tick': require('icons/widget-icon_tick.svg'),
  'Icon--check': require('icons/widget-icon_checkboxCheck.svg'),
  'Icon--search': require('icons/widget-icon_search.svg'),
  'Icon--zendesk': require('icons/widget-icon_zendesk.svg'),
  'Icon--caret': require('icons/widget-icon_caret.svg'),
  'Icon--avatar': require('icons/widget-icon_avatar.svg'),
  'Icon--clearInput': require('icons/widget-icon_clearInput.svg'),
  'Icon': require('icons/widget-icon_help.svg')
};

export class Icon extends Component {
  render() {
    const icon = icons[this.props.type];
    const iconClasses = classNames({
      [`Icon ${this.props.type} ${this.props.className}`]: true,
      'is-mobile': this.props.isMobile
    });

    return (
      <span
        {...this.props}
        className={iconClasses}
        dangerouslySetInnerHTML={{__html: icon}} />
    );
  }
}

Icon.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  isMobile: PropTypes.bool
};

Icon.defaultProps = {
  type: '',
  className: '',
  isMobile: isMobileBrowser()
};
