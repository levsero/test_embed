import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChannelChoiceMenu } from 'component/channelChoice/ChannelChoiceMenu';
import { locals as styles } from './ChannelChoiceDesktop.sass';

export class ChannelChoicePopupDesktop extends Component {
  static propTypes = {
    onNextClick: PropTypes.func.isRequired,
    chatOnline: PropTypes.bool.isRequired
  };

  render = () => {
    const { chatOnline, onNextClick } = this.props;

    return (
      <div className={styles.container}>
        <ChannelChoiceMenu
          onNextClick={onNextClick}
          chatOnline={chatOnline} />
      </div>
    );
  }
}
