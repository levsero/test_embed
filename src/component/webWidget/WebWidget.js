import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types';
import Chat from 'component/chat/Chat';
import Talk from 'component/talk/Talk';
import { ChannelChoice } from 'component/channelChoice/ChannelChoice';
import { ChatNotificationPopup } from 'component/chat/ChatNotificationPopup';
import { Container } from 'component/container/Container';
import HelpCenter from 'component/helpCenter/HelpCenter';
import SubmitTicket from 'component/submitTicket/SubmitTicket';
import { updateActiveEmbed,
  updateEmbedAccessible,
  updateBackButtonVisibility } from 'src/redux/modules/base';
import { chatNotificationDismissed,
  updateChatScreen,
  chatNotificationRespond,
  showStandaloneMobileNotification } from 'src/redux/modules/chat';
import { resetActiveArticle } from 'src/redux/modules/helpCenter';
import { getChatAvailable,
  getChatEnabled,
  getTalkAvailable,
  getTalkEnabled,
  getShowTicketFormsBackButton } from 'src/redux/modules/selectors';
import { getArticleViewActive,
  getSearchFieldFocused,
  getHasSearched,
  getResultsCount } from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { getBaseIsAuthenticated } from 'src/redux/modules/base/base-selectors';
import { getChatNotification,
  getIsChatting,
  getStandaloneMobileNotificationVisible } from 'src/redux/modules/chat/chat-selectors';
import { isCallbackEnabled } from 'src/redux/modules/talk/talk-selectors';
import { getZopimChatEmbed,
  getActiveEmbed,
  getChatStandalone } from 'src/redux/modules/base/base-selectors';
import { getTicketForms } from 'src/redux/modules/submitTicket/submitTicket-selectors';
import { getSettingsMobileNotificationsDisabled } from 'src/redux/modules/settings/settings-selectors';

const submitTicket = 'ticketSubmissionForm';
const helpCenter = 'helpCenterForm';
const chat = 'chat';
const zopimChat = 'zopimChat';
const channelChoice = 'channelChoice';
const talk = 'talk';
const mobileChatPopup = 'mobileChatPopup';
const noActiveEmbed = '';

const mapStateToProps = (state) => {
  return {
    articleViewActive: getArticleViewActive(state),
    helpCenterSearchFocused: getSearchFieldFocused(state),
    chatNotification: getChatNotification(state),
    chatStandaloneMobileNotificationVisible: getStandaloneMobileNotificationVisible(state),
    activeEmbed: getActiveEmbed(state),
    authenticated: getBaseIsAuthenticated(),
    talkEnabled: getTalkEnabled(state),
    talkAvailable: getTalkAvailable(state),
    callbackEnabled: isCallbackEnabled(state),
    chatAvailable: getChatAvailable(state),
    chatEnabled: getChatEnabled(state),
    oldChat: getZopimChatEmbed(state),
    ticketForms: getTicketForms(state),
    showTicketFormsBackButton: getShowTicketFormsBackButton(state),
    chatStandalone: getChatStandalone(state),
    isChatting: getIsChatting(state),
    hasSearched: getHasSearched(state),
    resultsCount: getResultsCount(state),
    mobileNotificationsDisabled: getSettingsMobileNotificationsDisabled(state)
  };
};

class WebWidget extends Component {
  static propTypes = {
    attachmentSender: PropTypes.func,
    buttonLabelKey: PropTypes.string,
    callbackEnabled: PropTypes.bool.isRequired,
    channelChoice: PropTypes.bool,
    chatNotification: PropTypes.object.isRequired,
    chatStandaloneMobileNotificationVisible: PropTypes.bool.isRequired,
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
    showTicketFormsBackButton: PropTypes.bool,
    style: PropTypes.object,
    subjectEnabled: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    submitTicketConfig: PropTypes.object,
    ticketForms: PropTypes.array.isRequired,
    ticketFieldSettings: PropTypes.array,
    ticketFormSettings: PropTypes.array,
    updateFrameSize: PropTypes.func,
    getFrameContentDocument: PropTypes.func,
    setFixedFrameStyles: PropTypes.func,
    zopimOnNext: PropTypes.func,
    closeFrame: PropTypes.func,
    onBackButtonClick: PropTypes.func,
    zendeskHost: PropTypes.string.isRequired,
    updateActiveEmbed: PropTypes.func.isRequired,
    updateBackButtonVisibility: PropTypes.func.isRequired,
    chatNotificationDismissed: PropTypes.func.isRequired,
    chatNotificationRespond: PropTypes.func.isRequired,
    updateChatScreen: PropTypes.func.isRequired,
    activeEmbed: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired,
    chatAvailable: PropTypes.bool.isRequired,
    chatEnabled: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool.isRequired,
    talkEnabled: PropTypes.bool.isRequired,
    talkConfig: PropTypes.object,
    resetActiveArticle: PropTypes.func.isRequired,
    articleViewActive: PropTypes.bool.isRequired,
    helpCenterSearchFocused: PropTypes.bool.isRequired,
    chatStandalone: PropTypes.bool.isRequired,
    isChatting: PropTypes.bool.isRequired,
    onShowMobile: PropTypes.func,
    hasSearched: PropTypes.bool.isRequired,
    showStandaloneMobileNotification: PropTypes.func.isRequired,
    resultsCount: PropTypes.number.isRequired,
    ipmHelpCenterAvailable: PropTypes.bool,
    mobileNotificationsDisabled: PropTypes.bool
  };

  static defaultProps = {
    buttonLabelKey: '',
    channelChoice: false,
    chatNotification: { show: false, playSound: false },
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
    style: null,
    submitTicketAvailable: true,
    submitTicketConfig: {},
    showTicketFormsBackButton: false,
    ticketFieldSettings: [],
    ticketFormSettings: [],
    updateBackButtonVisibility: () => {},
    updateFrameSize: () => {},
    setFixedFrameStyles: () => {},
    talkAvailable: false,
    talkOnline: false,
    zopimOnNext: () => {},
    closeFrame: () => {},
    onBackButtonClick: () => {},
    talkConfig: {},
    resetActiveArticle: () => {},
    articleViewActive: false,
    onShowMobile: () => {},
    ipmHelpCenterAvailable: false,
    mobileNotificationsDisabled: false
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

  getHelpCenterComponent = () => this.refs[helpCenter].getWrappedInstance();

  isHelpCenterAvailable = () => {
    const { helpCenterAvailable, helpCenterConfig, authenticated, isOnHelpCenterPage } = this.props;
    const signInRequired = _.get(helpCenterConfig, 'signInRequired', false);
    const helpCenterAccessible = (!signInRequired || isOnHelpCenterPage) || authenticated;

    return helpCenterAvailable && helpCenterAccessible;
  }

  isChannelChoiceAvailable = () => {
    const { channelChoice, submitTicketAvailable, talkAvailable, chatAvailable, isChatting } = this.props;
    const availableChannelCount = !!talkAvailable + !!submitTicketAvailable + !!chatAvailable;

    return (channelChoice || talkAvailable) && availableChannelCount > 1 && !isChatting;
  };

  noActiveEmbed = () => this.props.activeEmbed === '';

  showChat = (options = { proactive: false }) => {
    const { updateActiveEmbed, oldChat, zopimOnNext } = this.props;

    if (oldChat) {
      zopimOnNext();

      updateActiveEmbed(zopimChat);
    } else {
      updateActiveEmbed(chat);
      if (options.proactive) {
        this.props.updateChatScreen(CHATTING_SCREEN);
      }
    }
  }

  showProactiveChat = () => {
    if (this.props.fullscreen) {
      const { setFixedFrameStyles, showStandaloneMobileNotification } = this.props;
      const frameStyle = {
        height: '33%',
        background: 'transparent'
      };

      setFixedFrameStyles(frameStyle);
      showStandaloneMobileNotification();
    } else {
      const { proactive, show } = this.props.chatNotification;

      if (proactive && show) {
        this.showChat({ proactive: true });
      }
    }
  }

  resetActiveEmbed = () => {
    const { chatStandalone, updateActiveEmbed, updateBackButtonVisibility, talkAvailable,
      chatAvailable, articleViewActive, ipmHelpCenterAvailable } = this.props;
    let backButton = false;

    if (this.isHelpCenterAvailable()) {
      updateActiveEmbed(helpCenter);
      backButton = articleViewActive;
    } else if (ipmHelpCenterAvailable && articleViewActive) {
      // we only go into this condition if HC is injected by IPM
      updateActiveEmbed(helpCenter);
      backButton = false;
    } else if (this.isChannelChoiceAvailable()) {
      updateActiveEmbed(channelChoice);
    } else if (talkAvailable) {
      updateActiveEmbed(talk);
    } else if (chatAvailable || chatStandalone) {
      this.showChat();
    } else {
      updateActiveEmbed(submitTicket);
      backButton = this.props.showTicketFormsBackButton;
    }

    updateBackButtonVisibility(backButton);
  }

  show = (viaActivate = false) => {
    const { activeEmbed, chatAvailable, talkAvailable } = this.props;

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

    const channelChoiceUnavailable = (activeEmbed === channelChoice && !this.isChannelChoiceAvailable());
    const chatUnavailable = (activeEmbed === chat && !chatAvailable);
    const talkUnavailable = (activeEmbed === talk && !talkAvailable);

    if (
      this.noActiveEmbed() ||
      viaActivate ||
      chatUnavailable ||
      talkUnavailable ||
      channelChoiceUnavailable
    ) this.resetActiveEmbed();
  }

  showHelpCenter = () => {
    const { updateActiveEmbed, updateBackButtonVisibility, articleViewActive } = this.props;

    updateActiveEmbed(helpCenter);
    updateBackButtonVisibility(articleViewActive);
  }

  onNextClick = (embed) => {
    const {
      updateBackButtonVisibility,
      ipmHelpCenterAvailable,
      updateActiveEmbed,
      oldChat,
      chatAvailable,
      talkAvailable } = this.props;

    if (this.isChannelChoiceAvailable()) {
      updateActiveEmbed(channelChoice);
      if (!ipmHelpCenterAvailable) {
        updateBackButtonVisibility(true);
      }
    } else if (embed) {
      this.setComponent(embed);
    } else if (chatAvailable) {
      this.showChat();
      // TODO: track chat started
      if (!oldChat) {
        updateBackButtonVisibility(true);
      }
    } else if (talkAvailable) {
      updateActiveEmbed(talk);
      updateBackButtonVisibility(true);
    } else {
      updateActiveEmbed(submitTicket);
      if (!ipmHelpCenterAvailable) {
        updateBackButtonVisibility(true);
      }
    }
  }

  onCancelClick = () => {
    const { ipmHelpCenterAvailable, updateActiveEmbed, onCancel, updateBackButtonVisibility } = this.props;

    if (this.isHelpCenterAvailable()) {
      this.showHelpCenter();
    } else if (this.isChannelChoiceAvailable()) {
      updateActiveEmbed(channelChoice);
      updateBackButtonVisibility(false);
    }  else {
      if (!ipmHelpCenterAvailable) {
        updateActiveEmbed('');
      }
      onCancel();
    }
  }

  onBackClick = () => {
    const {
      ipmHelpCenterAvailable,
      activeEmbed,
      updateBackButtonVisibility,
      updateActiveEmbed,
      resetActiveArticle } = this.props;
    const rootComponent = this.getRootComponent();
    const helpCenterAvailable = this.isHelpCenterAvailable();
    const channelChoiceAvailable = this.isChannelChoiceAvailable();

    if (activeEmbed === helpCenter) {
      updateBackButtonVisibility(false);
      resetActiveArticle();
      if (ipmHelpCenterAvailable) updateActiveEmbed(channelChoice);
    } else if (this.props.showTicketFormsBackButton) {
      rootComponent.clearForm();
      updateBackButtonVisibility(helpCenterAvailable || channelChoiceAvailable);
    } else if (channelChoiceAvailable && activeEmbed !== channelChoice) {
      updateActiveEmbed(channelChoice);
      updateBackButtonVisibility(helpCenterAvailable);
    } else if (helpCenterAvailable) {
      this.showHelpCenter();
    } else {
      if (ipmHelpCenterAvailable) resetActiveArticle();
      updateActiveEmbed(channelChoice);
      updateBackButtonVisibility(false);
    }
  }

  onContainerClick = () => {
    const { activeEmbed } = this.props;
    const rootComponent = this.getRootComponent() || {};

    if (activeEmbed === noActiveEmbed) return;

    _.attempt(rootComponent.onContainerClick);
  };

  onContainerDragEnter = () => {
    const { activeEmbed } = this.props;

    if (activeEmbed === submitTicket || activeEmbed === chat) {
      this.getRootComponent().handleDragEnter();
    }
  }

  renderChat = () => {
    if (this.props.activeEmbed !== chat) return;

    const updateChatBackButtonVisibility = () => {
      this.props.updateBackButtonVisibility(
        this.isHelpCenterAvailable() ||
        this.isChannelChoiceAvailable()
      );
    };

    return (
      <Chat
        ref={chat}
        updateFrameSize={this.props.updateFrameSize}
        getFrameContentDocument={this.props.getFrameContentDocument}
        isMobile={this.props.fullscreen}
        hideZendeskLogo={this.props.hideZendeskLogo}
        handleCloseClick={(e) => this.props.closeFrame(e, { skipOnClose: true })}
        getFrameDimensions={this.props.getFrameDimensions}
        position={this.props.position}
        updateChatBackButtonVisibility={updateChatBackButtonVisibility}
        onBackButtonClick={this.props.onBackButtonClick}
      />
    );
  }

  renderHelpCenter = () => {
    if (!this.props.helpCenterAvailable && !this.props.ipmHelpCenterAvailable) return;

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
          position={this.props.position}
          contextualHelpEnabled={helpCenterConfig.contextualHelpEnabled}
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
          chatNotificationDismissed={this.props.chatNotificationDismissed}
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
          getFrameDimensions={this.props.getFrameDimensions}
          getFrameContentDocument={this.props.getFrameContentDocument}
          hideZendeskLogo={this.props.hideZendeskLogo}
          maxFileCount={submitTicketConfig.maxFileCount}
          maxFileSize={submitTicketConfig.maxFileSize}
          onCancel={this.onCancelClick}
          onSubmitted={this.props.onSubmitted}
          position={submitTicketConfig.position}
          showBackButton={this.props.updateBackButtonVisibility}
          style={this.props.style}
          subjectEnabled={this.props.subjectEnabled}
          ticketFieldSettings={this.props.ticketFieldSettings}
          ticketFormSettings={this.props.ticketFormSettings}
          updateFrameSize={this.props.updateFrameSize}
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
        getFrameContentDocument={this.props.getFrameContentDocument}
        getFrameDimensions={this.props.getFrameDimensions} />
    );
  }

  renderChatNotification = () => {
    // For now only display notifications inside Help Center
    if (this.props.activeEmbed !== helpCenter || !this.props.hasSearched) return null;

    const onNotificatonResponded = () => {
      this.onNextClick(chat);
      this.props.chatNotificationRespond();
    };

    const shouldShow = !this.props.fullscreen || !this.props.helpCenterSearchFocused;

    return (
      <ChatNotificationPopup
        resultsCount={this.props.resultsCount}
        isMobile={this.props.fullscreen}
        notification={this.props.chatNotification}
        shouldShow={shouldShow}
        chatNotificationRespond={onNotificatonResponded}
        chatNotificationDismissed={this.props.chatNotificationDismissed} />
    );
  }

  dismissStandaloneChatPopup = () => {
    const onHide = () => {
      this.props.chatNotificationDismissed();
      this.props.setFixedFrameStyles();
    };

    this.props.closeFrame({}, { onHide });
  }

  renderStandaloneChatPopup() {
    const {
      style,
      chatNotification,
      chatNotificationRespond,
      setFixedFrameStyles
    } = this.props;
    const onNotificatonResponded = () => {
      chatNotificationRespond();
      setFixedFrameStyles();
      this.props.onShowMobile();
      this.showChat({ proactive: true });
    };
    const containerStyle = { ...style, background: 'transparent' };
    const notification = { ...chatNotification, show: true };

    return (
      <div style={style} data-embed={mobileChatPopup}>
        <Container style={containerStyle} fullscreen={true}>
          <ChatNotificationPopup
            isMobile={true}
            notification={notification}
            shouldShow={true}
            chatNotificationRespond={onNotificatonResponded}
            chatNotificationDismissed={this.dismissStandaloneChatPopup} />
        </Container>
      </div>
    );
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    const { fullscreen } = this.props;

    if (fullscreen && this.props.chatStandaloneMobileNotificationVisible && !this.props.mobileNotificationsDisabled)
      return this.renderStandaloneChatPopup();

    // TODO: Once single iframe is GA'd the containers for each child can be moved
    // here and this won't be needed to fix dodgy animation.
    const width = fullscreen ? '100%' : '342px';
    const style = { width };

    return (
      // data-embed is needed for our intergration tests
      <div style={style} data-embed={this.props.activeEmbed}>
        <Container
          style={this.props.style}
          fullscreen={fullscreen}
          position={this.props.position}
          onClick={this.onContainerClick}
          onDragEnter={this.onContainerDragEnter}>
          {this.renderSubmitTicket()}
          {this.renderChat()}
          {this.renderHelpCenter()}
          {this.renderChannelChoice()}
          {this.renderTalk()}
          {this.renderChatNotification()}
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
  chatNotificationDismissed,
  chatNotificationRespond,
  updateChatScreen,
  showStandaloneMobileNotification
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(WebWidget);
