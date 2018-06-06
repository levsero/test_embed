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
    chatAvailable: PropTypes.bool.isRequired,
    showCancelButton: PropTypes.bool,
    className: PropTypes.string,
    callbackEnabled: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool,
    talkEnabled: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool,
    newHeight: PropTypes.bool
  };

  static defaultProps = {
    showCancelButton: true,
    className: '',
    talkAvailable: false,
    talkEnabled: false,
    submitTicketAvailable: true,
    chatEnabled: false,
    newHeight: false
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
            label={i18n.t('embeddable_framework.common.button.cancel')}
            onTouchStartDisabled={true}
            onClick={this.props.onCancelClick} />
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
      callbackEnabled,
      newHeight } = this.props;

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
            labelClasses={styles.innerItemLabel}
            newHeight={newHeight} />
        </div>
        {this.renderCancelButton()}
      </div>
    );
  }
}
