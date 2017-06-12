import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoicePopupMobile.sass';
import { locals as commonStyles } from './ChannelChoice.sass';

import { Button } from 'component/button/Button';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { ButtonIcon } from 'component/button/ButtonIcon';
import { i18n } from 'service/i18n';

export class ChannelChoicePopupMobile extends Component {
  static propTypes = {
    onNextClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    chatOnline: PropTypes.bool.isRequired
  };

  handleChatClick = () => {
    if (this.props.chatOnline) {
      return this.handleNextClick('chat');
    }

    return () => {};
  }

  handleNextClick = (embed) => {
    return () => this.props.onNextClick(embed);
  }

  renderBody = () => {
    const { chatOnline } = this.props;
    const chatDisabledStyle = !chatOnline ? commonStyles.chatBtnDisabled : '';
    const chatLabel = (chatOnline)
                    ? i18n.t('embeddable_framework.channelChoice.button.label.chat')
                    : i18n.t('embeddable_framework.channelChoice.chat.offline');

    return (
      <div className={styles.inner}>
        <ButtonIcon
          className={`${styles.innerItem} ${chatDisabledStyle}`}
          labelClassName={styles.innerItemLabel}
          icon='Icon--channelChoice-chat'
          label={chatLabel}
          onClick={this.handleChatClick()} />
        <ButtonIcon
          className={styles.innerItem}
          labelClassName={styles.innerItemLabel}
          icon='Icon--channelChoice-contactForm'
          label={i18n.t('embeddable_framework.channelChoice.button.label.submitTicket')}
          onClick={this.handleNextClick('ticketSubmissionForm')} />
      </div>
    );
  }

  renderCancelButton = () => {
    return (
      <div className={styles.buttonContainer}>
        <ButtonGroup rtl={i18n.isRTL()}>
          <Button
            className={styles.cancelButton}
            fullscreen={true}
            label={i18n.t('embeddable_framework.submitTicket.form.cancelButton.label.cancel')}
            onTouchStartDisabled={true}
            onClick={this.props.onCancelClick} />
        </ButtonGroup>
      </div>
    );
  }

  render = () => {
    return (
      <div>
        {this.renderBody()}
        {this.renderCancelButton()}
      </div>
    );
  }
}
