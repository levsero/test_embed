import React, { Component, PropTypes } from 'react';
import { classNames } from 'classnames';

class Container extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    fullscreen: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.element,
    card: PropTypes.bool
  };

  static defaultProps = {
    fullscreen: false,
    className: '',
    style: null,
    card: false
  };

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

export { Container };
