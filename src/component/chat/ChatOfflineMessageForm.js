import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { i18n } from 'service/i18n';
import { Button } from '@zendeskgarden/react-buttons';

import { locals as styles } from './ChatOfflineMessageForm.scss';

export class ChatOfflineMessageForm extends Component {
  static propTypes = {
    offlineMessage: PropTypes.object,
    onFormBack: PropTypes.func
  };

  static defaultProps = {
    offlineMessage: {},
    onFormBack: () => {}
  };

  render() {
    const { name, email, phone, message } = this.props.offlineMessage.details;

    return (
      <div className={styles.successContainer}>
        <p className={styles.message}>
          {i18n.t('embeddable_framework.chat.preChat.offline.label.confirmation')}
        </p>
        <div className={styles.info}>
          <b>{name}</b>
          <p>{email}</p>
          <p>{phone}</p>
          <p className={styles.offlineMessage}>{message}</p>
        </div>
        <Button
          primary={true}
          onClick={this.props.onFormBack}
          className={styles.backButton}>
          {i18n.t('embeddable_framework.chat.preChat.offline.button.sendAnother')}
        </Button>
      </div>
    );
  }
}
