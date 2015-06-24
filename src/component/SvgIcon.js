import React from 'react/addons';

var icons = {
      'Icon--back': require('../asset/icons/widget-icon_back.svg'),
      'Icon--close': require('../asset/icons/widget-icon_close.svg'),
      'Icon--chat': require('../asset/icons/widget-icon_chat.svg'),
      'Icon--help': require('../asset/icons/widget-icon_help.svg'),
      'Icon--search': require('../asset/icons/widget-icon_search.svg'),
      'Icon--zendesk': require('../asset/icons/widget-icon_zendesk.svg'),
      'Icon': require('../asset/icons/widget-icon_help.svg')
    };

export var SVGIcon = React.createClass({
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
        iconClasses = `SVGIcon SVG${this.props.type} `;

    return (
      <span
        className={iconClasses + this.props.className}
        dangerouslySetInnerHTML={{__html: icon}}
      />
    );
  }

});