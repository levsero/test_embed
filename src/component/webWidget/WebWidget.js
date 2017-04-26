import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Chat from 'component/chat/Chat';
import { HelpCenter } from 'component/helpCenter/HelpCenter';
import { SubmitTicket } from 'component/submitTicket/SubmitTicket';

const submitTicket = 'ticketSubmissionForm';
const helpCenter = 'helpCenterForm';
const chat = 'chat';

const mapStateToProps = (state) => {
  return { chat: state.chat };
};

class WebWidget extends Component {
  static propTypes = {
    attachmentSender: PropTypes.func.isRequired,
    buttonLabelKey: PropTypes.string,
    channelChoice: PropTypes.bool,
    chat: PropTypes.object.isRequired,
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
    tags: PropTypes.array,
    ticketFieldSettings: PropTypes.array,
    ticketFormSettings: PropTypes.array,
    updateFrameSize: PropTypes.func,
    viaId: PropTypes.number.isRequired,
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
    tags: [],
    ticketFieldSettings: [],
    ticketFormSettings: [],
    updateFrameSize: () => {}
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      activeComponent: helpCenter
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
    if (this.props.chat.account_status !== 'offline') {
      this.setState({ activeComponent: chat });
      // TODO: track chat started
      this.props.showBackButton(true);
    } else {
      this.setState({ activeComponent: submitTicket });
      this.props.showBackButton(true);
    }
  }

  onCancelClick = () => {
    if (this.props.helpCenterAvailable) {
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
    } else if (this.state.activeComponent === chat) {
      this.showHelpCenter();
    } else if (rootComponent.state.selectedTicketForm) {
      this.props.showBackButton(this.state.helpCenterAvailable);
      rootComponent.clearForm();
    } else {
      this.showHelpCenter();
    }
  }

  activate = () => {
    if (this.props.helpCenterAvailable) {
      this.showHelpCenter();
    } else {
      this.setState({ activeComponent: submitTicket });
    }
  }

  renderChat = () => {
    const classes = this.state.activeComponent !== chat ? 'u-isHidden' : '';

    return (
      <div className={classes}>
        <Chat
          ref={chat}
          style={this.props.style}
          updateFrameSize={this.props.updateFrameSize}
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
          disableAutoComplete={helpCenterConfig.disableAutoComplete}
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
          attachmentsEnabled={submitTicketConfig.attachmentsEnabled}
          attachmentSender={this.props.attachmentSender}
          customFields={submitTicketConfig.customFields}
          disableAutoComplete={submitTicketConfig.disableAutoComplete}
          expanded={true}
          formTitleKey={submitTicketConfig.formTitleKey}
          hideZendeskLogo={this.props.hideZendeskLogo}
          maxFileCount={submitTicketConfig.maxFileCount}
          maxFileSize={submitTicketConfig.maxFileSize}
          onCancel={this.onCancelClick}
          onSubmitted={this.props.onSubmitted}
          position={submitTicketConfig.position}
          showBackButton={this.props.showBackButton}
          style={this.props.style}
          subjectEnabled={this.props.subjectEnabled}
          submitTicketSender={this.props.submitTicketSender}
          tags={this.props.tags}
          ticketFieldSettings={this.props.ticketFieldSettings}
          ticketFormSettings={this.props.ticketFormSettings}
          updateFrameSize={this.props.updateFrameSize}
          viaId={this.props.viaId} />
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

export default connect(mapStateToProps, {}, null, { withRef: true })(WebWidget);
