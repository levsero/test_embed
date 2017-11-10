import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChannelChoiceMenu } from 'component/channelChoice/ChannelChoiceMenu';
import { locals as styles } from './ChannelChoicePopupDesktop.sass';

export class ChannelChoicePopupDesktop extends Component {
  static propTypes = {
    onNextClick: PropTypes.func.isRequired,
    chatOnline: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool
  };

  static defaultProps = {
    talkAvailable: false
  };

  render = () => {
    const { chatOnline, onNextClick, talkAvailable } = this.props;

    return (
      <div className={styles.container}>
        <ChannelChoiceMenu
          onNextClick={onNextClick}
          talkAvailable={talkAvailable}
          chatOnline={chatOnline} />
      </div>
    );
  }
}
