import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { ButtonIcon } from 'component/button/ButtonIcon';
import { locals as styles } from './ChannelChoice.sass';

export class ChannelChoicePopupDesktop extends Component {
  static propTypes = {
    onNextClick: PropTypes.func.isRequired,
    chatOnline: PropTypes.bool.isRequired
  };

  handleChatClick = () => {
    if (this.props.chatOnline) {
      return this.handleClick('chat');
    }

    // Stop onClick from propagating if selection is disabled
    // Stopping onClick will prevent container from hiding channelChoice
    return (e) => e.stopPropagation();
  }

  handleClick = (embed) => {
    return () => this.props.onNextClick(embed);
  }

  render = () => {
    const { chatOnline } = this.props;
    const chatBtnStyle = !chatOnline ? styles.chatBtnDisabled : '';
    const chatLabel = (chatOnline)
                    ? i18n.t('embeddable_framework.channelChoice.button.label.chat')
                    : i18n.t('embeddable_framework.channelChoice.button.label.chat_offline');

    return (
      <div className='u-posAbsolute Container--channelChoicePopup'>
        <ButtonIcon
          actionable={chatOnline}
          className={chatBtnStyle}
          onClick={this.handleChatClick()}
          label={chatLabel}
          icon='Icon--chat' />
        <ButtonIcon
          onClick={this.handleClick('ticketSubmissionForm')}
          label={i18n.t('embeddable_framework.channelChoice.button.label.submitTicket')}
          icon='Icon--channelChoice-contactForm' />
      </div>
    );
  }
}
