import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './Message.scss';

export class Message extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className={styles.message}>{this.props.message}</div>
    );
  }
}
