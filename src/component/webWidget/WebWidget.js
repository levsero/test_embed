import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';

import Chat from 'component/chat/Chat';
import { ChannelChoice } from 'component/channelChoice/ChannelChoice';
import { HelpCenter } from 'component/helpCenter/HelpCenter';
import { SubmitTicket } from 'component/submitTicket/SubmitTicket';
import { updateActiveEmbed,
         updateEmbedAccessible } from 'src/redux/modules/base';

const submitTicket = 'ticketSubmissionForm';
const helpCenter = 'helpCenterForm';
const chat = 'chat';
const channelChoice = 'channelChoice';

const mapStateToProps = (state) => {
  return {
    activeEmbed: state.base.activeEmbed,
    embeds: state.base.embeds,
    chat: state.chat
  };
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
    zendeskHost: PropTypes.string.isRequired,
    updateActiveEmbed: PropTypes.func.isRequired,
    activeEmbed: PropTypes.string.isRequired
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

  setComponent = (activeComponent) => {
    this.props.updateActiveEmbed(activeComponent);
  }

  getActiveComponent = () => {
    return this.props.activeEmbed;
  }

  getRootComponent = () => {
    return this.refs[this.props.activeEmbed];
  }

  getSubmitTicketComponent = () => {
    return this.refs[submitTicket];
  }

  getChatComponent = () => {
    return this.refs[chat].refs.wrappedInstance;
  }

  getHelpCenterComponent = () => {
    return this.refs[helpCenter];
  }

  show = (viaActivate = false) => {
    const {
      activeEmbed,
      updateActiveEmbed,
      helpCenterAvailable,
      showBackButton } = this.props;

    if (activeEmbed !== '' && !viaActivate) return;

    if (helpCenterAvailable) {
      updateActiveEmbed(helpCenter);
    } else if (this.props.chat.account_status === 'online') {
      if (this.props.channelChoice) {
        updateActiveEmbed(channelChoice);
      } else {
        updateActiveEmbed(chat);
      }
    } else {
      updateActiveEmbed(submitTicket);
    }
    showBackButton(false);
  }

  showHelpCenter = () => {
    const helpCenterComponent = this.getHelpCenterComponent();
    const { articleViewActive } = helpCenterComponent.state;

    this.props.updateActiveEmbed(helpCenter);
    this.props.showBackButton(articleViewActive);
  }

  onNextClick = () => {
    const { showBackButton, updateActiveEmbed } = this.props;

    if (this.props.chat.account_status === 'online') {
      updateActiveEmbed(chat);
      // TODO: track chat started
      showBackButton(true);
    } else {
      updateActiveEmbed(submitTicket);
      showBackButton(true);
    }
  }

  onCancelClick = () => {
    const { helpCenterAvailable, onCancel } = this.props;

    if (helpCenterAvailable) {
      this.showHelpCenter();
    } else {
      onCancel();
    }
  }

  onBackClick = () => {
    const rootComponent = this.getRootComponent();
    const { activeEmbed, helpCenterAvailable, showBackButton } = this.props;
    const { selectedTicketForm, ticketForms } = this.getSubmitTicketComponent().state;

    if (activeEmbed === helpCenter) {
      rootComponent.setArticleView(false);
      showBackButton(false);
    } else if (selectedTicketForm && _.size(ticketForms) > 1) {
      rootComponent.clearForm();
      showBackButton(helpCenterAvailable);
    } else {
      this.showHelpCenter();
    }
  }

  renderChat = () => {
    const classes = this.props.activeEmbed !== chat ? 'u-isHidden' : '';

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
      'u-isHidden': this.props.activeEmbed !== helpCenter
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
          zendeskHost={this.props.zendeskHost} />
      </div>
    );
  }

  renderSubmitTicket = () => {
    const { submitTicketConfig } = this.props;
    const classes = classNames({
      'u-isHidden': this.props.activeEmbed !== submitTicket
    });

    return (
      <div className={classes}>
        <SubmitTicket
          ref={submitTicket}
          attachmentsEnabled={submitTicketConfig.attachmentsEnabled}
          attachmentSender={this.props.attachmentSender}
          customFields={submitTicketConfig.customFields}
          disableAutoComplete={submitTicketConfig.disableAutoComplete}
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

  renderChannelChoice = () => {
    const classes = classNames({
      'u-isHidden': this.props.activeEmbed !== channelChoice
    });

    return (
      <div className={classes}>
        <ChannelChoice
          ref={channelChoice}
          onNextClick={this.setComponent}
           />
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
        {this.renderChannelChoice()}
      </div>
    );
  }
}

const actionCreators = {
  updateActiveEmbed,
  updateEmbedAccessible
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(WebWidget);
