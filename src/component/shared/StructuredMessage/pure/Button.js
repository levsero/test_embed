import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './Button.scss';

export class Button extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
  };

  render() {
    return (
      <button className={styles.button}>
        {this.props.label}
      </button>
    );
  }
}
