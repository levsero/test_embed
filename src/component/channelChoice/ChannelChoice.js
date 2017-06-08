import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Container } from 'component/container/Container';
import { ChannelChoiceDesktop } from 'component/channelChoice/ChannelChoiceDesktop';
import { ChannelChoiceMobile } from 'component/channelChoice/ChannelChoiceMobile';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';

export class ChannelChoice extends Component {
  static propTypes = {
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

  renderZendeskLogo = (fullscreen) => {
    return !this.props.hideZendeskLogo
      ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={fullscreen} />
      : null;
  }

  renderMobile = (onCancelClick, showCloseButton) => {
    return (
      <ChannelChoiceMobile
        ref='channelChoiceMobile'
        handleNextClick={this.handleNextClick}
        handleCancelClick={onCancelClick}
        showCloseButton={showCloseButton} />
    );
  }

  renderDesktop = (hideZendeskLogo, formTitleKey) => {
    return (
      <ChannelChoiceDesktop
        ref='channelChoiceDesktop'
        formTitleKey={formTitleKey}
        handleNextClick={this.handleNextClick}
        hideZendeskLogo={hideZendeskLogo} />
    );
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    const {
      style,
      isMobile,
      hideZendeskLogo,
      formTitleKey,
      onCancelClick,
      showCloseButton } = this.props;
    const channelChoice = isMobile
                        ? this.renderMobile(onCancelClick, showCloseButton)
                        : this.renderDesktop(hideZendeskLogo, formTitleKey);

    return (
      <Container style={style}>
        {channelChoice}
        {this.renderZendeskLogo(this.props.isMobile)}
      </Container>
    );
  }
}
