import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChannelChoiceDesktop } from 'component/channelChoice/ChannelChoiceDesktop';
import { ChannelChoiceMobile } from 'component/channelChoice/ChannelChoiceMobile';

export class ChannelChoice extends Component {
  static propTypes = {
    chatOnline: PropTypes.bool.isRequired,
    showCloseButton: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    getFrameDimensions: PropTypes.func.isRequired,
    newDesign: PropTypes.bool,
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
    getFrameDimensions: () => {},
    onNextClick: () => {},
    style: {},
    isMobile: false,
    newDesign: false,
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
        newDesign={this.props.newDesign}
        showCloseButton={showCloseButton} />
    );
  }

  renderDesktop = () => {
    const { formTitleKey, hideZendeskLogo, getFrameDimensions } = this.props;

    return (
      <ChannelChoiceDesktop
        ref='channelChoiceDesktop'
        getFrameDimensions={getFrameDimensions}
        chatOnline={this.props.chatOnline}
        formTitleKey={formTitleKey}
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
