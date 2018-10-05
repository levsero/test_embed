import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './Button.scss';

export class Button extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func
  };

  render() {
    return (
      <button className={styles.button} onClick={this.props.onClick}>
        {this.props.label}
      </button>
    );
  }
}
