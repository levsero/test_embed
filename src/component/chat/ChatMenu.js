import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { Icon } from 'component/Icon';
import { SlideUpAppear } from 'component/transition/SlideUpAppear';

import { locals as styles } from './ChatMenu.scss';

export class ChatMenu extends Component {
  static propTypes = {
    disableEndChat: PropTypes.bool.isRequired,
    playSound: PropTypes.bool.isRequired,
    contactDetailsOnClick: PropTypes.func,
    onSoundClick: PropTypes.func.isRequired,
    endChatOnClick: PropTypes.func,
    show: PropTypes.bool,
    emailTranscriptOnClick: PropTypes.func,
    isChatting: PropTypes.bool
  };

  static defaultProps = {
    endChatOnClick: () => {},
    contactDetailsOnClick: () => {},
    show: false,
    emailTranscriptOnClick: () => {},
    isChatting: false
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

  renderEmailTranscriptButton = () => {
    if (!this.props.isChatting) return null;

    return (
      <button className={styles.item} onClick={this.props.emailTranscriptOnClick}>
        {i18n.t('embeddable_framework.chat.options.emailTranscript')}
      </button>
    );
  }

  render() {
    return (
      <SlideUpAppear
        startPosHeight={'10px'}
        endPosHeight={'20px'}
        className={styles.container}
        trigger={this.props.show}>
        {this.renderSoundButton()}
        <div className={styles.itemLine} />
        {this.renderEmailTranscriptButton()}
        <button className={styles.item} onClick={this.props.contactDetailsOnClick}>
          {i18n.t('embeddable_framework.chat.options.editContactDetails')}
        </button>
        <div className={styles.itemLine} />
        <button className={styles.item} onClick={this.props.endChatOnClick} disabled={this.props.disableEndChat}>
          {i18n.t('embeddable_framework.chat.options.endChat')}
        </button>
      </SlideUpAppear>
    );
  }
}
