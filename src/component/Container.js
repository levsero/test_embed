import React from 'react/addons';

const classSet = React.addons.classSet;

export var Container = React.createClass({
  render() {
    const containerClasses = classSet({
      'Container': true,
      'Container--popover': !this.props.fullscreen && !this.props.card,
      'Container--fullscreen': this.props.fullscreen,
      'Container--card': this.props.card,
      'u-posRelative': true
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
