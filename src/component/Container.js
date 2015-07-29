import React from 'react/addons';

const classSet = React.addons.classSet;

export var Container = React.createClass({
  render() {
    const containerClasses = classSet({
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
