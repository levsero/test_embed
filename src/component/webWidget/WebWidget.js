import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Container } from 'component/Container';
import { Chat } from 'component/chat/Chat';
import { HelpCenter } from 'component/HelpCenter/HelpCenter';
import { SubmitTicket } from 'component/submitTicket/SubmitTicket';

const submitTicket = 'ticketSubmissionForm';
const helpCenter = 'helpCenterForm';
const chat = 'chat';

export class WebWidget extends Component {
  constructor() {
    this.state = {
      activeComponent: helpCenter
    };
  }

  expand() {
    if (this.refs.rootComponent.expand) {
      this.refs.rootComponent.expand(true);
    }
  }

  setEmbed(activeComponent) {
    this.setState({ activeComponent });
  }

  getActiveEmbed() {
    return this.state.activeComponent;
  }

  renderChat() {
    return (
      <Chat ref='rootComponent' />
    );
  }

  renderHelpCenter() {
    const { helpCenterConfig } = this.props;

    return (
      <HelpCenter
        ref='rootComponent'
        hideZendeskLogo={this.props.hideZendeskLogo}
        onNextClick={this.props.onNextClick}
        onArticleClick={this.props.onArticleClick}
        onSearch={this.props.onSearch}
        position={this.props.position}
        buttonLabelKey={this.props.buttonLabelKey}
        formTitleKey={this.props.formTitleKey}
        showBackButton={this.props.showBackButton}
        searchSender={this.props.searchSender}
        contextualSearchSender={this.props.searchSender}
        imagesSender={this.props.imagesSender}
        style={this.props.containerStyle}
        fullscreen={this.props.fullscreen}
        updateFrameSize={this.props.updateFrameSize}
        disableAutoSearch={helpCenterConfig.disableAutoSearch}
        originalArticleButton={this.props.originalArticleButton}
        localeFallbacks={this.props.localFallbacks}
        channelChoice={this.props.channelChoice}
        viewMoreEnabled={helpCenterConfig.viewMoreEnabled}
        zendeskHost={this.props.zendeskHost} />
    );
  }

  renderSubmitTicket() {
    const { submitTicketConfig } = this.props;

    return (
      <SubmitTicket
        ref='rootComponent'
        customFields={submitTicketConfig.customFields}
        hideZendeskLogo={submitTicketConfig.hideZendeskLogo}
        onCancel={this.props.onCancel}
        submitTicketSender={this.props.submitTicketSender}
        attachmentSender={this.props.attachmentSender}
        onSubmitted={this.props.onSubmitted}
        position={submitTicketConfig.position}
        formTitleKey={submitTicketConfig.formTitleKey}
        style={this.props.style}
        showBackButton={this.props.showBackButton}
        attachmentsEnabled={submitTicketConfig.attachmentsEnabled}
        subjectEnabled={this.props.subjectEnabled}
        maxFileCount={submitTicketConfig.maxFileCount}
        maxFileSize={submitTicketConfig.maxFileSize}
        updateFrameSize={this.props.updateFrameSize} />
    );
  }

  render() {
    setTimeout(() => this.props.updateFrameSize(), 0);

    let component;

    switch (this.state.activeComponent) {
      case submitTicket:
        component = this.renderSubmitTicket();
        break;
      case helpCenter:
        component = this.renderHelpCenter();
        break;
      case chat:
        component = this.renderChat();
        break;
    }

    return (
      <Container
        style={this.props.style}
        position={this.props.position}
        expanded={true}>
        {component}
      </Container>
    );
  }
}

WebWidget.propTypes = {
  submitTicketConfig: PropTypes.object,
  submitTicketSender: PropTypes.func.isRequired,
  attachmentSender: PropTypes.func.isRequired,
  updateFrameSize: PropTypes.func,
  style: PropTypes.object,
  position: PropTypes.string,
  onSubmitted: PropTypes.func,
  onCancel: PropTypes.func,
  subjectEnabled: PropTypes.bool,
  showBackButton: PropTypes.func
};

WebWidget.defaultProps = {
  submitTicketConfig: {},
  updateFrameSize: () => {},
  style: null,
  position: 'right',
  onSubmitted: () => {},
  onCancel: () => {},
  showBackButton: () => {}
};
