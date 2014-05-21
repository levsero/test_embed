/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */

var classSet = React.addons.classSet;

export var Launcher = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
    position: React.PropTypes.string
  },

  render: function() {
    var classes = classSet({
      'Button Button--launcher Arrange-sizeFill u-textCenter u-tableCell': true,
      'Button--launcherAlt': this.props.position === 'left'
    });

    return (
      /* jshint quotmark: false */
      <div onClick={this.props.onClick} className='Arrange Arrange--middle'>
        <div className={classes}>?</div>
      </div>
    );
  }
});
