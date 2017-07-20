import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
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
        <div className={styles.item}>
          {i18n.t('embeddable_framework.chat.options.soun', {
            fallback: 'Sound'
          })}
        </div>
        <div className={styles.item}>
          {i18n.t('embeddable_framework.chat.options.emailTranscript', {
            fallback: 'Email transcript'
          })}
        </div>
        <div className={styles.item}>
          {i18n.t('embeddable_framework.chat.options.editContactDetails', {
            fallback: 'Edit contact details'
          })}
        </div>
        <div className={styles.item}>
          {i18n.t('embeddable_framework.chat.options.endChat', {
            fallback: 'End chat'
          })}
        </div>
      </div>
    );
  }
}
