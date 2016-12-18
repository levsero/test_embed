import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Container } from 'component/Container';
import { Chat } from 'component/chat/Chat';
import { HelpCenter } from 'component/helpCenter/HelpCenter';
import { SubmitTicket } from 'component/submitTicket/SubmitTicket';
import { bindMethods } from 'utility/utils';

const submitTicket = 'ticketSubmissionForm';
const helpCenter = 'helpCenterForm';
const chat = 'chat';
const launcher = 'launcher';

export class WebWidget extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, WebWidget.prototype);

    this.state = {
      activeComponent: helpCenter,
      chatOnline: false,
      helpCenterAvaliable: true
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

  onNextClick() {
    if (this.state.chatOnline) {
      this.setState({ activeComponent: chat });
      //track chat started
    } else {
      this.setState({ activeComponent: submitTicket });
      this.props.showBackButton(true);
    }
  }

  onCancelClick() {
    if (this.state.helpCenterAvaliable) {
      this.setState({ activeComponent: helpCenter });
      this.props.showBackButton(this.refs.rootComponent.state.articleViewActive);
    } else {
      this.props.onCancel();
    }
  }

  onBackClick() {
    const rootComponent = this.refs.rootComponent;

    if (this.state.activeComponent === helpCenter) {
      rootComponent.setArticleView(false);
      this.props.showBackButton(false);
    } else {
      if (rootComponent.state.selectedTicketForm) {
        showBackButton(this.state.helpCenterAvaliable);
        rootComponent.clearForm();
      } else {
        this.setState({ activeComponent: helpCenter });
        this.props.showBackButton(rootComponent.state.articleViewActive);
      }
    }
  }

  renderChat() {
    const classes = classNames({
      'u-isHidden': this.state.activeComponent !== chat
    });

    return (
      <div className={classes}>
        <Chat
          ref='rootComponent'
          style={this.props.style}
          position={this.props.position} />
      </div>
    );
  }

  renderHelpCenter() {
    const { helpCenterConfig } = this.props;
    const classes = classNames({
      'u-isHidden': this.state.activeComponent !== helpCenter
    });

    return (
      <div className={classes}>
        <HelpCenter
          ref='rootComponent'
          hideZendeskLogo={this.props.hideZendeskLogo}
          onNextClick={this.onNextClick}
          onArticleClick={this.props.onArticleClick}
          onSearch={this.props.onSearch}
          position={this.props.position}
          buttonLabelKey={this.props.buttonLabelKey}
          formTitleKey={this.props.formTitleKey}
          showBackButton={this.props.showBackButton}
          searchSender={this.props.searchSender}
          contextualSearchSender={this.props.searchSender}
          imagesSender={this.props.imagesSender}
          style={this.props.style}
          fullscreen={this.props.fullscreen}
          updateFrameSize={this.props.updateFrameSize}
          disableAutoSearch={helpCenterConfig.disableAutoSearch}
          originalArticleButton={this.props.originalArticleButton}
          localeFallbacks={this.props.localFallbacks}
          channelChoice={this.props.channelChoice}
          viewMoreEnabled={helpCenterConfig.viewMoreEnabled}
          expanded={true}
          zendeskHost={this.props.zendeskHost} />
      </div>
    );
  }

  renderSubmitTicket() {
    const { submitTicketConfig } = this.props;
    const classes = classNames({
      'u-isHidden': this.state.activeComponent !== submitTicket
    });

    return (
      <div className={classes}>
        <SubmitTicket
          ref='rootComponent'
          customFields={submitTicketConfig.customFields}
          hideZendeskLogo={submitTicketConfig.hideZendeskLogo}
          onCancel={this.onCancelClick}
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
          expanded={true}
          updateFrameSize={this.props.updateFrameSize} />
      </div>
    );
  }

  render() {
    setTimeout(() => this.props.updateFrameSize(), 0);

    return (
      <div>
        {this.renderSubmitTicket()}
        {this.renderChat()}
        {this.renderHelpCenter()}
      </div>
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
