import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { ButtonIcon } from 'component/button/ButtonIcon';
import { locals as styles } from './ChannelChoiceMenu.scss';

export class ChannelChoiceMenu extends Component {
  static propTypes = {
    onNextClick: PropTypes.func.isRequired,
    chatOnline: PropTypes.bool.isRequired,
    callbackEnabled: PropTypes.bool.isRequired,
    buttonClasses: PropTypes.string,
    labelClasses: PropTypes.string,
    talkAvailable: PropTypes.bool,
    talkOnline: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatAvailable: PropTypes.bool
  };

  static defaultProps = {
    buttonClasses: '',
    labelClasses: '',
    talkAvailable: false,
    talkOnline: false,
    submitTicketAvailable: true,
    chatAvailable: false
  };

  handleChatClick = () => {
    return this.props.chatOnline
         ? this.handleNextClick('chat')
         : (e) => e.stopPropagation(); // prevent container from hiding channelChoice
  }

  handleNextClick = (embed) => {
    return () => this.props.onNextClick(embed);
  }

  renderTalkButton = () => {
    const { talkAvailable, talkOnline } = this.props;

    if (!talkAvailable) return null;

    const onlineLabel = (this.props.callbackEnabled)
      ? i18n.t('embeddable_framework.channelChoice.button.label.request_callback', { fallback: 'Request a callback' })
      : i18n.t('embeddable_framework.channelChoice.button.label.call_us', { fallback: 'Call us' });
    const label = (talkOnline)
                ? onlineLabel
                : i18n.t('embeddable_framework.channelChoice.button.label.talk_offline',
                         { fallback: 'Talk is offline' });
    const disabledStyle = !talkOnline ? styles.talkBtnDisabled : '';

    return (
      <ButtonIcon
        actionable={talkOnline}
        className={`${this.props.buttonClasses} ${styles.buttonTalk} ${disabledStyle}`}
        labelClassName={this.props.labelClasses}
        onClick={this.handleNextClick('talk')}
        iconClasses={styles.iconTalk}
        label={label}
        icon='Icon--channelChoice-talk' />
    );
  }

  renderSubmitTicketButton = () => {
    if (!this.props.submitTicketAvailable) return null;

    return (
      <ButtonIcon
        className={this.props.buttonClasses}
        labelClassName={this.props.labelClasses}
        onClick={this.handleNextClick('ticketSubmissionForm')}
        label={i18n.t('embeddable_framework.channelChoice.button.label.submitTicket')}
        icon='Icon--channelChoice-contactForm' />
    );
  }

  renderChatButton = () => {
    if (!this.props.chatAvailable) return null;

    const { chatOnline } = this.props;
    const chatBtnStyle = !chatOnline ? styles.chatBtnDisabled : '';
    const chatLabel = (chatOnline)
                    ? i18n.t('embeddable_framework.channelChoice.button.label.chat')
                    : i18n.t('embeddable_framework.channelChoice.button.label.chat_offline');

    return (
      <ButtonIcon
        actionable={chatOnline}
        className={`${chatBtnStyle} ${this.props.buttonClasses}`}
        labelClassName={this.props.labelClasses}
        onClick={this.handleChatClick()}
        label={chatLabel}
        icon='Icon--chat' />
    );
  }

  render = () => {
    return (
      <div>
        {this.renderTalkButton()}
        {this.renderChatButton()}
        {this.renderSubmitTicketButton()}
      </div>
    );
  }
}
