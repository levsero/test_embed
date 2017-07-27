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
         updateEmbedAccessible,
         updateBackButtonVisibility } from 'src/redux/modules/base';
import { updateHelpCenterAuth } from 'src/redux/modules/helpCenter';

const submitTicket = 'ticketSubmissionForm';
const helpCenter = 'helpCenterForm';
const chat = 'chat';
const zopimChat = 'zopimChat';
const channelChoice = 'channelChoice';

const mapStateToProps = (state) => {
  const { base, chat, helpCenter } = state;

  return {
    chat,
    activeEmbed: base.activeEmbed,
    zopimOnline: base.zopim,
    helpCenterAuth: helpCenter.authenticated
  };
};

class WebWidget extends Component {
  static propTypes = {
    attachmentSender: PropTypes.func,
    buttonLabelKey: PropTypes.string,
    channelChoice: PropTypes.bool,
    chat: PropTypes.object.isRequired,
    contextualSearchSender: PropTypes.func,
    disableAutoComplete: PropTypes.bool,
    formTitleKey: PropTypes.string,
    fullscreen: PropTypes.bool,
    getFrameDimensions: PropTypes.func.isRequired,
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
    showCloseButton: PropTypes.func,
    style: PropTypes.object,
    subjectEnabled: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    submitTicketConfig: PropTypes.object,
    submitTicketSender: PropTypes.func,
    tags: PropTypes.array,
    ticketFieldSettings: PropTypes.array,
    ticketFormSettings: PropTypes.array,
    updateFrameSize: PropTypes.func,
    zopimOnline: PropTypes.bool,
    zopimOnNext: PropTypes.func,
    closeFrame: PropTypes.func,
    viaId: PropTypes.number.isRequired,
    zendeskHost: PropTypes.string.isRequired,
    updateActiveEmbed: PropTypes.func.isRequired,
    updateBackButtonVisibility: PropTypes.func.isRequired,
    updateHelpCenterAuth: PropTypes.func.isRequired,
    activeEmbed: PropTypes.string.isRequired,
    helpCenterAuth: PropTypes.bool.isRequired
  };

  static defaultProps = {
    buttonLabelKey: '',
    channelChoice: false,
    chat: { account_status: 'offline' }, // eslint-disable-line camelcase
    contextualSearchSender: () => {},
    disableAutoComplete: false,
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
    showCloseButton: () => {},
    style: null,
    submitTicketAvailable: true,
    submitTicketConfig: {},
    tags: [],
    ticketFieldSettings: [],
    ticketFormSettings: [],
    updateBackButtonVisibility: () => {},
    updateFrameSize: () => {},
    zopimOnline: false,
    zopimOnNext: () => {},
    closeFrame: () => {}
  };

  setComponent = (activeComponent) => {
    if (activeComponent === chat) {
      this.showChat();
    } else {
      this.props.updateActiveEmbed(activeComponent);
      this.props.updateBackButtonVisibility(true);
    }
  }

  getActiveComponent = () => this.props.activeEmbed;

  getRootComponent = () => this.refs[this.props.activeEmbed];

  getSubmitTicketComponent = () => this.refs[submitTicket];

  getChatComponent = () => this.refs[chat].refs.wrappedInstance;

  getHelpCenterComponent = () => this.refs[helpCenter];

  articleViewActive = () => _.get(this.getHelpCenterComponent(), 'state.articleViewActive', false);

  channelChoiceAvailable = () => this.props.channelChoice && this.chatOnline() && this.props.submitTicketAvailable;

  chatOnline = () => this.props.chat.account_status === 'online' || this.props.zopimOnline;

  noActiveEmbed = () => this.props.activeEmbed === '';

  showChat = () => {
    const { activeEmbed, updateActiveEmbed, zopimOnline, zopimOnNext } = this.props;

    if (zopimOnline) {
      if (activeEmbed === helpCenter || activeEmbed === channelChoice) {
        zopimOnNext();
      }

      updateActiveEmbed(zopimChat);
    } else {
      updateActiveEmbed(chat);
    }
  }

  setHelpCenterAuth = (bool) => this.props.updateHelpCenterAuth(bool);

  resetActiveEmbed = () => {
    const {
      updateActiveEmbed,
      helpCenterAvailable,
      updateBackButtonVisibility,
      helpCenterConfig,
      helpCenterAuth } = this.props;

    const signInRequired = _.get(helpCenterConfig, 'signInRequired', false);
    let backButton = false;

    if (helpCenterAvailable && (!signInRequired || helpCenterAuth)) {
      updateActiveEmbed(helpCenter);
      backButton = this.articleViewActive();
    } else if (this.channelChoiceAvailable()) {
      updateActiveEmbed(channelChoice);
    } else if (this.chatOnline()) {
      this.showChat();
    } else {
      updateActiveEmbed(submitTicket);
    }

    updateBackButtonVisibility(backButton);
  }

  show = (viaActivate = false) => {
    const { activeEmbed } = this.props;

    // If chat came online when contact form was open it should
    // replace it when it's next opened.
    if (activeEmbed === submitTicket && this.chatOnline() && !this.channelChoiceAvailable()) {
      this.showChat();
      return;
    }

    // If zopim has gone offline we will need to reset the embed
    const chatOffline = activeEmbed === zopimChat && !this.chatOnline();

    if (this.noActiveEmbed() || viaActivate || chatOffline) this.resetActiveEmbed();
  }

  showHelpCenter = () => {
    this.props.updateActiveEmbed(helpCenter);
    this.props.updateBackButtonVisibility(this.articleViewActive());
  }

  onNextClick = (embed) => {
    const { updateBackButtonVisibility, updateActiveEmbed, zopimOnline } = this.props;

    if (embed) {
      this.setComponent(embed);
    } else if (this.chatOnline()) {
      this.showChat();
      // TODO: track chat started
      if (!zopimOnline) {
        updateBackButtonVisibility(true);
      }
    } else {
      updateActiveEmbed(submitTicket);
      updateBackButtonVisibility(true);
    }
  }

  onCancelClick = () => {
    const { helpCenterAvailable, updateActiveEmbed, onCancel, updateBackButtonVisibility } = this.props;

    if (helpCenterAvailable) {
      this.showHelpCenter();
    } else if (this.channelChoiceAvailable()) {
      updateActiveEmbed(channelChoice);
      updateBackButtonVisibility(false);
    } else {
      updateActiveEmbed('');
      onCancel();
    }
  }

  onBackClick = () => {
    const rootComponent = this.getRootComponent();
    const { activeEmbed, helpCenterAvailable, updateBackButtonVisibility, updateActiveEmbed } = this.props;
    const { selectedTicketForm, ticketForms } = this.getSubmitTicketComponent().state;

    if (activeEmbed === helpCenter) {
      rootComponent.setArticleView(false);
      updateBackButtonVisibility(false);
    } else if (selectedTicketForm && _.size(ticketForms.ticket_forms) > 1) {
      rootComponent.clearForm();
      updateBackButtonVisibility(helpCenterAvailable || this.props.channelChoice);
    } else if (helpCenterAvailable) {
      this.showHelpCenter();
    } else if (this.props.channelChoice) {
      updateActiveEmbed(channelChoice);
      updateBackButtonVisibility(false);
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
          chatOnline={this.chatOnline()}
          hideZendeskLogo={this.props.hideZendeskLogo}
          onNextClick={this.onNextClick}
          onArticleClick={this.props.onArticleClick}
          onSearch={this.props.onSearch}
          position={this.props.position}
          buttonLabelKey={helpCenterConfig.buttonLabelKey}
          formTitleKey={helpCenterConfig.formTitleKey}
          showBackButton={this.props.updateBackButtonVisibility}
          showNextButton={false}
          showNextButtonSingleIframe={this.props.submitTicketAvailable || this.chatOnline()}
          searchSender={this.props.searchSender}
          contextualSearchSender={this.props.contextualSearchSender}
          imagesSender={this.props.imagesSender}
          style={this.props.style}
          fullscreen={this.props.fullscreen}
          updateFrameSize={this.props.updateFrameSize}
          disableAutoComplete={this.props.disableAutoComplete}
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
          disableAutoComplete={this.props.disableAutoComplete}
          formTitleKey={submitTicketConfig.formTitleKey}
          getFrameDimensions={this.props.getFrameDimensions}
          hideZendeskLogo={this.props.hideZendeskLogo}
          maxFileCount={submitTicketConfig.maxFileCount}
          maxFileSize={submitTicketConfig.maxFileSize}
          onCancel={this.onCancelClick}
          onSubmitted={this.props.onSubmitted}
          position={submitTicketConfig.position}
          showBackButton={this.props.updateBackButtonVisibility}
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
    if (this.props.activeEmbed !== channelChoice) return null;

    return (
      <ChannelChoice
        ref={channelChoice}
        style={this.props.style}
        chatOnline={this.chatOnline()}
        isMobile={this.props.fullscreen}
        onNextClick={this.setComponent}
        onCancelClick={this.props.closeFrame}
        showCloseButton={this.props.showCloseButton}
        hideZendeskLogo={this.props.hideZendeskLogo} />
    );
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    // TODO: Once single iframe is GA'd the containers for each child can be moved
    // here and this won't be needed to fix dodgy animation.
    const width = this.props.fullscreen ? '100%' : '342px';
    const style = { width };

    return (
      // data-embed is needed for our intergration tests
      <div style={style} data-embed={this.props.activeEmbed}>
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
  updateEmbedAccessible,
  updateBackButtonVisibility,
  updateHelpCenterAuth
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(WebWidget);
