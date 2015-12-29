import React from 'react/addons';

const classSet = React.addons.classSet;

export const Container = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
    fullscreen: React.PropTypes.bool,
    className: React.addons.classSet,
    style: React.PropTypes.element,
    card: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      fullscreen: false,
      className: '',
      style: null,
      card: false,
    };
  },

  render() {
    const containerClasses = classSet({
      [`Container u-posRelative ${this.props.className}`]: true,
      'Container--popover': !this.props.fullscreen,
      'Container--fullscreen': this.props.fullscreen,
      'Container--card': this.props.card
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
