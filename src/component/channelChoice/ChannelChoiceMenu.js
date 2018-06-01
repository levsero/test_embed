import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { i18n } from 'service/i18n';
import { ButtonIcon } from 'component/button/ButtonIcon';
import { locals as styles } from './ChannelChoiceMenu.scss';

export class ChannelChoiceMenu extends Component {
  static propTypes = {
    onNextClick: PropTypes.func.isRequired,
    callbackEnabled: PropTypes.bool.isRequired,
    newChannelChoice: PropTypes.bool.isRequired,
    chatAvailable: PropTypes.bool,
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
    chatAvailable: false,
    chatEnabled: false,
    newChannelChoice: false
  };

  constructor(props) {
    super(props);

    this.showInitialTalkOption = props.talkAvailable;
    this.showInitialChatOption = props.chatAvailable;
  }

  handleChatClick = () => {
    return this.props.chatAvailable
      ? this.handleNextClick('chat')
      : (e) => e.stopPropagation(); // prevent container from hiding channelChoice
  }

  handleNextClick = (embed) => {
    return () => this.props.onNextClick(embed);
  }

  renderTalkLabel = () => {
    const { callbackEnabled, newChannelChoice, talkAvailable } = this.props;
    const optionLabel = (callbackEnabled)
      ? i18n.t('embeddable_framework.channelChoice.button.label.request_callback')
      : i18n.t('embeddable_framework.channelChoice.button.label.call_us');
    const offlineLabel = (newChannelChoice)
      ? (
        <span>
          <div className={styles.offlineLabelOption}>{optionLabel}</div>
          <div>{i18n.t('embeddable_framework.channelChoice.button.label.no_available_agents')}</div>
        </span>
      )
      : i18n.t('embeddable_framework.channelChoice.button.label.talk_offline_v2');

    return (talkAvailable)
      ? optionLabel
      : offlineLabel;
  }

  renderTalkButton = () => {
    if (!this.showInitialTalkOption) return null;

    const { talkAvailable, newChannelChoice, buttonClasses } = this.props;
    const iconType = (newChannelChoice) ? 'Icon--new-channelChoice-talk' : 'Icon--channelChoice-talk';
    const iconStyle = classNames({
      [styles.newIcon]: newChannelChoice && talkAvailable,
      [styles.newIconDisabled]: newChannelChoice && !talkAvailable,
      [styles.iconTalk]: !newChannelChoice
    });
    const buttonStyle = classNames(buttonClasses, {
      [styles.btn]: newChannelChoice,
      [styles.btnEnabled]: newChannelChoice && talkAvailable,
      [styles.talkBtnDisabled]: !talkAvailable,
      [styles.buttonTalk]: !newChannelChoice
    });

    return (
      <ButtonIcon
        actionable={talkAvailable}
        className={buttonStyle}
        labelClassName={this.props.labelClasses}
        onClick={this.handleNextClick('talk')}
        iconClasses={iconStyle}
        label={this.renderTalkLabel()}
        icon={iconType} />
    );
  }

  renderSubmitTicketButton = () => {
    if (!this.props.submitTicketAvailable) return null;

    const { newChannelChoice, buttonClasses } = this.props;
    const iconType = (newChannelChoice) ? 'Icon--new-channelChoice-contactForm' : 'Icon--channelChoice-contactForm';
    const iconStyle = (newChannelChoice) ? styles.newIcon : '';
    const buttonStyle = classNames(buttonClasses, {
      [styles.btn]: newChannelChoice,
      [styles.btnEnabled]: newChannelChoice
    });

    return (
      <ButtonIcon
        className={buttonStyle}
        iconClasses={iconStyle}
        labelClassName={this.props.labelClasses}
        onClick={this.handleNextClick('ticketSubmissionForm')}
        label={i18n.t('embeddable_framework.channelChoice.button.label.submitTicket')}
        icon={iconType} />
    );
  }

  renderChatLabel = () => {
    const { chatAvailable, newChannelChoice } = this.props;
    const optionLabel = i18n.t('embeddable_framework.common.button.chat');
    const offlineLabel = (newChannelChoice)
      ? (
        <span>
          <div className={styles.offlineLabelOption}>{optionLabel}</div>
          <div>{i18n.t('embeddable_framework.channelChoice.button.label.no_available_agents')}</div>
        </span>
      )
      : i18n.t('embeddable_framework.channelChoice.button.label.chat_offline_v2');

    return (chatAvailable)
      ? optionLabel
      : offlineLabel;
  }

  renderChatButton = () => {
    if (!this.showInitialChatOption) return null;

    const { chatAvailable, newChannelChoice, buttonClasses } = this.props;
    const iconType = (newChannelChoice) ? 'Icon--new-channelChoice-chat' : 'Icon--chat';
    const iconStyle = classNames({
      [styles.newIcon]: newChannelChoice && chatAvailable,
      [styles.newIconDisabled]: newChannelChoice && !chatAvailable
    });
    const buttonStyle = classNames(buttonClasses, {
      [styles.btn]: newChannelChoice,
      [styles.btnEnabled]: newChannelChoice && chatAvailable,
      [styles.chatBtnDisabled]: !chatAvailable
    });

    return (
      <ButtonIcon
        actionable={chatAvailable}
        className={buttonStyle}
        iconClasses={iconStyle}
        labelClassName={this.props.labelClasses}
        onClick={this.handleChatClick()}
        label={this.renderChatLabel()}
        icon={iconType} />
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
