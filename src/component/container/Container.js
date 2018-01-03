import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './Container.scss';

export class Container extends Component {
  static propTypes = {
    card: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    fullscreen: PropTypes.bool,
    onClick: PropTypes.func,
    onDragEnter: PropTypes.func,
    style: PropTypes.object
  };

  static defaultProps = {
    card: false,
    className: '',
    fullscreen: false,
    onClick: () => {},
    onDragEnter: () => {},
    style: null
  };

  render = () => {
    const platformClasses = this.props.fullscreen ? styles.mobile : styles.desktop;
    const styleClasses = this.props.card ? styles.card : '';

    return (
      <div
        onClick={this.props.onClick}
        className={`${styles.container} ${this.props.className} ${platformClasses} ${styleClasses}`}
        onDragEnter={this.props.onDragEnter}
        style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}
