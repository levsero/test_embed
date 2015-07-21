import React from 'react/addons';

var icons = {
      'Icon--link': require('icons/widget-icon_link.svg'),
      'Icon--back': require('icons/widget-icon_back.svg'),
      'Icon--close': require('icons/widget-icon_close.svg'),
      'Icon--chat': require('icons/widget-icon_chat.svg'),
      'Icon--help': require('icons/widget-icon_help.svg'),
      'Icon--tick': require('icons/widget-icon_tick.svg'),
      'Icon--checkbox-check': require('icons/widget-icon_checkbox-check.svg'),
      'Icon--search': require('icons/widget-icon_search.svg'),
      'Icon--zendesk': require('icons/widget-icon_zendesk.svg'),
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
    var icon = icons[this.props.type],
        iconClasses = `Icon ${this.props.type} ${this.props.className}`;

    return (
      <span
        {...this.props}
        className={iconClasses + this.props.className}
        dangerouslySetInnerHTML={{__html: icon}}
      />
    );
  }

});
