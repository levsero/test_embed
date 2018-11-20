import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const clearDOM = () => {
  document.getElementsByTagName('html')[0].innerHTML = '';
};

export const noopReactComponent = () => class extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
  };

  render() {
    return (
      <div className={this.props.className}>
        {this.props.children}
      </div>
    );
  }
};
