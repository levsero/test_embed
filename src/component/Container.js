import React, { Component, PropTypes } from 'react';

const classNames = require('classnames');

class Container extends React.Component {
  render() {
    const containerClasses = classNames({
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
}

Container.defaultProps = {
  fullscreen: false,
  className: '',
  style: null,
  card: false
};

Container.propTypes = {
  children: React.PropTypes.element.isRequired,
  fullscreen: React.PropTypes.bool,
  className: React.PropTypes.string,
  style: React.PropTypes.element,
  card: React.PropTypes.bool
};

export { Container };