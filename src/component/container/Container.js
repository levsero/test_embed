import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export class Container extends Component {
  static propTypes = {
    card: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    expanded: PropTypes.bool,
    fullscreen: PropTypes.bool,
    onClick: PropTypes.func,
    onDragEnter: PropTypes.func,
    style: PropTypes.object
  };

  static defaultProps = {
    card: false,
    className: '',
    expanded: false,
    fullscreen: false,
    onClick: () => {},
    onDragEnter: () => {},
    style: null
  };

  render = () => {
    const containerClasses = classNames({
      [`Container u-posRelative ${this.props.className}`]: true,
      'Container--popover': !this.props.fullscreen,
      'Container--fullscreen': this.props.fullscreen,
      'Container--card': this.props.card,
      'Container--expanded u-marginVM': this.props.expanded && !this.props.fullscreen
    });

    return (
      <div
        onClick={this.props.onClick}
        className={containerClasses}
        onDragEnter={this.props.onDragEnter}
        style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}
