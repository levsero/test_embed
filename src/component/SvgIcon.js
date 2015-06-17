import React from 'react/addons';

var icons = {
      'Icon--chat': require('../asset/icons/widget-icon_chat.svg'),
      'Icon--help': require('../asset/icons/widget-icon_help.svg'),
      'Icon--search': require('../asset/icons/widget-icon_search.svg'),
      'Icon': require('../asset/icons/widget-icon_help.svg')
    };

export var SVGIcon = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    className: React.addons.classSet
  },

  // getInitialState: function() {
  //   return {
  //     type: this.props.type,
  //     className: this.props.className || classSet({})
  //   };
  // },

  render: function() {
    var icon = icons[this.props.type],
        iconClasses = `SVGIcon SVG${this.props.type} `;

    console.log(this.props.type);
    console.log(iconClasses);
    console.log(this.props.className);
    // debugger;
    return (
      <span
        className={iconClasses + this.props.className}
        dangerouslySetInnerHTML={{__html: icon}}
      />
    );
  }

});