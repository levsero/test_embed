import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoicePopupMobile.scss';

import { ChannelChoiceMenu } from 'component/channelChoice/ChannelChoiceMenu';

export class ChannelChoicePopupMobile extends Component {
  static propTypes = {
    onNextClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    chatAvailable: PropTypes.bool.isRequired,
    className: PropTypes.string,
    callbackEnabled: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool,
    talkEnabled: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool,
    chatOfflineAvailable: PropTypes.bool.isRequired
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

  render = () => {
    const {
      chatAvailable,
      className,
      onNextClick,
      talkAvailable,
      talkEnabled,
      callbackEnabled,
      chatOfflineAvailable } = this.props;

    return (
      <div onClick={this.handleContainerClick}>
        <div className={`${styles.inner} ${className}`}>
          <ChannelChoiceMenu
            submitTicketAvailable={this.props.submitTicketAvailable}
            chatEnabled={this.props.chatEnabled}
            onNextClick={onNextClick}
            chatAvailable={chatAvailable}
            chatOfflineAvailable={chatOfflineAvailable}
            callbackEnabled={callbackEnabled}
            talkAvailable={talkAvailable}
            talkEnabled={talkEnabled}
            buttonClasses={styles.innerItem}
            labelClasses={styles.innerItemLabel} />
        </div>
      </div>
    );
  }
}
