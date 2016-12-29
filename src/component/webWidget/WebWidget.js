import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Chat } from 'component/chat/Chat';
import { HelpCenter } from 'component/helpCenter/HelpCenter';
import { SubmitTicket } from 'component/submitTicket/SubmitTicket';

const submitTicket = 'ticketSubmissionForm';
const helpCenter = 'helpCenterForm';
const chat = 'chat';

export class WebWidget extends Component {
  static propTypes = {
    attachmentSender: PropTypes.func.isRequired,
    buttonLabelKey: PropTypes.string,
    channelChoice: PropTypes.bool,
    formTitleKey: PropTypes.string,
    fullscreen: PropTypes.bool,
    helpCenterAvailable: PropTypes.bool,
    helpCenterConfig: PropTypes.object,
    hideZendeskLogo: PropTypes.bool,
    imagesSender: PropTypes.func,
    localeFallbacks: PropTypes.array,
    onArticleClick: PropTypes.func,
    onCancel: PropTypes.func,
    onSearch: PropTypes.func,
    onSubmitted: PropTypes.func,
    originalArticleButton: PropTypes.bool,
    position: PropTypes.string,
    searchSender: PropTypes.func,
    showBackButton: PropTypes.func,
    style: PropTypes.object,
    subjectEnabled: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    submitTicketConfig: PropTypes.object,
    submitTicketSender: PropTypes.func.isRequired,
    updateFrameSize: PropTypes.func,
    zendeskHost: PropTypes.string.isRequired
  };

  static defaultProps = {
    buttonLabelKey: '',
    channelChoice: true,
    formTitleKey: '',
    fullscreen: true,
    helpCenterAvailable: false,
    helpCenterConfig: {},
    hideZendeskLogo: false,
    imagesSender: () => {},
    localeFallbacks: [],
    onArticleClick: () => {},
    onCancel: () => {},
    onSearch: () => {},
    onSubmitted: () => {},
    originalArticleButton: true,
    position: 'right',
    searchSender: () => {},
    showBackButton: () => {},
    style: null,
    submitTicketAvailable: true,
    submitTicketConfig: {},
    updateFrameSize: () => {}
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      activeComponent: helpCenter,
      chatOnline: false
    };
  }

  expand = () => {
    if (this.getRootComponent().expand) {
      this.getRootComponent().expand(true);
    }
  }

  setComponent = (activeComponent) => {
    this.setState({ activeComponent });
  }

  getActiveComponent = () => {
    return this.state.activeComponent;
  }

  getRootComponent = () => {
    return this.refs[this.state.activeComponent];
  }

  showHelpCenter = () => {
    this.setState({ activeComponent: helpCenter });
    this.props.showBackButton(!!this.getRootComponent().state.articleViewActive);
  }

  onNextClick = () => {
    if (this.state.chatOnline) {
      this.setState({ activeComponent: chat });
      // TODO: track chat started
    } else {
      this.setState({ activeComponent: submitTicket });
      this.props.showBackButton(true);
    }
  }

  onCancelClick = () => {
    if (this.props.helpCenterAvaliable) {
      this.showHelpCenter();
    } else {
      this.props.onCancel();
    }
  }

  onBackClick = () => {
    const rootComponent = this.getRootComponent();

    if (this.state.activeComponent === helpCenter) {
      rootComponent.setArticleView(false);
      this.props.showBackButton(false);
    } else if (rootComponent.state.selectedTicketForm) {
      this.props.showBackButton(this.state.helpCenterAvailable);
      rootComponent.clearForm();
    } else {
      this.showHelpCenter();
    }
  }

  activate() {
    if (this.props.helpCenterAvaliable) {
      this.showHelpCenter();
    } else {
      this.setState({ activeComponent: submitTicket });
    }
  }

  renderChat = () => {
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

  renderHelpCenter = () => {
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
          buttonLabelKey={helpCenterConfig.buttonLabelKey}
          formTitleKey={helpCenterConfig.formTitleKey}
          showBackButton={this.props.showBackButton}
          showNextButton={this.props.submitTicketAvailable}
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

  renderSubmitTicket = () => {
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

  render = () => {
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
