import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export class Container extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleDragEnter = this.handleDragEnter.bind(this);
  }

  handleDragEnter() {
    this.props.onDragEnter();
  }

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
        onDragEnter={this.handleDragEnter}
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
  card: PropTypes.bool
};

Container.defaultProps = {
  fullscreen: false,
  className: '',
  style: null,
  card: false
};
