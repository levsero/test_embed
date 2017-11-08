import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { ButtonIcon } from 'component/button/ButtonIcon';
import { locals as styles } from './ChannelChoiceMenu.sass';

export class ChannelChoiceMenu extends Component {
  static propTypes = {
    onNextClick: PropTypes.func.isRequired,
    chatOnline: PropTypes.bool.isRequired,
    buttonClasses: PropTypes.string,
    labelClasses: PropTypes.string
  };

  static defaultProps = {
    buttonClasses: '',
    labelClasses: ''
  };

  handleChatClick = () => {
    if (this.props.chatOnline) {
      return this.handleNextClick('chat');
    }

    // Stop onClick from propagating if selection is disabled
    // Stopping onClick will prevent container from hiding channelChoice
    return (e) => e.stopPropagation();
  }

  handleNextClick = (embed) => {
    return () => this.props.onNextClick(embed);
  }

  renderTalkButton = () => {
    const talkLabel = i18n.t(
      'embeddable_framework.channelChoice.button.label.clickToCall',
      { fallback: 'Click to call' }
    );

    return (
      <ButtonIcon
        className={`${this.props.buttonClasses} ${styles.buttonTalk}`}
        labelClassName={this.props.labelClasses}
        onClick={this.handleNextClick('talk')}
        iconClasses={styles.iconTalk}
        label={talkLabel}
        icon='Icon--talk' />
    );
  }

  render = () => {
    const { chatOnline, buttonClasses, labelClasses } = this.props;
    const chatBtnStyle = !chatOnline ? styles.chatBtnDisabled : '';
    const chatLabel = (chatOnline)
                    ? i18n.t('embeddable_framework.channelChoice.button.label.chat')
                    : i18n.t('embeddable_framework.channelChoice.button.label.chat_offline');

    return (
      <div>
        {this.renderTalkButton()}
        <ButtonIcon
          actionable={chatOnline}
          className={`${chatBtnStyle} ${buttonClasses}`}
          labelClassName={labelClasses}
          onClick={this.handleChatClick()}
          label={chatLabel}
          icon='Icon--chat' />
        <ButtonIcon
          className={buttonClasses}
          labelClassName={labelClasses}
          onClick={this.handleNextClick('ticketSubmissionForm')}
          label={i18n.t('embeddable_framework.channelChoice.button.label.submitTicket')}
          icon='Icon--channelChoice-contactForm' />
      </div>
    );
  }
}
