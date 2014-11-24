/** @jsx React.DOM */
module React from 'react/addons'; /* jshint ignore:line */
import { isMobileBrowser } from 'utility/devices';

var classSet = React.addons.classSet;

export var Launcher = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
    updateFrameSize: React.PropTypes.func.isRequired,
    position: React.PropTypes.string,
    label: React.PropTypes.string,
    icon: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      icon: this.props.icon,
      label: this.props.label,
      active: false,
      hasUnreadMessages: false
    };
  },

  setActive: function(value) {
    this.setState({
      active: value
    });
  },

  setLabel: function(label) {
    this.setState({
      label: label
    });
  },

  setIcon: function(icon) {
    this.setState({
      icon: icon
    });
  },

  render: function() {
    var displayIcon,
        displayLabel,
        buttonClasses = classSet({
          'Button Button--launcher Button--cta': true,
          'is-mobile': isMobileBrowser(),
          'u-userBackgroundColor Arrange Arrange--middle': !this.state.active,
          'u-isActionable u-textLeft u-inlineBlock u-textNoWrap': true,
          'Button--launcherActive': this.state.active
        }),
        iconClasses = classSet({
          // spaces needed for class concatenation
          'Arrange-sizeFit Icon Icon--launcher u-textInheritColor u-inlineBlock ': true,
          'Icon--active u-textCenter Icon--cross ': this.state.active,
          'u-paddingHN ': isMobileBrowser() && !this.state.hasUnreadMessages
        }),
        labelClasses = classSet({
          'u-textInheritColor u-inlineBlock': true,
          'Arrange-sizeFit': !this.state.active,
          'u-isHidden': isMobileBrowser() && !this.state.hasUnreadMessages
        });

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(5, 0), 0);
    }

    /* jshint laxbreak:true */
    displayIcon = (!this.state.active)
                ? this.state.icon
                : '';
    displayLabel = (!this.state.active)
                ? this.state.label
                : '';

    return (
      /* jshint quotmark: false */
      <div className={buttonClasses}
        onClick={this.props.onClick}
        onTouchEnd={this.props.onClick}>
        <i className={iconClasses + displayIcon} />
        <span className={labelClasses}>{displayLabel}</span>
      </div>
    );
  }
});
