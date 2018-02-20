import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChannelChoiceDesktop } from 'component/channelChoice/ChannelChoiceDesktop';
import { ChannelChoiceMobile } from 'component/channelChoice/ChannelChoiceMobile';

export class ChannelChoice extends Component {
  static propTypes = {
    chatAvailable: PropTypes.bool.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    callbackEnabled: PropTypes.bool.isRequired,
    newDesign: PropTypes.bool,
    formTitleKey: PropTypes.string,
    hideZendeskLogo: PropTypes.bool,
    onNextClick: PropTypes.func,
    style: PropTypes.object,
    isMobile: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool,
    talkAvailable: PropTypes.bool,
    talkEnabled: PropTypes.bool,
    updateFrameSize: PropTypes.func
  };

  static defaultProps = {
    formTitleKey: 'help',
    hideZendeskLogo: false,
    onNextClick: () => {},
    style: {},
    isMobile: false,
    newDesign: false,
    talkAvailable: false,
    talkEnabled: false,
    submitTicketAvailable: true,
    chatEnabled: false,
    updateFrameSize: () => {}
  };

  handleNextClick = (embed) => {
    this.props.onNextClick(embed);
  }

  renderMobile = () => {
    const { onCancelClick, chatAvailable, formTitleKey } = this.props;

    return (
      <ChannelChoiceMobile
        ref='channelChoiceMobile'
        chatAvailable={chatAvailable}
        formTitleKey={formTitleKey}
        talkAvailable={this.props.talkAvailable}
        talkEnabled={this.props.talkEnabled}
        callbackEnabled={this.props.callbackEnabled}
        submitTicketAvailable={this.props.submitTicketAvailable}
        chatEnabled={this.props.chatEnabled}
        handleNextClick={this.handleNextClick}
        handleCancelClick={onCancelClick}
        newDesign={this.props.newDesign} />
    );
  }

  renderDesktop = () => {
    const { formTitleKey, hideZendeskLogo } = this.props;

    return (
      <ChannelChoiceDesktop
        ref='channelChoiceDesktop'
        chatAvailable={this.props.chatAvailable}
        formTitleKey={formTitleKey}
        talkAvailable={this.props.talkAvailable}
        talkEnabled={this.props.talkEnabled}
        callbackEnabled={this.props.callbackEnabled}
        submitTicketAvailable={this.props.submitTicketAvailable}
        chatEnabled={this.props.chatEnabled}
        handleNextClick={this.handleNextClick}
        newDesign={this.props.newDesign}
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
