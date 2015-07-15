import React from 'react/addons';

const classSet = React.addons.classSet;

export var Container = React.createClass({
  render() {
    /* jshint quotmark:false */
    const containerClasses = classSet({
      'Container': true,
      'Container--popover': !this.props.fullscreen,
      'Container--popoverAlt': this.props.position === 'left',
      'Container--fullscreen': this.props.fullscreen,
      'u-posRelative': true
    });
    const containerBarClasses = classSet({
      'Container-bar u-borderBottom': true,
      'u-isHidden': !this.props.fullscreen
    });

    return (
      <div className={containerClasses}>
        <div className={containerBarClasses} />
        {this.props.children}
      </div>
    );
  }
});
