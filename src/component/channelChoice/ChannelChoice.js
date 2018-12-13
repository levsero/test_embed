import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChannelChoiceDesktop } from 'component/channelChoice/ChannelChoiceDesktop';
import { ChannelChoiceMobile } from 'component/channelChoice/ChannelChoiceMobile';

export class ChannelChoice extends Component {
  static propTypes = {
    chatAvailable: PropTypes.bool.isRequired,
    chatOfflineAvailable: PropTypes.bool.isRequired,
    callbackEnabled: PropTypes.bool.isRequired,
    formTitleKey: PropTypes.string,
    hideZendeskLogo: PropTypes.bool,
    onNextClick: PropTypes.func,
    isMobile: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool,
    talkOnline: PropTypes.bool.isRequired
  };

  static defaultProps = {
    formTitleKey: 'help',
    hideZendeskLogo: false,
    onNextClick: () => {},
    isMobile: false,
    talkOnline: false,
    submitTicketAvailable: true,
    chatEnabled: false
  };

  handleNextClick = (embed) => {
    this.props.onNextClick(embed);
  }

  renderMobile = () => {
    const { chatAvailable, chatOfflineAvailable, formTitleKey } = this.props;

    return (
      <ChannelChoiceMobile
        ref='channelChoiceMobile'
        chatAvailable={chatAvailable}
        chatOfflineAvailable={chatOfflineAvailable}
        formTitleKey={formTitleKey}
        talkOnline={this.props.talkOnline}
        callbackEnabled={this.props.callbackEnabled}
        submitTicketAvailable={this.props.submitTicketAvailable}
        chatEnabled={this.props.chatEnabled}
        handleNextClick={this.handleNextClick} />
    );
  }

  renderDesktop = () => {
    const { formTitleKey, hideZendeskLogo } = this.props;

    return (
      <ChannelChoiceDesktop
        ref='channelChoiceDesktop'
        chatAvailable={this.props.chatAvailable}
        chatOfflineAvailable={this.props.chatOfflineAvailable}
        formTitleKey={formTitleKey}
        talkOnline={this.props.talkOnline}
        callbackEnabled={this.props.callbackEnabled}
        submitTicketAvailable={this.props.submitTicketAvailable}
        chatEnabled={this.props.chatEnabled}
        handleNextClick={this.handleNextClick}
        hideZendeskLogo={hideZendeskLogo} />
    );
  }

  render = () => {
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
