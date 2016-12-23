import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Chat } from 'component/chat/Chat';
import { HelpCenter } from 'component/helpCenter/HelpCenter';
import { SubmitTicket } from 'component/submitTicket/SubmitTicket';
import { bindMethods } from 'utility/utils';

const submitTicket = 'ticketSubmissionForm';
const helpCenter = 'helpCenterForm';
const chat = 'chat';

export class WebWidget extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, WebWidget.prototype);

    this.state = {
      activeComponent: helpCenter,
      chatOnline: false
    };
  }

  expand() {
    if (this.getRootComponent().expand) {
      this.getRootComponent().expand(true);
    }
  }

  setComponent(activeComponent) {
    this.setState({ activeComponent });
  }

  getActiveComponent() {
    return this.state.activeComponent;
  }

  getRootComponent() {
    return this.refs[this.state.activeComponent];
  }

  onNextClick() {
    if (this.state.chatOnline) {
      this.setState({ activeComponent: chat });
      // TODO: track chat started
    } else {
      this.setState({ activeComponent: submitTicket });
      this.props.showBackButton(true);
    }
  }

  onCancelClick() {
    if (this.props.helpCenterAvaliable) {
      this.setState({ activeComponent: helpCenter });
      this.props.showBackButton(this.getRootComponent().state.articleViewActive);
    } else {
      this.props.onCancel();
    }
  }

  onBackClick() {
    const rootComponent = this.getRootComponent();

    if (this.state.activeComponent === helpCenter) {
      rootComponent.setArticleView(false);
      this.props.showBackButton(false);
    } else if (rootComponent.state.selectedTicketForm) {
      this.props.showBackButton(this.state.helpCenterAvaliable);
      rootComponent.clearForm();
    } else {
      this.setState({ activeComponent: helpCenter });
      this.props.showBackButton(rootComponent.state.articleViewActive);
    }
  }

  renderChat() {
    const classes = classNames({
      'u-isHidden': this.state.activeComponent !== chat
    });

    return (
      <div className={classes}>
        <Chat
          ref={chat}
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
          ref={helpCenter}
          hideZendeskLogo={this.props.hideZendeskLogo}
          onNextClick={this.onNextClick}
          onArticleClick={this.props.onArticleClick}
          onSearch={this.props.onSearch}
          position={this.props.position}
          buttonLabelKey={this.props.buttonLabelKey}
          formTitleKey={this.props.formTitleKey}
          showBackButton={this.props.showBackButton}
          showNextButton={this.props.submitTicketAvaliable}
          searchSender={this.props.searchSender}
          contextualSearchSender={this.props.searchSender}
          imagesSender={this.props.imagesSender}
          style={this.props.style}
          fullscreen={this.props.fullscreen}
          updateFrameSize={this.props.updateFrameSize}
          disableAutoSearch={helpCenterConfig.disableAutoSearch}
          originalArticleButton={this.props.originalArticleButton}
          localeFallbacks={this.props.localeFallbacks}
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
          ref={submitTicket}
          customFields={submitTicketConfig.customFields}
          hideZendeskLogo={this.props.hideZendeskLogo}
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
  zendeskHost: PropTypes.string.isRequired,
  updateFrameSize: PropTypes.func,
  style: PropTypes.object,
  position: PropTypes.string,
  onSubmitted: PropTypes.func,
  onCancel: PropTypes.func,
  subjectEnabled: PropTypes.bool,
  showBackButton: PropTypes.func,
  helpCenterConfig: PropTypes.object,
  hideZendeskLogo: PropTypes.bool,
  onArticleClick: PropTypes.func,
  onSearch: PropTypes.func,
  buttonLabelKey: PropTypes.string,
  formTitleKey: PropTypes.string,
  searchSender: PropTypes.func,
  imagesSender: PropTypes.func,
  fullscreen: PropTypes.bool,
  originalArticleButton: PropTypes.bool,
  localeFallbacks: PropTypes.arr,
  channelChoice: PropTypes.bool,
  helpCenterAvaliable: PropTypes.bool,
  submitTicketAvaliable: PropTypes.bool
};

WebWidget.defaultProps = {
  submitTicketConfig: {},
  updateFrameSize: () => {},
  style: null,
  position: 'right',
  onSubmitted: () => {},
  onCancel: () => {},
  showBackButton: () => {},
  helpCenterConfig: {},
  hideZendeskLogo: false,
  onArticleClick: () => {},
  onSearch: () => {},
  buttonLabelKey: '',
  formTitleKey: '',
  searchSender: () => {},
  imagesSender: () => {},
  fullscreen: true,
  originalArticleButton: true,
  localeFallbacks: [],
  channelChoice: true,
  helpCenterAvaliable: false,
  submitTicketAvaliable: true
};
