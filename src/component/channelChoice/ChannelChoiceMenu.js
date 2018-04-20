import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { ButtonIcon } from 'component/button/ButtonIcon';
import { locals as styles } from './ChannelChoiceMenu.scss';

export class ChannelChoiceMenu extends Component {
  static propTypes = {
    onNextClick: PropTypes.func.isRequired,
    chatAvailable: PropTypes.bool.isRequired,
    callbackEnabled: PropTypes.bool.isRequired,
    buttonClasses: PropTypes.string,
    labelClasses: PropTypes.string,
    talkAvailable: PropTypes.bool,
    talkEnabled: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool
  };

  static defaultProps = {
    buttonClasses: '',
    labelClasses: '',
    talkAvailable: false,
    talkEnabled: false,
    submitTicketAvailable: true,
    chatEnabled: false
  };

  handleChatClick = () => {
    return this.props.chatAvailable
      ? this.handleNextClick('chat')
      : (e) => e.stopPropagation(); // prevent container from hiding channelChoice
  }

  handleNextClick = (embed) => {
    return () => this.props.onNextClick(embed);
  }

  renderTalkButton = () => {
    const { talkAvailable, talkEnabled } = this.props;

    if (!talkEnabled) return null;

    const onlineLabel = (this.props.callbackEnabled)
      ? i18n.t('embeddable_framework.channelChoice.button.label.request_callback')
      : i18n.t('embeddable_framework.channelChoice.button.label.call_us');
    const label = (talkAvailable)
      ? onlineLabel
      : i18n.t('embeddable_framework.channelChoice.button.label.talk_offline_v2');
    const disabledStyle = !talkAvailable ? styles.talkBtnDisabled : '';

    return (
      <ButtonIcon
        actionable={talkAvailable}
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
    if (!this.props.chatEnabled) return null;

    const { chatAvailable } = this.props;
    const chatBtnStyle = !chatAvailable ? styles.chatBtnDisabled : '';
    const chatLabel = (chatAvailable)
      ? i18n.t('embeddable_framework.common.button.chat')
      : i18n.t('embeddable_framework.channelChoice.button.label.chat_offline_v2');

    return (
      <ButtonIcon
        actionable={chatAvailable}
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
