import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChannelChoiceDesktop } from 'component/channelChoice/ChannelChoiceDesktop';
import { ChannelChoiceMobile } from 'component/channelChoice/ChannelChoiceMobile';

export class ChannelChoice extends Component {
  static propTypes = {
    chatOnline: PropTypes.bool.isRequired,
    showCloseButton: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    formTitleKey: PropTypes.string,
    hideZendeskLogo: PropTypes.bool,
    onNextClick: PropTypes.func,
    style: PropTypes.object,
    isMobile: PropTypes.bool,
    updateFrameSize: PropTypes.func
  };

  static defaultProps = {
    formTitleKey: 'help',
    hideZendeskLogo: false,
    onNextClick: () => {},
    style: {},
    isMobile: false,
    updateFrameSize: () => {}
  };

  handleNextClick = (embed) => {
    this.props.onNextClick(embed);
    this.props.showCloseButton();
  }

  renderMobile = () => {
    const { onCancelClick, showCloseButton, chatOnline, formTitleKey } = this.props;

    return (
      <ChannelChoiceMobile
        ref='channelChoiceMobile'
        chatOnline={chatOnline}
        formTitleKey={formTitleKey}
        handleNextClick={this.handleNextClick}
        handleCancelClick={onCancelClick}
        showCloseButton={showCloseButton} />
    );
  }

  renderDesktop = () => {
    const { formTitleKey, hideZendeskLogo } = this.props;

    return (
      <ChannelChoiceDesktop
        ref='channelChoiceDesktop'
        chatOnline={this.props.chatOnline}
        formTitleKey={formTitleKey}
        handleNextClick={this.handleNextClick}
        hideZendeskLogo={hideZendeskLogo} />
    );
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    const channelChoice = this.props.isMobile
                        ? this.renderMobile()
                        : this.renderDesktop();

    return (
      <div>
        {channelChoice}
      </div>
    );
  }
}
