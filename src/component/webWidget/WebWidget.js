import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import Chat from 'component/chat/Chat';
import Talk from 'component/talk/Talk';
import { ChannelChoice } from 'component/channelChoice/ChannelChoice';
import { Container } from 'component/container/Container';
import HelpCenter from 'component/helpCenter/HelpCenter';
import { SubmitTicket } from 'component/submitTicket/SubmitTicket';
import { updateActiveEmbed,
         updateEmbedAccessible,
         updateBackButtonVisibility,
         updateAuthenticated } from 'src/redux/modules/base';
import { getZopimChatOnline } from 'src/redux/modules/zopimChat/selectors';
import { hideChatNotification, updateChatScreen } from 'src/redux/modules/chat';
import { getChatNotification } from 'src/redux/modules/chat/selectors';
import { getTalkAvailable, isCallbackEnabled } from 'src/redux/modules/talk/talk-selectors';
import { settings } from 'service/settings';

const submitTicket = 'ticketSubmissionForm';
const helpCenter = 'helpCenterForm';
const chat = 'chat';
const zopimChat = 'zopimChat';
const channelChoice = 'channelChoice';
const talk = 'talk';

const mapStateToProps = (state) => {
  const { base, chat } = state;

  return {
    chat,
    chatNotification: getChatNotification(state),
    activeEmbed: base.activeEmbed,
    zopimOnline: getZopimChatOnline(state),
    authenticated: base.authenticated,
    talkAvailable: getTalkAvailable(state),
    callbackEnabled: isCallbackEnabled(state)
  };
};

class WebWidget extends Component {
  static propTypes = {
    attachmentSender: PropTypes.func,
    buttonLabelKey: PropTypes.string,
    callbackEnabled: PropTypes.bool.isRequired,
    channelChoice: PropTypes.bool,
    chat: PropTypes.object.isRequired,
    chatNotification: PropTypes.object.isRequired,
    newDesign: PropTypes.bool,
    formTitleKey: PropTypes.string,
    fullscreen: PropTypes.bool,
    getFrameDimensions: PropTypes.func.isRequired,
    helpCenterAvailable: PropTypes.bool,
    helpCenterConfig: PropTypes.object,
    isOnHelpCenterPage: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    localeFallbacks: PropTypes.array,
    onArticleClick: PropTypes.func,
    onCancel: PropTypes.func,
    onSearch: PropTypes.func,
    onSubmitted: PropTypes.func,
    originalArticleButton: PropTypes.bool,
    position: PropTypes.string,
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
    zendeskSubdomain: PropTypes.string.isRequired,
    updateActiveEmbed: PropTypes.func.isRequired,
    updateBackButtonVisibility: PropTypes.func.isRequired,
    updateAuthenticated: PropTypes.func.isRequired,
    hideChatNotification: PropTypes.func.isRequired,
    updateChatScreen: PropTypes.func.isRequired,
    activeEmbed: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool.isRequired,
    talkConfig: PropTypes.object
  };

  static defaultProps = {
    buttonLabelKey: '',
    channelChoice: false,
    chat: { account_status: 'offline' }, // eslint-disable-line camelcase
    chatNotification: { show: false, playSound: false },
    newDesign: false,
    formTitleKey: 'message',
    fullscreen: true,
    helpCenterAvailable: false,
    helpCenterConfig: {},
    isOnHelpCenterPage: false,
    hideZendeskLogo: false,
    localeFallbacks: [],
    onArticleClick: () => {},
    onCancel: () => {},
    onSearch: () => {},
    onSubmitted: () => {},
    originalArticleButton: true,
    position: 'right',
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
    closeFrame: () => {},
    talkAvailable: false,
    talkConfig: {}
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

  getRootComponent = () => {
    const component = this.refs[this.props.activeEmbed];

    return component && component.getWrappedInstance ? component.getWrappedInstance() : component;
  };

  getSubmitTicketComponent = () => this.refs[submitTicket];

  getChatComponent = () => this.refs[chat].getWrappedInstance();

  getHelpCenterComponent = () => this.refs[helpCenter].getWrappedInstance();

  articleViewActive = () => _.get(this.getHelpCenterComponent(), 'state.articleViewActive', false);

  shouldShowTicketFormBackButton = () => {
    if (!this.getSubmitTicketComponent()) return false;

    const { selectedTicketForm, ticketForms } = this.getSubmitTicketComponent().state;

    return selectedTicketForm && _.size(ticketForms.ticket_forms) > 1;
  }

  isHelpCenterAvailable = () => {
    const { helpCenterAvailable, helpCenterConfig, authenticated, isOnHelpCenterPage } = this.props;
    const signInRequired = _.get(helpCenterConfig, 'signInRequired', false);
    const helpCenterAccessible = (!signInRequired || isOnHelpCenterPage) || authenticated;

    return helpCenterAvailable && helpCenterAccessible;
  }

  isChannelChoiceAvailable = () => {
    const { channelChoice, submitTicketAvailable, talkAvailable } = this.props;
    const channels = [talkAvailable, submitTicketAvailable, this.isChatOnline()];
    const channelsAvailable = _.filter(channels, _.identity);

    return (channelChoice || talkAvailable) && channelsAvailable.length > 1;
  };

  isChatOnline = () => this.props.chat.account_status === 'online' || this.props.zopimOnline;

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

  setAuthenticated = (bool) => this.props.updateAuthenticated(bool);

  resetActiveEmbed = () => {
    const { updateActiveEmbed, updateBackButtonVisibility, talkAvailable } = this.props;
    let backButton = false;

    if (this.isHelpCenterAvailable()) {
      updateActiveEmbed(helpCenter);
      backButton = this.articleViewActive();
    } else if (this.isChannelChoiceAvailable()) {
      updateActiveEmbed(channelChoice);
    } else if (talkAvailable) {
      updateActiveEmbed(talk);
    } else if (this.isChatOnline()) {
      this.showChat();
    } else {
      updateActiveEmbed(submitTicket);
      backButton = this.shouldShowTicketFormBackButton();
    }

    updateBackButtonVisibility(backButton);
  }

  show = (viaActivate = false) => {
    const { activeEmbed } = this.props;
    const chatOnline = this.isChatOnline();

    // If chat came online when contact form was open it should
    // replace it when it's next opened.
    if (activeEmbed === submitTicket && chatOnline && !this.isChannelChoiceAvailable()) {
      this.showChat();
      return;
    }

    // If zopim or talk has gone offline we will need to reset the embed
    const chatOffline = _.includes([zopimChat, channelChoice], activeEmbed) && !chatOnline;
    const talkOffline = _.includes([talk, channelChoice], activeEmbed) && !this.props.talkAvailable;

    if (this.noActiveEmbed() || viaActivate || chatOffline || talkOffline) this.resetActiveEmbed();
  }

  showHelpCenter = () => {
    this.props.updateActiveEmbed(helpCenter);
    this.props.updateBackButtonVisibility(this.articleViewActive());
  }

  onNextClick = (embed) => {
    const { updateBackButtonVisibility, updateActiveEmbed, zopimOnline } = this.props;

    if (embed) {
      this.setComponent(embed);
    } else if (this.props.talkAvailable) {
      updateActiveEmbed(talk);
      updateBackButtonVisibility(true);
    } else if (this.isChatOnline()) {
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
    const { updateActiveEmbed, onCancel, updateBackButtonVisibility } = this.props;

    if (this.isHelpCenterAvailable()) {
      this.showHelpCenter();
    } else if (this.isChannelChoiceAvailable()) {
      updateActiveEmbed(channelChoice);
      updateBackButtonVisibility(false);
    } else {
      updateActiveEmbed('');
      onCancel();
    }
  }

  onBackClick = () => {
    const rootComponent = this.getRootComponent();
    const { activeEmbed, updateBackButtonVisibility, updateActiveEmbed } = this.props;
    const helpCenterAvailable = this.isHelpCenterAvailable();
    const channelChoiceAvailable = this.isChannelChoiceAvailable();

    if (activeEmbed === helpCenter) {
      rootComponent.setArticleView(false);
      updateBackButtonVisibility(false);
    } else if (this.shouldShowTicketFormBackButton()) {
      rootComponent.clearForm();
      updateBackButtonVisibility(helpCenterAvailable || channelChoiceAvailable);
    } else if (helpCenterAvailable) {
      this.showHelpCenter();
    } else if (channelChoiceAvailable) {
      updateActiveEmbed(channelChoice);
      updateBackButtonVisibility(false);
    }
  }

  onContainerClick = () => {
    const { activeEmbed } = this.props;

    // TODO:
    // Once the other embed components are within a wrappedInstance,
    // getting a reference to the instance of the Chat component will no
    // longer need to be in a seperate method. We can then remove this if-else
    // logic and replace it with something like:
    // if (this.getRootComponent().onContainerClick)
    //   this.getRootComponent().onContainerClick()
    if (activeEmbed === chat) {
      this.getChatComponent().onContainerClick();
    } else if (activeEmbed === helpCenter) {
      this.getRootComponent().onContainerClick();
    }
  };

  onContainerDragEnter = () => {
    if (this.props.activeEmbed === submitTicket) {
      this.getRootComponent().handleDragEnter();
    }
  }

  renderChat = () => {
    if (this.props.activeEmbed !== chat) return;

    return (
      <Chat
        ref={chat}
        getFrameDimensions={this.props.getFrameDimensions}
        isMobile={this.props.fullscreen}
        newDesign={this.props.newDesign}
        updateFrameSize={this.props.updateFrameSize}
        updateChatScreen={this.props.updateChatScreen}
        position={this.props.position} />
    );
  }

  renderHelpCenter = () => {
    if (!this.props.helpCenterAvailable) return;

    const { helpCenterConfig } = this.props;
    const classes = this.props.activeEmbed !== helpCenter ? 'u-isHidden' : '';
    const chatOnline = this.isChatOnline();
    const showNextButton = this.props.submitTicketAvailable || chatOnline || this.props.talkAvailable;

    return (
      <div className={classes}>
        <HelpCenter
          ref={helpCenter}
          notification={this.props.chatNotification}
          chatOnline={chatOnline}
          hideZendeskLogo={this.props.hideZendeskLogo}
          onNextClick={this.onNextClick}
          newDesign={this.props.newDesign}
          onArticleClick={this.props.onArticleClick}
          onSearch={this.props.onSearch}
          position={this.props.position}
          getFrameDimensions={this.props.getFrameDimensions}
          buttonLabelKey={helpCenterConfig.buttonLabelKey}
          formTitleKey={helpCenterConfig.formTitleKey}
          showBackButton={this.props.updateBackButtonVisibility}
          showNextButton={showNextButton}
          style={this.props.style}
          fullscreen={this.props.fullscreen}
          updateFrameSize={this.props.updateFrameSize}
          originalArticleButton={this.props.originalArticleButton}
          localeFallbacks={this.props.localeFallbacks}
          channelChoice={this.isChannelChoiceAvailable()}
          callbackEnabled={this.props.callbackEnabled}
          talkAvailable={this.props.talkAvailable}
          submitTicketAvailable={this.props.submitTicketAvailable}
          chatAvailable={!settings.get('chat.suppress') && this.props.zopimOnline}
          viewMoreEnabled={helpCenterConfig.viewMoreEnabled}
          zendeskHost={this.props.zendeskHost}
          hideChatNotification={this.props.hideChatNotification}
          updateChatScreen={this.props.updateChatScreen} />
      </div>
    );
  }

  renderSubmitTicket = () => {
    if (!this.props.submitTicketAvailable) return;

    const { submitTicketConfig } = this.props;
    const classes = this.props.activeEmbed !== submitTicket ? 'u-isHidden' : '';

    return (
      <div className={classes}>
        <SubmitTicket
          ref={submitTicket}
          attachmentsEnabled={submitTicketConfig.attachmentsEnabled}
          attachmentSender={this.props.attachmentSender}
          customFields={submitTicketConfig.customFields}
          formTitleKey={submitTicketConfig.formTitleKey}
          newDesign={this.props.newDesign}
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
        chatOnline={this.isChatOnline()}
        talkAvailable={this.props.talkAvailable}
        callbackEnabled={this.props.callbackEnabled}
        submitTicketAvailable={this.props.submitTicketAvailable}
        chatAvailable={!settings.get('chat.suppress') && this.props.zopimOnline}
        isMobile={this.props.fullscreen}
        onNextClick={this.setComponent}
        getFrameDimensions={this.props.getFrameDimensions}
        onCancelClick={this.props.closeFrame}
        showCloseButton={this.props.showCloseButton}
        hideZendeskLogo={this.props.hideZendeskLogo} />
    );
  }

  renderTalk = () => {
    if (this.props.activeEmbed !== talk) return null;

    return (
      <Talk
        ref={talk}
        hideZendeskLogo={this.props.hideZendeskLogo}
        getFrameDimensions={this.props.getFrameDimensions}
        style={this.props.style}
        isMobile={this.props.fullscreen}
        updateFrameSize={this.props.updateFrameSize}
        talkConfig={this.props.talkConfig}
        helpCenterAvailable={this.isHelpCenterAvailable()}
        channelChoiceAvailable={this.isChannelChoiceAvailable()}
        onBackClick={this.onBackClick}
        zendeskSubdomain={this.props.zendeskSubdomain} />
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
        <Container
          style={this.props.style}
          position={this.props.position}
          onClick={this.onContainerClick}
          onDragEnter={this.onContainerDragEnter}>
          {this.renderSubmitTicket()}
          {this.renderChat()}
          {this.renderHelpCenter()}
          {this.renderChannelChoice()}
          {this.renderTalk()}
        </Container>
      </div>
    );
  }
}

const actionCreators = {
  updateActiveEmbed,
  updateEmbedAccessible,
  updateBackButtonVisibility,
  updateAuthenticated,
  hideChatNotification,
  updateChatScreen
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(WebWidget);
