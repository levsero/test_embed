import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoicePopupMobile.scss';

import { ChannelChoiceMenu } from 'component/channelChoice/ChannelChoiceMenu';
import { Button } from '@zendeskgarden/react-buttons';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { i18n } from 'service/i18n';

export class ChannelChoicePopupMobile extends Component {
  static propTypes = {
    onNextClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    chatAvailable: PropTypes.bool.isRequired,
    showCancelButton: PropTypes.bool,
    className: PropTypes.string,
    callbackEnabled: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool,
    talkEnabled: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool
  };

  static defaultProps = {
    showCancelButton: true,
    className: '',
    talkAvailable: false,
    talkEnabled: false,
    submitTicketAvailable: true,
    chatEnabled: false
  };

  handleContainerClick = (e) => e.stopPropagation();

  renderCancelButton = () => {
    if (!this.props.showCancelButton) return null;

    return (
      <div className={styles.buttonContainer}>
        <ButtonGroup rtl={i18n.isRTL()}>
          <Button
            primary={true}
            className={styles.cancelButton}
            onClick={this.props.onCancelClick}>
            {i18n.t('embeddable_framework.common.button.cancel')}
          </Button>
        </ButtonGroup>
      </div>
    );
  }

  render = () => {
    const {
      chatAvailable,
      className,
      onNextClick,
      talkAvailable,
      talkEnabled,
      callbackEnabled } = this.props;

    return (
      <div onClick={this.handleContainerClick}>
        <div className={`${styles.inner} ${className}`}>
          <ChannelChoiceMenu
            submitTicketAvailable={this.props.submitTicketAvailable}
            chatEnabled={this.props.chatEnabled}
            onNextClick={onNextClick}
            chatAvailable={chatAvailable}
            callbackEnabled={callbackEnabled}
            talkAvailable={talkAvailable}
            talkEnabled={talkEnabled}
            buttonClasses={styles.innerItem}
            labelClasses={styles.innerItemLabel} />
        </div>
        {this.renderCancelButton()}
      </div>
    );
  }
}
