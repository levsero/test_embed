import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChannelChoiceMenu } from 'component/channelChoice/ChannelChoiceMenu';
import { locals as styles } from './ChannelChoicePopupDesktop.scss';

export class ChannelChoicePopupDesktop extends Component {
  static propTypes = {
    onNextClick: PropTypes.func.isRequired,
    chatAvailable: PropTypes.bool.isRequired,
    callbackEnabled: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool,
    talkEnabled: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool
  };

  static defaultProps = {
    talkAvailable: false,
    talkEnabled: false,
    submitTicketAvailable: true,
    chatEnabled: false
  };

  render = () => {
    const {
      chatAvailable,
      onNextClick,
      talkAvailable,
      talkEnabled,
      submitTicketAvailable,
      chatEnabled,
      callbackEnabled
    } = this.props;

    return (
      <div className={styles.container}>
        <ChannelChoiceMenu
          submitTicketAvailable={submitTicketAvailable}
          chatEnabled={chatEnabled}
          onNextClick={onNextClick}
          callbackEnabled={callbackEnabled}
          talkAvailable={talkAvailable}
          talkEnabled={talkEnabled}
          chatAvailable={chatAvailable} />
      </div>
    );
  }
}
