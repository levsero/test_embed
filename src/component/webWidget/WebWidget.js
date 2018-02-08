import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import Chat from 'component/chat/Chat';
import Talk from 'component/talk/Talk';
import { ChannelChoice } from 'component/channelChoice/ChannelChoice';
import { Container } from 'component/container/Container';
import HelpCenter from 'component/helpCenter/HelpCenter';
import SubmitTicket from 'component/submitTicket/SubmitTicket';
import { updateActiveEmbed,
         updateEmbedAccessible,
         updateBackButtonVisibility,
         updateAuthenticated } from 'src/redux/modules/base';
import { hideChatNotification, updateChatScreen } from 'src/redux/modules/chat';
import { resetActiveArticle } from 'src/redux/modules/helpCenter';
import { getChatAvailable,
         getChatEnabled,
         getTalkAvailable,
         getTalkEnabled,
         getShowTicketFormsBackButton } from 'src/redux/modules/selectors';
import { getArticleViewActive } from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { getChatNotification } from 'src/redux/modules/chat/chat-selectors';
import { isCallbackEnabled } from 'src/redux/modules/talk/talk-selectors';
import { getZopimChatEmbed, getActiveEmbed, getAuthenticated } from 'src/redux/modules/base/base-selectors';
import { getTicketForms } from 'src/redux/modules/submitTicket/submitTicket-selectors';

const submitTicket = 'ticketSubmissionForm';
const helpCenter = 'helpCenterForm';
const chat = 'chat';
const zopimChat = 'zopimChat';
const channelChoice = 'channelChoice';
const talk = 'talk';

const mapStateToProps = (state) => {
  return {
    articleViewActive: getArticleViewActive(state),
    chatNotification: getChatNotification(state),
    activeEmbed: getActiveEmbed(state),
    authenticated: getAuthenticated(state),
    talkEnabled: getTalkEnabled(state),
    talkAvailable: getTalkAvailable(state),
    callbackEnabled: isCallbackEnabled(state),
    chatAvailable: getChatAvailable(state),
    chatEnabled: getChatEnabled(state),
    oldChat: getZopimChatEmbed(state),
    ticketForms: getTicketForms(state),
    showTicketFormsBackButton: getShowTicketFormsBackButton(state)
  };
};

class WebWidget extends Component {
  static propTypes = {
    attachmentSender: PropTypes.func,
    buttonLabelKey: PropTypes.string,
    callbackEnabled: PropTypes.bool.isRequired,
    channelChoice: PropTypes.bool,
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
    oldChat: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
    onSubmitted: PropTypes.func,
    originalArticleButton: PropTypes.bool,
    position: PropTypes.string,
    showTicketFormsBackButton: PropTypes.bool.isRequired,
    showCloseButton: PropTypes.func,
    style: PropTypes.object,
    subjectEnabled: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    submitTicketConfig: PropTypes.object,
    submitTicketSender: PropTypes.func,
    tags: PropTypes.array,
    ticketForms: PropTypes.array.isRequired,
    ticketFieldSettings: PropTypes.array,
    ticketFormSettings: PropTypes.array,
    updateFrameSize: PropTypes.func,
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
    chatAvailable: PropTypes.bool.isRequired,
    chatEnabled: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool.isRequired,
    talkEnabled: PropTypes.bool.isRequired,
    talkConfig: PropTypes.object,
    resetActiveArticle: PropTypes.func.isRequired,
    articleViewActive: PropTypes.bool.isRequired
  };

  static defaultProps = {
    buttonLabelKey: '',
    channelChoice: false,
    chatNotification: { show: false, playSound: false },
    newDesign: false,
    formTitleKey: 'message',
    fullscreen: true,
    helpCenterAvailable: false,
    helpCenterConfig: {},
    isOnHelpCenterPage: false,
    hideZendeskLogo: false,
    localeFallbacks: [],
    onCancel: () => {},
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
    talkAvailable: false,
    talkOnline: false,
    zopimOnNext: () => {},
    closeFrame: () => {},
    talkConfig: {},
    resetActiveArticle: () => {},
    articleViewActive: false
  };

  setComponent = (activeComponent) => {
    this.props.updateBackButtonVisibility(true);

    if (activeComponent === chat) {
      this.showChat();
    } else {
      this.props.updateActiveEmbed(activeComponent);
    }
  }

  getActiveComponent = () => this.props.activeEmbed;

  getRootComponent = () => {
    const component = this.refs[this.props.activeEmbed];

    return component && component.getWrappedInstance ? component.getWrappedInstance() : component;
  };

  getSubmitTicketComponent = () => {
    const component = this.refs[submitTicket];

    return (component)
      ? component.getWrappedInstance()
      : null;
  }

  getChatComponent = () => this.refs[chat].getWrappedInstance();

  getHelpCenterComponent = () => this.refs[helpCenter].getWrappedInstance();

  isHelpCenterAvailable = () => {
    const { helpCenterAvailable, helpCenterConfig, authenticated, isOnHelpCenterPage } = this.props;
    const signInRequired = _.get(helpCenterConfig, 'signInRequired', false);
    const helpCenterAccessible = (!signInRequired || isOnHelpCenterPage) || authenticated;

    return helpCenterAvailable && helpCenterAccessible;
  }

  isChannelChoiceAvailable = () => {
    const { channelChoice, submitTicketAvailable, talkAvailable, chatAvailable } = this.props;
    const channels = [talkAvailable, submitTicketAvailable, chatAvailable];
    const channelsAvailable = _.filter(channels, _.identity);

    return (channelChoice || talkAvailable) && channelsAvailable.length > 1;
  };

  noActiveEmbed = () => this.props.activeEmbed === '';

  showChat = () => {
    const { activeEmbed, updateActiveEmbed, oldChat, zopimOnNext } = this.props;

    if (oldChat) {
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
    const { updateActiveEmbed, updateBackButtonVisibility, talkAvailable, chatAvailable } = this.props;
    let backButton = false;

    if (this.isHelpCenterAvailable()) {
      updateActiveEmbed(helpCenter);
      backButton = this.props.articleViewActive;
    } else if (this.isChannelChoiceAvailable()) {
      updateActiveEmbed(channelChoice);
    } else if (talkAvailable) {
      updateActiveEmbed(talk);
    } else if (chatAvailable) {
      this.showChat();
    } else {
      updateActiveEmbed(submitTicket);
      backButton = this.props.showTicketFormsBackButton;
    }

    updateBackButtonVisibility(backButton);
  }

  show = (viaActivate = false) => {
    const { activeEmbed, chatAvailable } = this.props;

    // If chat came online when contact form was open it should
    // replace it when it's next opened.
    if (activeEmbed === submitTicket && chatAvailable && !this.isChannelChoiceAvailable()) {
      this.showChat();
      return;
    }

    // If zopimChat is the active embed, we need to show the chat window regardless online or offline.
    // If zopimChat becomes offline, the activeEmbed resets to "".
    if (activeEmbed === zopimChat) {
      this.props.zopimOnNext();
      return;
    }
    // If zopim or talk has gone offline we will need to reset the embed
    const chatOffline = _.includes([zopimChat, channelChoice], activeEmbed) && !chatAvailable;
    const talkOffline = _.includes([talk, channelChoice], activeEmbed) && !this.props.talkAvailable;

    if (this.noActiveEmbed() || viaActivate || chatOffline || talkOffline) this.resetActiveEmbed();
  }

  showHelpCenter = () => {
    const { updateActiveEmbed, updateBackButtonVisibility, articleViewActive } = this.props;

    updateActiveEmbed(helpCenter);
    updateBackButtonVisibility(articleViewActive);
  }

  onNextClick = (embed) => {
    const { updateBackButtonVisibility, updateActiveEmbed, oldChat, chatAvailable, talkAvailable } = this.props;

    if (embed) {
      this.setComponent(embed);
    } else if (talkAvailable) {
      updateActiveEmbed(talk);
      updateBackButtonVisibility(true);
    } else if (chatAvailable) {
      this.showChat();
      // TODO: track chat started
      if (!oldChat) {
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
    const { activeEmbed, updateBackButtonVisibility, updateActiveEmbed, resetActiveArticle } = this.props;
    const helpCenterAvailable = this.isHelpCenterAvailable();
    const channelChoiceAvailable = this.isChannelChoiceAvailable();

    if (activeEmbed === helpCenter) {
      updateBackButtonVisibility(false);
      resetActiveArticle();
    } else if (this.props.showTicketFormsBackButton) {
      rootComponent.clearForm();
      updateBackButtonVisibility(helpCenterAvailable || channelChoiceAvailable);
    } else if (helpCenterAvailable) {
      this.showHelpCenter();
    } else {
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
        isMobile={this.props.fullscreen}
        newDesign={this.props.newDesign}
        updateFrameSize={this.props.updateFrameSize}
        updateChatScreen={this.props.updateChatScreen}
        position={this.props.position} />
    );
  }

  renderHelpCenter = () => {
    if (!this.props.helpCenterAvailable) return;

    const { helpCenterConfig, submitTicketAvailable, chatAvailable, talkAvailable } = this.props;
    const classes = this.props.activeEmbed !== helpCenter ? 'u-isHidden' : '';
    const showNextButton = submitTicketAvailable || chatAvailable || talkAvailable;

    return (
      <div className={classes}>
        <HelpCenter
          ref={helpCenter}
          notification={this.props.chatNotification}
          chatEnabled={this.props.chatEnabled}
          talkEnabled={this.props.talkEnabled}
          talkAvailable={this.props.talkAvailable}
          hideZendeskLogo={this.props.hideZendeskLogo}
          onNextClick={this.onNextClick}
          newDesign={this.props.newDesign}
          position={this.props.position}
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
          submitTicketAvailable={this.props.submitTicketAvailable}
          chatAvailable={chatAvailable}
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
          viaId={this.props.viaId}
          fullscreen={this.props.fullscreen} />
      </div>
    );
  }

  renderChannelChoice = () => {
    if (this.props.activeEmbed !== channelChoice) return null;

    return (
      <ChannelChoice
        ref={channelChoice}
        style={this.props.style}
        chatAvailable={this.props.chatAvailable}
        talkEnabled={this.props.talkEnabled}
        talkAvailable={this.props.talkAvailable}
        callbackEnabled={this.props.callbackEnabled}
        submitTicketAvailable={this.props.submitTicketAvailable}
        chatEnabled={this.props.chatEnabled}
        isMobile={this.props.fullscreen}
        onNextClick={this.setComponent}
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
        style={this.props.style}
        isMobile={this.props.fullscreen}
        updateFrameSize={this.props.updateFrameSize}
        talkConfig={this.props.talkConfig}
        helpCenterAvailable={this.isHelpCenterAvailable()}
        channelChoiceAvailable={this.isChannelChoiceAvailable()}
        onBackClick={this.onBackClick}
        zendeskSubdomain={this.props.zendeskSubdomain}
        getFrameDimensions={this.props.getFrameDimensions} />
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
  resetActiveArticle,
  updateActiveEmbed,
  updateEmbedAccessible,
  updateBackButtonVisibility,
  updateAuthenticated,
  hideChatNotification,
  updateChatScreen
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(WebWidget);
