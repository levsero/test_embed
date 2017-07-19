import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChatMenu.sass';

export class ChatMenu extends Component {
  static propTypes = {
    nick: PropTypes.string,
    name: PropTypes.string,
    message: PropTypes.string
  };

  static defaultProps = {
    nick: '',
    name: '',
    message: ''
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.item}>Sound</div>
        <div className={styles.item}>Email Transcript</div>
        <div className={styles.item}>Edit Contact details</div>
        <div className={styles.item}>End this Chat</div>
      </div>
    );
  }
}
