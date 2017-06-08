import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChannelChoicePopupMobile } from 'component/channelChoice/ChannelChoicePopupMobile';

export class ChannelChoiceMobile extends Component {
  static propTypes = {
    handleNextClick: PropTypes.func.isRequired,
    handleCancelClick: PropTypes.func.isRequired,
    showCloseButton: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    this.props.showCloseButton(false);
  }

  render = () => {
    const { handleNextClick, handleCancelClick } = this.props;

    return (
      <div>
        <ChannelChoicePopupMobile
          onNextClick={handleNextClick}
          onCancelClick={handleCancelClick} />
      </div>
    );
  }
}
