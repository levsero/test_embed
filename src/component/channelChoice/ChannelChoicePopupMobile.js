import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoicePopupMobile.scss';

import { ChannelChoiceMenu } from 'component/channelChoice/ChannelChoiceMenu';

export class ChannelChoicePopupMobile extends Component {
  static propTypes = {
    onNextClick: PropTypes.func.isRequired,
    chatAvailable: PropTypes.bool.isRequired,
    className: PropTypes.string,
    callbackEnabled: PropTypes.bool.isRequired,
    talkOnline: PropTypes.bool.isRequired,
    submitTicketAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool,
    chatOfflineAvailable: PropTypes.bool.isRequired
  };

  static defaultProps = {
    showCancelButton: true,
    className: '',
    talkOnline: false,
    submitTicketAvailable: true,
    chatEnabled: false
  };

  handleContainerClick = (e) => e.stopPropagation();

  render = () => {
    const {
      chatAvailable,
      className,
      onNextClick,
      talkOnline,
      callbackEnabled,
      chatOfflineAvailable
    } = this.props;

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
            talkOnline={talkOnline}
            buttonClasses={styles.innerItem}
            labelClasses={styles.innerItemLabel}
          />
        </div>
      </div>
    );
  }
}
