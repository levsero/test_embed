import React from 'react/addons';

const classSet = React.addons.classSet;

export var Container = React.createClass({
  render() {
    const containerClasses = classSet({
      [`Container u-posRelative ${this.props.className}`]: true,
      'Container--popover': !this.props.fullscreen,
      'Container--fullscreen': this.props.fullscreen
    });

    return (
      <div
        className={containerClasses}
        style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
});
