/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */

var classSet = React.addons.classSet;

export var Launcher = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
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
      'Button Button--launcher Arrange-sizeFill u-textCenter u-tableCell': true
    }),
        iconClasses = classSet({
      'u-inlineBlock Icon ': true
    });

    return (
      /* jshint quotmark: false */
      <div
        onClick={this.props.onClick}
        onTouchEnd={this.props.onClick}
        className='Arrange Arrange--middle'>
          <div className={buttonClasses}>
            <i className={iconClasses + this.state.icon} />
            {this.props.message}
          </div>
      </div>
    );
  }
});
