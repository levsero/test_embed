import React from 'react/addons';

import { isMobileBrowser } from 'utility/devices';

const classSet = React.addons.classSet;

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
  'Icon': require('icons/widget-icon_help.svg')
};

export var Icon = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    className: React.addons.classSet
  },

  getDefaultProps() {
    return {
      type: '',
      className: ''
    };
  },

  render: function() {
    const icon = icons[this.props.type];
    const iconClasses = classSet({
      [`Icon ${this.props.type} ${this.props.className}`]: true,
      'is-mobile': isMobileBrowser()
    });

    return (
      <span
        {...this.props}
        className={iconClasses}
        dangerouslySetInnerHTML={{__html: icon}} />
    );
  }

});
