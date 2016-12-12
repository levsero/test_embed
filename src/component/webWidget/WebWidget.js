import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Container } from 'component/Container';
import { Chat } from 'component/chat/Chat';
import { SubmitTicket } from 'component/submitTicket/SubmitTicket';

export class WebWidget extends Component {
  constructor() {
    this.state = {
      activeComponent: 'submitTicket'
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

  renderChat() {
    return (
      <Chat ref='rootComponent' />
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

    const component = this.state.activeComponent === 'submitTicket'
                    ? this.renderSubmitTicket()
                    : this.renderChat();

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
