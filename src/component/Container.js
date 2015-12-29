import React from 'react/addons';

const classSet = React.addons.classSet;

export const Container = React.createClass({
  propTypes: {
    fullscreen: React.PropTypes.bool,
    className: React.PropTypes.string,
    style: React.PropTypes.element,
    card: React.PropTypes.bool,
    children: React.PropTypes.element
  },

  getDefaultProps() {
    return {
      fullscreen: false,
      className: '',
      style: null,
      card: false,
      children: null
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
