import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { locals as styles } from './ChatMenu.sass';

export class ChatMenu extends Component {
  static propTypes = {
    endChatOnClick: PropTypes.func
  };

  static defaultProps = {
    endChatOnClick: () => {}
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.item}>
          {i18n.t('embeddable_framework.chat.options.sound', {
            fallback: 'Sound'
          })}
        </div>
        <div className={styles.itemLine} />
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
        <div className={styles.itemLine} />
        <div className={styles.item} onClick={this.props.endChatOnClick}>
          {i18n.t('embeddable_framework.chat.options.endChat', {
            fallback: 'End chat'
          })}
        </div>
      </div>
    );
  }
}
