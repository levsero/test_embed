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
  updateBackButtonVisibility,
  nextButtonClicked,
  cancelButtonClicked } from 'src/redux/modules/base';
import { chatNotificationDismissed,
  updateChatScreen,
  chatNotificationRespond,
  showStandaloneMobileNotification } from 'src/redux/modules/chat';
import { resetActiveArticle } from 'src/redux/modules/helpCenter';
import { getChatAvailable,
  getChatOfflineAvailable,
  getChatEnabled,
  getTalkAvailable,
  getTalkEnabled,
  getShowTicketFormsBackButton } from 'src/redux/modules/selectors';
import { getArticleViewActive,
  getSearchFieldFocused,
  getHasSearched,
  getResultsCount,
  getContextualHelpRequestNeeded } from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { getBaseIsAuthenticated,
  getZopimChatEmbed,
  getActiveEmbed,
  getChatStandalone } from 'src/redux/modules/base/base-selectors';
import { getChatNotification,
  getIsChatting,
  getStandaloneMobileNotificationVisible } from 'src/redux/modules/chat/chat-selectors';
import { isCallbackEnabled } from 'src/redux/modules/talk/talk-selectors';
import { getTicketForms } from 'src/redux/modules/submitTicket/submitTicket-selectors';
import { getSettingsMobileNotificationsDisabled } from 'src/redux/modules/settings/settings-selectors';
import { getHelpCenterAvailable,
  getChannelChoiceAvailable,
  getSubmitTicketAvailable } from 'src/redux/modules/selectors';

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
    contextualHelpRequestNeeded: getContextualHelpRequestNeeded(state),
    activeEmbed: getActiveEmbed(state),
    authenticated: getBaseIsAuthenticated(),
    talkEnabled: getTalkEnabled(state),
    talkAvailable: getTalkAvailable(state),
    callbackEnabled: isCallbackEnabled(state),
    chatAvailable: getChatAvailable(state),
    chatOfflineAvailable: getChatOfflineAvailable(state),
    chatEnabled: getChatEnabled(state),
    oldChat: getZopimChatEmbed(state),
    ticketForms: getTicketForms(state),
    showTicketFormsBackButton: getShowTicketFormsBackButton(state),
    chatStandalone: getChatStandalone(state),
    isChatting: getIsChatting(state),
    hasSearched: getHasSearched(state),
    resultsCount: getResultsCount(state),
    mobileNotificationsDisabled: getSettingsMobileNotificationsDisabled(state),
    helpCenterAvailable: getHelpCenterAvailable(state),
    channelChoiceAvailable: getChannelChoiceAvailable(state),
    submitTicketAvailable: getSubmitTicketAvailable(state)
  };
};

class WebWidget extends Component {
  static propTypes = {
    attachmentSender: PropTypes.func,
    buttonLabelKey: PropTypes.string,
    callbackEnabled: PropTypes.bool.isRequired,
    chatNotification: PropTypes.object.isRequired,
    chatStandaloneMobileNotificationVisible: PropTypes.bool.isRequired,
    contextualHelpRequestNeeded: PropTypes.bool,
    formTitleKey: PropTypes.string,
    fullscreen: PropTypes.bool,
    helpCenterConfig: PropTypes.object,
    isOnHelpCenterPage: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    localeFallbacks: PropTypes.array,
    oldChat: PropTypes.bool.isRequired,
    onSubmitted: PropTypes.func,
    originalArticleButton: PropTypes.bool,
    position: PropTypes.string,
    showTicketFormsBackButton: PropTypes.bool,
    style: PropTypes.object,
    subjectEnabled: PropTypes.bool,
    submitTicketConfig: PropTypes.object,
    ticketForms: PropTypes.array.isRequired,
    ticketFieldSettings: PropTypes.array,
    ticketFormSettings: PropTypes.array,
    getFrameContentDocument: PropTypes.func,
    zopimOnNext: PropTypes.func,
    closeFrame: PropTypes.func,
    onBackButtonClick: PropTypes.func,
    updateActiveEmbed: PropTypes.func.isRequired,
    updateBackButtonVisibility: PropTypes.func.isRequired,
    chatNotificationDismissed: PropTypes.func.isRequired,
    chatNotificationRespond: PropTypes.func.isRequired,
    updateChatScreen: PropTypes.func.isRequired,
    nextButtonClicked: PropTypes.func.isRequired,
    cancelButtonClicked: PropTypes.func.isRequired,
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
    mobileNotificationsDisabled: PropTypes.bool,
    chatOfflineAvailable: PropTypes.bool.isRequired,
    helpCenterAvailable: PropTypes.bool.isRequired,
    channelChoiceAvailable: PropTypes.bool.isRequired,
    submitTicketAvailable: PropTypes.bool.isRequired
  };

  static defaultProps = {
    buttonLabelKey: '',
    chatNotification: { show: false, playSound: false },
    contextualHelpRequestNeeded: false,
    formTitleKey: 'message',
    fullscreen: true,
    helpCenterAvailable: false,
    helpCenterConfig: {},
    isOnHelpCenterPage: false,
    hideZendeskLogo: false,
    localeFallbacks: [],
    onSubmitted: () => {},
    originalArticleButton: true,
    position: 'right',
    style: null,
    submitTicketConfig: {},
    showTicketFormsBackButton: false,
    ticketFieldSettings: [],
    ticketFormSettings: [],
    updateBackButtonVisibility: () => {},
    nextButtonClicked: () => {},
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

  getActiveComponent = () => {
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
      this.props.showStandaloneMobileNotification();
    } else {
      const { proactive, show } = this.props.chatNotification;

      if (proactive && show) {
        this.showChat({ proactive: true });
      }
    }
  }

  show = () => {
    const { activeEmbed, chatAvailable, channelChoiceAvailable } = this.props;

    // If chat came online when contact form was open it should
    // replace it when it's next opened.
    if (activeEmbed === submitTicket && chatAvailable && !channelChoiceAvailable) {
      this.showChat();
      return;
    }

    // If zopimChat is the active embed, we need to show the chat window regardless online or offline.
    // If zopimChat becomes offline, the activeEmbed resets to "".
    if (activeEmbed === zopimChat) {
      this.props.zopimOnNext();
      return;
    }
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
      talkAvailable,
      chatOfflineAvailable,
      channelChoiceAvailable,
      nextButtonClicked } = this.props;

    if (channelChoiceAvailable) {
      updateActiveEmbed(channelChoice);
      if (!ipmHelpCenterAvailable) {
        updateBackButtonVisibility(true);
      }
    } else if (embed) {
      this.setComponent(embed);
    } else if (chatAvailable || chatOfflineAvailable) {
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

    nextButtonClicked();
  }

  onCancelClick = () => {
    const { updateActiveEmbed, cancelButtonClicked, updateBackButtonVisibility,
      helpCenterAvailable, channelChoiceAvailable } = this.props;

    if (helpCenterAvailable) {
      this.showHelpCenter();
    } else if (channelChoiceAvailable) {
      updateActiveEmbed(channelChoice);
      updateBackButtonVisibility(false);
    }  else {
      cancelButtonClicked();
    }
  }

  onBackClick = () => {
    const {
      ipmHelpCenterAvailable,
      activeEmbed,
      updateBackButtonVisibility,
      updateActiveEmbed,
      resetActiveArticle,
      helpCenterAvailable,
      channelChoiceAvailable } = this.props;
    const activeComponent = this.getActiveComponent();

    if (activeEmbed === helpCenter) {
      updateBackButtonVisibility(false);
      resetActiveArticle();
      if (ipmHelpCenterAvailable) updateActiveEmbed(channelChoice);
    } else if (this.props.showTicketFormsBackButton) {
      activeComponent.clearForm();
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
    const activeComponent = this.getActiveComponent() || {};

    if (activeEmbed === noActiveEmbed) return;

    _.attempt(activeComponent.onContainerClick);
  };

  onContainerDragEnter = () => {
    const { activeEmbed } = this.props;

    if (activeEmbed === submitTicket || activeEmbed === chat) {
      this.getActiveComponent().handleDragEnter();
    }
  }

  renderChat = () => {
    if (this.props.activeEmbed !== chat) return;

    const updateChatBackButtonVisibility = () => {
      this.props.updateBackButtonVisibility(
        this.props.helpCenterAvailable ||
        this.props.channelChoiceAvailable
      );
    };

    return (
      <Chat
        ref={chat}
        getFrameContentDocument={this.props.getFrameContentDocument}
        isMobile={this.props.fullscreen}
        hideZendeskLogo={this.props.hideZendeskLogo}
        handleCloseClick={(e) => this.props.closeFrame(e, { skipOnClose: true })}
        position={this.props.position}
        updateChatBackButtonVisibility={updateChatBackButtonVisibility}
        onBackButtonClick={this.props.onBackButtonClick}
      />
    );
  }

  renderHelpCenter = () => {
    if (!this.props.helpCenterAvailable && !this.props.ipmHelpCenterAvailable) return;
    if (this.props.activeEmbed !== helpCenter) return null;

    const { helpCenterConfig, submitTicketAvailable, chatAvailable,
      chatOfflineAvailable, talkAvailable, channelChoiceAvailable } = this.props;
    const classes = this.props.activeEmbed !== helpCenter ? 'u-isHidden' : '';
    const showNextButton = submitTicketAvailable || chatAvailable || chatOfflineAvailable || talkAvailable;

    return (
      <div className={classes}>
        <HelpCenter
          ref={helpCenter}
          chatOfflineAvailable={this.props.chatOfflineAvailable}
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
          originalArticleButton={this.props.originalArticleButton}
          localeFallbacks={this.props.localeFallbacks}
          channelChoice={channelChoiceAvailable}
          callbackEnabled={this.props.callbackEnabled}
          submitTicketAvailable={submitTicketAvailable}
          chatAvailable={chatAvailable}
          chatNotificationDismissed={this.props.chatNotificationDismissed}
          updateChatScreen={this.props.updateChatScreen} />
      </div>
    );
  }

  renderSubmitTicket = () => {
    if (!this.props.submitTicketAvailable) return null;
    if (this.props.activeEmbed !== submitTicket) return null;

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
        chatOfflineAvailable={this.props.chatOfflineAvailable}
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
        talkConfig={this.props.talkConfig}
        helpCenterAvailable={this.props.helpCenterAvailable}
        channelChoiceAvailable={this.props.channelChoiceAvailable}
        onBackClick={this.onBackClick}
        getFrameContentDocument={this.props.getFrameContentDocument} />
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
    };

    this.props.closeFrame({}, { onHide });
  }

  renderStandaloneChatPopup() {
    const {
      style,
      chatNotification,
      chatNotificationRespond
    } = this.props;
    const onNotificatonResponded = () => {
      chatNotificationRespond();
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
  showStandaloneMobileNotification,
  nextButtonClicked,
  cancelButtonClicked
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(WebWidget);
