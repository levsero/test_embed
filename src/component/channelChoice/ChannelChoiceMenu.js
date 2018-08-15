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
    chatEnabled: false
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
    const { callbackEnabled, talkAvailable } = this.props;
    const optionLabel = (callbackEnabled)
      ? i18n.t('embeddable_framework.channelChoice.button.label.request_callback')
      : i18n.t('embeddable_framework.channelChoice.button.label.call_us');
    const offlineLabel = (
      <span>
        <div className={styles.offlineLabelOption}>{optionLabel}</div>
        <div>{i18n.t('embeddable_framework.channelChoice.button.label.no_available_agents')}</div>
      </span>
    );

    return (talkAvailable)
      ? optionLabel
      : offlineLabel;
  }

  renderTalkButton = () => {
    if (!this.showInitialTalkOption) return null;

    const { talkAvailable, buttonClasses } = this.props;
    const iconStyle = classNames(styles.iconTalk, {
      [styles.newIcon]: talkAvailable,
      [styles.newIconDisabled]: !talkAvailable
    });
    const buttonStyle = classNames(buttonClasses, styles.btn, {
      [styles.btnEnabled]: talkAvailable,
      [styles.talkBtnDisabled]: !talkAvailable
    });

    return (
      <li>
        <ButtonIcon
          actionable={talkAvailable}
          className={buttonStyle}
          labelClassName={this.props.labelClasses}
          onClick={this.handleNextClick('talk')}
          iconClasses={iconStyle}
          label={this.renderTalkLabel()}
          icon={'Icon--channelChoice-talk'} />
      </li>
    );
  }

  renderSubmitTicketButton = () => {
    if (!this.props.submitTicketAvailable) return null;

    const { buttonClasses } = this.props;
    const iconStyle = classNames(
      styles.newIcon,
      styles.iconSubmitTicket
    );
    const buttonStyle = classNames(
      buttonClasses,
      styles.btn,
      styles.btnEnabled
    );

    return (
      <li>
        <ButtonIcon
          className={buttonStyle}
          iconClasses={iconStyle}
          labelClassName={this.props.labelClasses}
          onClick={this.handleNextClick('ticketSubmissionForm')}
          label={i18n.t('embeddable_framework.channelChoice.button.label.submitTicket')}
          icon={'Icon--channelChoice-contactForm'} />
      </li>
    );
  }

  renderChatLabel = () => {
    const { chatAvailable } = this.props;
    const optionLabel = i18n.t('embeddable_framework.common.button.chat');
    const offlineLabel = (
      <span>
        <div className={styles.offlineLabelOption}>{optionLabel}</div>
        <div>{i18n.t('embeddable_framework.channelChoice.button.label.no_available_agents')}</div>
      </span>
    );

    return (chatAvailable)
      ? optionLabel
      : offlineLabel;
  }

  renderChatButton = () => {
    if (!this.showInitialChatOption) return null;

    const { chatAvailable, buttonClasses } = this.props;
    const iconStyle = classNames(styles.iconChat, {
      [styles.newIcon]: chatAvailable,
      [styles.newIconDisabled]: !chatAvailable
    });
    const buttonStyle = classNames(buttonClasses, styles.btn, {
      [styles.btnEnabled]: chatAvailable,
      [styles.chatBtnDisabled]: !chatAvailable
    });

    return (
      <li>
        <ButtonIcon
          actionable={chatAvailable}
          className={buttonStyle}
          iconClasses={iconStyle}
          labelClassName={this.props.labelClasses}
          onClick={this.handleChatClick()}
          label={this.renderChatLabel()}
          icon={'Icon--channelChoice-chat'} />
      </li>
    );
  }

  render = () => {
    return (
      <ul>
        {this.renderTalkButton()}
        {this.renderChatButton()}
        {this.renderSubmitTicketButton()}
      </ul>
    );
  }
}
