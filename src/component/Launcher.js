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
          'Button Button--launcher u-textCenter u-inlineBlock u-textNoWrap': true,
          'Button--launcherActive': !this.state.message
        }),
        iconClasses = classSet({
          // spaces needed for class concatenation
          'u-inlineBlock Icon ': true,
          'Icon--active ': !this.state.message
        });

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(), 0);
    }

    return (
      /* jshint quotmark: false */
      <div className={buttonClasses}
        onClick={this.props.onClick}
        onTouchEnd={this.props.onClick}>
        <i className={iconClasses + this.state.icon} />
        <span className='u-inlineBlock u-alignTop'>{this.state.message}</span>
      </div>
    );
  }
});
