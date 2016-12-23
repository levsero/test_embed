import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export class Container extends Component {
  render = () => {
    const containerClasses = classNames({
      [`Container u-posRelative ${this.props.className}`]: true,
      'Container--popover': !this.props.fullscreen,
      'Container--fullscreen': this.props.fullscreen,
      'Container--card': this.props.card,
      'Container--expanded u-marginVM': this.props.expanded
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

Container.propTypes = {
  children: PropTypes.node.isRequired,
  fullscreen: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  card: PropTypes.bool,
  onClick: PropTypes.func,
  onDragEnter: PropTypes.func,
  expanded: PropTypes.bool
};

Container.defaultProps = {
  fullscreen: false,
  className: '',
  style: null,
  card: false,
  onClick: () => {},
  onDragEnter: () => {},
  expanded: false
};
