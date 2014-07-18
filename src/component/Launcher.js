/** @jsx React.DOM */
module React from 'react/addons'; /* jshint ignore:line */

var classSet = React.addons.classSet;

export var Launcher = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
    updateFrameSize: React.PropTypes.func.isRequired,
    position: React.PropTypes.string,
    message: React.PropTypes.string,
    icon: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      icon: this.props.icon,
      message: this.props.message
    };
  },

  setMessage: function(message) {
    this.setState({
      message: message
    });
  },

  setIcon: function(icon) {
    this.setState({
      icon: icon
    });
  },

  render: function() {
    var buttonClasses = classSet({
          'Button Button--launcher Button--cta': true,
          'Arrange Arrange--middle': true,
          'u-isActionable u-textLeft u-inlineBlock u-textNoWrap': true,
          'Button--launcherActive': !this.state.message
        }),
        iconClasses = classSet({
          // spaces needed for class concatenation
          'Arrange-sizeFit Icon u-textInheritColor ': true,
          'Icon--active u-block ': !this.state.message
        }),
        messageClasses = classSet({
          'u-textInheritColor': true,
          'Arrange-sizeFit': this.state.message
        });

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(5, 0), 0);
    }

    return (
      /* jshint quotmark: false */
      <div className={buttonClasses}
        onClick={this.props.onClick}
        onTouchEnd={this.props.onClick}>
        <i className={iconClasses + this.state.icon} />
        <span className={messageClasses}>{this.state.message}</span>
      </div>
    );
  }
});
