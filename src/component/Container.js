import React from 'react/addons';

var classSet = React.addons.classSet;

export var Container = React.createClass({
  render() {
    /* jshint quotmark:false */
    var containerClasses = classSet({
          'Container': true,
          'Container--popover': !this.props.fullscreen,
          'Container--fullscreen': this.props.fullscreen,
          'u-posRelative': true
        });

    return (
      <div className={containerClasses}>
        {this.props.children}
      </div>
    );
  }
});
