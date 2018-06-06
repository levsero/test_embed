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
    newHeight: PropTypes.bool,
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
    newHeight: false
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
    const { callbackEnabled, newHeight, talkAvailable } = this.props;
    const optionLabel = (callbackEnabled)
      ? i18n.t('embeddable_framework.channelChoice.button.label.request_callback')
      : i18n.t('embeddable_framework.channelChoice.button.label.call_us');
    const offlineLabel = (newHeight)
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

    const { talkAvailable, newHeight, buttonClasses } = this.props;
    const iconType = (newHeight) ? 'Icon--new-channelChoice-talk' : 'Icon--channelChoice-talk';
    const iconStyle = classNames({
      [styles.oldIcon]: !newHeight,
      [styles.oldIconTalk]: !newHeight,
      [styles.iconTalk]: newHeight,
      [styles.newIcon]: newHeight && talkAvailable,
      [styles.newIconDisabled]: newHeight && !talkAvailable
    });
    const buttonStyle = classNames(buttonClasses, {
      [styles.btn]: newHeight,
      [styles.btnEnabled]: newHeight && talkAvailable,
      [styles.talkBtnDisabled]: !talkAvailable,
      [styles.buttonTalk]: !newHeight
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

    const { newHeight, buttonClasses } = this.props;
    const iconType = (newHeight) ? 'Icon--new-channelChoice-contactForm' : 'Icon--channelChoice-contactForm';
    const iconStyle = classNames({
      [styles.oldIcon]: !newHeight,
      [styles.newIcon]: newHeight,
      [styles.iconSubmitTicket]: newHeight
    });
    const buttonStyle = classNames(buttonClasses, {
      [styles.btn]: newHeight,
      [styles.btnEnabled]: newHeight
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
    const { chatAvailable, newHeight } = this.props;
    const optionLabel = i18n.t('embeddable_framework.common.button.chat');
    const offlineLabel = (newHeight)
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

    const { chatAvailable, newHeight, buttonClasses } = this.props;
    const iconType = (newHeight) ? 'Icon--new-channelChoice-chat' : 'Icon--chat';
    const iconStyle = classNames({
      [styles.oldIcon]: !newHeight,
      [styles.iconChat]: newHeight,
      [styles.newIcon]: newHeight && chatAvailable,
      [styles.newIconDisabled]: newHeight && !chatAvailable
    });
    const buttonStyle = classNames(buttonClasses, {
      [styles.btn]: newHeight,
      [styles.btnEnabled]: newHeight && chatAvailable,
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
