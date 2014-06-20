/** @jsx React.DOM */
module React from 'react/addons'; /* jshint ignore:line */

var classSet = React.addons.classSet;

export var Launcher = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
    updateFrameSize: React.PropTypes.func,
    position: React.PropTypes.string,
    message: React.PropTypes.string,
    icon: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      icon: this.props.icon
    };
  },

  changeIcon: function(icon) {
    this.setState({
      icon: icon
    });
  },

  render: function() {
    var buttonClasses = classSet({
          'Button Button--launcher u-textCenter u-inlineBlock': true
        }),
        iconClasses = classSet({
          'u-inlineBlock Icon ': true
        });

    if (this.props.updateFrameSize) {
      setTimeout(function() {
        this.props.updateFrameSize(); 
      }.bind(this), 0);
    }

    return (
      /* jshint quotmark: false */
      <div className={buttonClasses}
        onClick={this.props.onClick}
        onTouchEnd={this.props.onClick}
        style={{'white-space': 'nowrap'}}>
        <i className={iconClasses + this.state.icon} />
        {this.props.message}
      </div>
    );
  }
});
