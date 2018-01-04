import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoicePopupMobile.scss';

import { ChannelChoiceMenu } from 'component/channelChoice/ChannelChoiceMenu';
import { Button } from 'component/button/Button';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { i18n } from 'service/i18n';

export class ChannelChoicePopupMobile extends Component {
  static propTypes = {
    onNextClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    chatOnline: PropTypes.bool.isRequired,
    showCancelButton: PropTypes.bool,
    className: PropTypes.string,
    callbackEnabled: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatAvailable: PropTypes.bool
  };

  static defaultProps = {
    showCancelButton: true,
    className: '',
    talkAvailable: false,
    submitTicketAvailable: true,
    chatAvailable: false
  };

  handleContainerClick = (e) => e.stopPropagation();

  renderCancelButton = () => {
    if (!this.props.showCancelButton) return null;

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
    const { chatOnline, className, onNextClick, talkAvailable, callbackEnabled } = this.props;

    return (
      <div onClick={this.handleContainerClick}>
        <div className={`${styles.inner} ${className}`}>
          <ChannelChoiceMenu
            submitTicketAvailable={this.props.submitTicketAvailable}
            chatAvailable={this.props.chatAvailable}
            onNextClick={onNextClick}
            chatOnline={chatOnline}
            callbackEnabled={callbackEnabled}
            talkAvailable={talkAvailable}
            buttonClasses={styles.innerItem}
            labelClasses={styles.innerItemLabel} />
        </div>
        {this.renderCancelButton()}
      </div>
    );
  }
}
