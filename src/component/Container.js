import React, { Component, PropTypes } from 'react';

const classNames = require('classnames');

export class Container extends Component {
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

Container.propTypes = {
  children: PropTypes.any.isRequired,
  fullscreen: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  card: PropTypes.bool
};

Container.defaultProps = {
  fullscreen: false,
  className: '',
  style: null,
  card: false
};
