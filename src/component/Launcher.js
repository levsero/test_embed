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
      message: this.props.message,
      display: true
    };
  },

  setDisplay: function(value) {
    this.setState({
      display: value
    });
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
    var displayIcon,
        displayMessage,
        buttonClasses = classSet({
          'Button Button--launcher Button--cta': true,
          'Arrange Arrange--middle': true,
          'u-isActionable u-textLeft u-inlineBlock u-textNoWrap': true,
          'Button--launcherActive': !this.state.display
        }),
        iconClasses = classSet({
          // spaces needed for class concatenation
          'Arrange-sizeFit Icon u-textInheritColor ': true,
          'Icon--active u-block Icon--cross ': !this.state.display
        }),
        messageClasses = classSet({
          'u-textInheritColor': true,
          'Arrange-sizeFit': this.state.display
        });

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(5, 0), 0);
    }

    /* jshint laxbreak:true */
    displayIcon = (this.state.display)
                ? this.state.icon
                : '';
    displayMessage = (this.state.display)
                ? this.state.message
                : '';

    return (
      /* jshint quotmark: false */
      <div className={buttonClasses}
        onClick={this.props.onClick}
        onTouchEnd={this.props.onClick}>
        <i className={iconClasses + displayIcon} />
        <span className={messageClasses}>{displayMessage}</span>
      </div>
    );
  }
});
