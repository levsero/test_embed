import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChannelChoiceMenu } from 'component/channelChoice/ChannelChoiceMenu';
import { locals as styles } from './ChannelChoicePopupDesktop.scss';

export class ChannelChoicePopupDesktop extends Component {
  static propTypes = {
    onNextClick: PropTypes.func.isRequired,
    chatOnline: PropTypes.bool.isRequired,
    callbackEnabled: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatAvailable: PropTypes.bool
  };

  static defaultProps = {
    talkAvailable: false,
    submitTicketAvailable: true,
    chatAvailable: false
  };

  render = () => {
    const {
      chatOnline,
      onNextClick,
      talkAvailable,
      submitTicketAvailable,
      chatAvailable,
      callbackEnabled
    } = this.props;

    return (
      <div className={styles.container}>
        <ChannelChoiceMenu
          submitTicketAvailable={submitTicketAvailable}
          chatAvailable={chatAvailable}
          onNextClick={onNextClick}
          callbackEnabled={callbackEnabled}
          talkAvailable={talkAvailable}
          chatOnline={chatOnline} />
      </div>
    );
  }
}
