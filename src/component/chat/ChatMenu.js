import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { locals as styles } from './ChatMenu.sass';

export class ChatMenu extends Component {
  static propTypes = {
    disableEndChat: PropTypes.bool.isRequired,
    endChatOnClick: PropTypes.func
  };

  static defaultProps = {
    endChatOnClick: () => {}
  };

  render() {
    return (
      <div className={styles.container}>
        <button className={styles.item}>
          {i18n.t('embeddable_framework.chat.options.sound', {
            fallback: 'Sound'
          })}
        </button>
        <div className={styles.itemLine} />
        <button className={styles.item}>
          {i18n.t('embeddable_framework.chat.options.emailTranscript', {
            fallback: 'Email transcript'
          })}
        </button>
        <button className={styles.item}>
          {i18n.t('embeddable_framework.chat.options.editContactDetails', {
            fallback: 'Edit contact details'
          })}
        </button>
        <div className={styles.itemLine} />
        <button className={styles.item} onClick={this.props.endChatOnClick} disabled={this.props.disableEndChat}>
          {i18n.t('embeddable_framework.chat.options.endChat', {
            fallback: 'End chat'
          })}
        </button>
      </div>
    );
  }
}
