import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { Icon } from 'component/Icon';

import { locals as styles } from './ChatMenu.scss';

export class ChatMenu extends Component {
  static propTypes = {
    disableEndChat: PropTypes.bool.isRequired,
    playSound: PropTypes.bool.isRequired,
    contactDetailsOnClick: PropTypes.func,
    onSoundClick: PropTypes.func.isRequired,
    endChatOnClick: PropTypes.func
  };

  static defaultProps = {
    endChatOnClick: () => {},
    contactDetailsOnClick: () => {}
  };

  handleSoundClick = (e) => {
    e.stopPropagation();
    this.props.onSoundClick();
  }

  renderSoundButton = () => {
    const iconType = this.props.playSound ? 'Icon--sound-on' : 'Icon--sound-off';

    return (
      <button className={styles.item} onClick={this.handleSoundClick}>
        {i18n.t('embeddable_framework.chat.options.sound')}
        <Icon className={styles.soundIcon} type={iconType} />
      </button>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderSoundButton()}
        <div className={styles.itemLine} />
        <button className={styles.item}>
          {i18n.t('embeddable_framework.chat.options.emailTranscript')}
        </button>
        <button className={styles.item} onClick={this.props.contactDetailsOnClick}>
          {i18n.t('embeddable_framework.chat.options.editContactDetails')}
        </button>
        <div className={styles.itemLine} />
        <button className={styles.item} onClick={this.props.endChatOnClick} disabled={this.props.disableEndChat}>
          {i18n.t('embeddable_framework.chat.options.endChat')}
        </button>
      </div>
    );
  }
}
