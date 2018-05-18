import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';

import { ButtonPill } from 'component/button/ButtonPill';
import ChattingScreen from 'component/chat/chatting/ChattingScreen';
import AgentScreen from 'component/chat/agents/AgentScreen';
import { ChatHeader } from 'component/chat/ChatHeader';
import { ChatMenu } from 'component/chat/ChatMenu';
import { ChatPrechatForm } from 'component/chat/ChatPrechatForm';
import { ChatFeedbackForm } from 'component/chat/ChatFeedbackForm';
import { ChatPopup } from 'component/chat/ChatPopup';
import { ChatContactDetailsPopup } from 'component/chat/ChatContactDetailsPopup';
import { ChatEmailTranscriptPopup } from 'component/chat/ChatEmailTranscriptPopup';
import { ChatReconnectionBubble } from 'component/chat/ChatReconnectionBubble';
import { ChatOfflineMessageForm } from 'component/chat/ChatOfflineMessageForm';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { AttachmentBox } from 'component/attachment/AttachmentBox';
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
import {
  endChat,
  endChatViaPostChatScreen,
  sendMsg,
  sendAttachments,
  setVisitorInfo,
  setDepartment,
  sendChatRating,
  sendChatComment,
  updateChatScreen,
  handleSoundIconClick,
  sendEmailTranscript,
  resetEmailTranscript,
  handleReconnect,
  handlePreChatFormChange,
  updateMenuVisibility,
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility,
  resetCurrentMessage,
  sendOfflineMessage,
  clearDepartment,
  initiateSocialLogout } from 'src/redux/modules/chat';
import * as screens from 'src/redux/modules/chat/chat-screen-types';
import * as selectors from 'src/redux/modules/chat/chat-selectors';
import { locals as styles } from './ChatOnline.scss';
import { CONNECTION_STATUSES, DEPARTMENT_STATUSES } from 'constants/chat';

const mapStateToProps = (state) => {
  const prechatForm = selectors.getPrechatFormSettings(state);
  const prechatFormFields = selectors.getPrechatFormFields(state);

  return {
    attachmentsEnabled: selectors.getAttachmentsEnabled(state),
    chats: selectors.getChatMessages(state),
    events: selectors.getChatEvents(state),
    screen: selectors.getChatScreen(state),
    prechatFormSettings: { ...prechatForm, form: prechatFormFields },
    postChatFormSettings: selectors.getPostchatFormSettings(state),
    isChatting: selectors.getIsChatting(state),
    rating: selectors.getChatRating(state),
    visitor: selectors.getChatVisitor(state),
    concierges: selectors.getCurrentConcierges(state),
    userSoundSettings: selectors.getUserSoundSettings(state),
    emailTranscript: selectors.getEmailTranscript(state),
    preChatFormState: selectors.getPreChatFormState(state),
    editContactDetails: selectors.getEditContactDetails(state),
    menuVisible: selectors.getMenuVisible(state),
    agentJoined: selectors.getAgentJoined(state),
    connection: selectors.getConnection(state),
    loginSettings: selectors.getLoginSettings(state),
    departments: selectors.getDepartments(state),
    offlineMessage: selectors.getOfflineMessage(state),
    authUrls: selectors.getAuthUrls(state),
    socialLogin: selectors.getSocialLogin(state),
    chatVisitor: selectors.getChatVisitor(state)
  };
};

class Chat extends Component {
  static propTypes = {
    attachmentsEnabled: PropTypes.bool.isRequired,
    concierges: PropTypes.array.isRequired,
    chats: PropTypes.array.isRequired,
    events: PropTypes.array.isRequired,
    endChat: PropTypes.func.isRequired,
    endChatViaPostChatScreen: PropTypes.func.isRequired,
    screen: PropTypes.string.isRequired,
    sendAttachments: PropTypes.func.isRequired,
    prechatFormSettings: PropTypes.object.isRequired,
    postChatFormSettings: PropTypes.object.isRequired,
    isMobile: PropTypes.bool,
    sendMsg: PropTypes.func.isRequired,
    setVisitorInfo: PropTypes.func.isRequired,
    setDepartment: PropTypes.func.isRequired,
    onBackButtonClick: PropTypes.func,
    handleReconnect: PropTypes.func.isRequired,
    sendChatRating: PropTypes.func.isRequired,
    sendChatComment: PropTypes.func.isRequired,
    updateChatScreen: PropTypes.func.isRequired,
    isChatting: PropTypes.bool.isRequired,
    rating: PropTypes.object.isRequired,
    handleSoundIconClick: PropTypes.func.isRequired,
    userSoundSettings: PropTypes.bool.isRequired,
    getFrameDimensions: PropTypes.func.isRequired,
    sendEmailTranscript: PropTypes.func.isRequired,
    emailTranscript: PropTypes.object.isRequired,
    resetEmailTranscript: PropTypes.func,
    visitor: PropTypes.object.isRequired,
    preChatFormState: PropTypes.object,
    handlePreChatFormChange: PropTypes.func,
    updateFrameSize: PropTypes.func.isRequired,
    editContactDetails: PropTypes.object.isRequired,
    updateContactDetailsVisibility: PropTypes.func.isRequired,
    updateEmailTranscriptVisibility: PropTypes.func.isRequired,
    updateChatBackButtonVisibility: PropTypes.func,
    updateMenuVisibility: PropTypes.func,
    menuVisible: PropTypes.bool,
    agentJoined: PropTypes.bool,
    connection: PropTypes.string.isRequired,
    resetCurrentMessage: PropTypes.func,
    loginSettings: PropTypes.object.isRequired,
    departments: PropTypes.object,
    offlineMessage: PropTypes.object,
    sendOfflineMessage: PropTypes.func,
    clearDepartment: PropTypes.func,
    hideZendeskLogo: PropTypes.bool,
    authUrls: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    chatVisitor: PropTypes.object.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired
  };

  static defaultProps = {
    attachmentsEnabled: false,
    isMobile: false,
    onBackButtonClick: () => {},
    rating: {},
    chats: [],
    events: [],
    preChatFormSettings: {},
    postChatFormSettings: {},
    handleSoundIconClick: () => {},
    userSoundSettings: true,
    getFrameDimensions: () => {},
    sendEmailTranscript: () => {},
    emailTranscript: {},
    resetEmailTranscript: () => {},
    editContactDetails: {},
    updateChatBackButtonVisibility: () => {},
    updateMenuVisibility: () => {},
    updateFrameSize: () => {},
    menuVisible: false,
    connection: '',
    resetCurrentMessage: () => {},
    loginSettings: {},
    visitor: {},
    departments: {},
    offlineMessage: {},
    sendOfflineMessage: () => {},
    clearDepartment: () => {},
    hideZendeskLogo: false
  };

  constructor(props) {
    super(props);

    this.state = {
      showEndChatMenu: false
    };

    this.updateFrameSizeTimer = null;
  }

  componentDidMount() {
    this.props.updateChatBackButtonVisibility();
  }

  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.chats && !nextProps.events) return;

    this.props.updateChatBackButtonVisibility();
  }

  componentWillUnmount() {
    clearTimeout(this.updateFrameSizeTimer);
  }

  toggleMenu = () => {
    this.props.updateMenuVisibility(!this.props.menuVisible);
  }

  onContainerClick = () => {
    this.setState({
      showEndChatMenu: false
    });

    this.props.updateMenuVisibility(false);
    this.props.updateContactDetailsVisibility(false);
    this.props.updateEmailTranscriptVisibility(false);
  }

  onPrechatFormComplete = (info) => {
    const selectedDepartment = parseInt(info.department);
    const isSelectedDepartmentOffline = (!!selectedDepartment &&
      this.props.departments[selectedDepartment].status !== DEPARTMENT_STATUSES.ONLINE);

    if (isSelectedDepartmentOffline) {
      const successCallback = () => this.props.updateChatScreen(screens.OFFLINE_MESSAGE_SCREEN);
      const failureCallback = () => this.props.updateChatScreen(screens.PRECHAT_SCREEN);

      this.props.updateChatScreen(screens.LOADING_SCREEN);
      this.props.sendOfflineMessage(info, successCallback, failureCallback);
    } else {
      const sendOnlineMessage = () => info.message ? this.props.sendMsg(info.message) : null;

      if (selectedDepartment) {
        this.props.setDepartment(
          selectedDepartment,
          sendOnlineMessage,
          sendOnlineMessage
        );
      } else {
        this.props.clearDepartment(sendOnlineMessage);
      }
      this.props.setVisitorInfo(
        _.omitBy({
          display_name: info.display_name || info.name,
          email: info.email,
          phone: info.phone
        }, _.isNil)
      );
      this.props.updateChatScreen(screens.CHATTING_SCREEN);
    }

    this.props.resetCurrentMessage();
  }

  showContactDetailsFn = (e) => {
    e.stopPropagation();
    this.props.updateContactDetailsVisibility(true);
  };

  showEmailTranscriptFn = (e) => {
    e.stopPropagation();
    this.props.updateEmailTranscriptVisibility(true);
  };

  renderChatMenu = () => {
    const {
      userSoundSettings,
      isChatting,
      handleSoundIconClick,
      attachmentsEnabled,
      sendAttachments,
      onBackButtonClick,
      isMobile,
      loginSettings,
      menuVisible,
      updateMenuVisibility,
      chats
    } = this.props;
    const showChatEndFn = (e) => {
      e.stopPropagation();
      updateMenuVisibility(false);
      this.setState({
        showEndChatMenu: true
      });
    };
    const toggleSoundFn = () => {
      handleSoundIconClick({ sound: !userSoundSettings });
    };

    return (
      <ChatMenu
        show={menuVisible}
        playSound={userSoundSettings}
        disableEndChat={!isChatting}
        attachmentsEnabled={attachmentsEnabled}
        onGoBackClick={onBackButtonClick}
        onSendFileClick={sendAttachments}
        endChatOnClick={showChatEndFn}
        contactDetailsOnClick={this.showContactDetailsFn}
        emailTranscriptOnClick={this.showEmailTranscriptFn}
        onSoundClick={toggleSoundFn}
        emailTranscriptEnabled={chats.length > 0}
        isMobile={isMobile}
        loginEnabled={loginSettings.enabled} />
    );
  }

  renderPrechatScreen = () => {
    if (this.props.screen !== screens.PRECHAT_SCREEN &&
        this.props.screen !== screens.OFFLINE_MESSAGE_SCREEN &&
        this.props.screen !== screens.LOADING_SCREEN) return;

    const { form, message } = this.props.prechatFormSettings;
    const scrollContainerClasses = classNames(
      styles.scrollContainer,
      { [styles.mobileContainer]: this.props.isMobile }
    );
    const logoFooterClasses = classNames({
      [styles.logoFooter]: !this.props.hideZendeskLogo
    });
    let formScreen = null;

    if (this.props.screen === screens.PRECHAT_SCREEN) {
      formScreen = (
        <ChatPrechatForm
          authUrls={this.props.authUrls}
          socialLogin={this.props.socialLogin}
          chatVisitor={this.props.chatVisitor}
          initiateSocialLogout={this.props.initiateSocialLogout}
          form={form}
          formState={this.props.preChatFormState}
          onPrechatFormChange={this.props.handlePreChatFormChange}
          loginEnabled={this.props.loginSettings.enabled}
          greetingMessage={message}
          visitor={this.props.visitor}
          onFormCompleted={this.onPrechatFormComplete} />
      );
    } else if (this.props.screen === screens.OFFLINE_MESSAGE_SCREEN) {
      formScreen = (
        <ChatOfflineMessageForm
          offlineMessage={this.props.offlineMessage}
          onFormBack={() => this.props.updateChatScreen(screens.PRECHAT_SCREEN)} />
      );
    } else if (this.props.screen === screens.LOADING_SCREEN) {
      formScreen = <LoadingSpinner className={styles.loadingSpinner} />;
    }

    return (
      <ScrollContainer
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        classes={scrollContainerClasses}
        containerClasses={styles.scrollContainerContent}
        footerClasses={logoFooterClasses}
        footerContent={this.renderZendeskLogo()}
        fullscreen={this.props.isMobile}>
        {formScreen}
      </ScrollContainer>
    );
  }

  renderChatScreen = () => {
    if (this.props.screen !== screens.CHATTING_SCREEN) return;

    const showChatEndFn = (e) => {
      e.stopPropagation();
      this.props.updateMenuVisibility(false);
      this.setState({
        showEndChatMenu: true
      });
      this.props.updateContactDetailsVisibility(false);
      this.props.updateEmailTranscriptVisibility(false);
    };

    return (
      <ChattingScreen
        toggleMenu={this.toggleMenu}
        showChatEndFn={showChatEndFn}
        hideZendeskLogo={this.props.hideZendeskLogo}
        isMobile={this.props.isMobile} />
    );
  }

  handleDragEnter = () => {
    this.setState({ isDragActive: true });
  }

  handleDragLeave = () => {
    this.setState({ isDragActive: false });
  }

  handleDragDrop = (attachments) => {
    this.setState({ isDragActive: false });
    return this.props.sendAttachments(attachments);
  }

  renderAttachmentsBox = () => {
    const { screen, attachmentsEnabled, getFrameDimensions } = this.props;

    if (
      screen !== screens.CHATTING_SCREEN ||
      !this.state.isDragActive ||
      !attachmentsEnabled
    ) return;

    return (
      <AttachmentBox
        onDragLeave={this.handleDragLeave}
        dimensions={getFrameDimensions()}
        onDrop={this.handleDragDrop}
      />
    );
  }

  renderChatEndPopup = () => {
    const hideChatEndFn = () => this.setState({ showEndChatMenu: false });
    const endChatFn = () => {
      this.setState({ showEndChatMenu: false, endChatFromFeedbackForm: true });
      this.props.endChatViaPostChatScreen();
    };

    return (
      <ChatPopup
        isMobile={this.props.isMobile}
        useOverlay={this.props.isMobile}
        leftCtaFn={hideChatEndFn}
        leftCtaLabel={i18n.t('embeddable_framework.common.button.cancel')}
        rightCtaFn={endChatFn}
        show={this.state.showEndChatMenu}
        rightCtaLabel={i18n.t('embeddable_framework.chat.form.endChat.button.end')}>
        <div className={styles.chatEndPopupDescription}>
          {i18n.t('embeddable_framework.chat.form.endChat.description')}
        </div>
      </ChatPopup>
    );
  }

  renderChatHeader = () => {
    return (
      <ChatHeader
        showRating={false}
        rating={this.props.rating.value}
        updateRating={this.props.sendChatRating}
        concierges={this.props.concierges} />
    );
  }

  renderPostchatScreen = () => {
    if (this.props.screen !== screens.FEEDBACK_SCREEN) return null;

    const { sendChatRating, updateChatScreen, endChat, sendChatComment, rating, isChatting, isMobile } = this.props;
    const { message } = this.props.postChatFormSettings;
    const scrollContainerClasses = classNames(
      styles.scrollContainer,
      { [styles.mobileContainer]: isMobile }
    );
    const logoFooterClasses = classNames({
      [styles.logoFooter]: !this.props.hideZendeskLogo
    });
    const skipClickFn = () => {
      if (this.state.endChatFromFeedbackForm) endChat();

      updateChatScreen(screens.CHATTING_SCREEN);
      this.setState({ endChatFromFeedbackForm: false });
    };
    const sendClickFn = (newRating, text) => {
      if (newRating !== rating.value) sendChatRating(newRating);
      if (text) sendChatComment(text);
      if (this.state.endChatFromFeedbackForm) endChat();

      updateChatScreen(screens.CHATTING_SCREEN);
      this.setState({ endChatFromFeedbackForm: false });
    };

    const cancelButtonTextKey = isChatting
      ? 'embeddable_framework.common.button.cancel'
      : 'embeddable_framework.chat.postChat.rating.button.skip';

    return (
      <ScrollContainer
        headerContent={this.renderChatHeader()}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        classes={scrollContainerClasses}
        containerClasses={styles.scrollContainerContent}
        footerClasses={logoFooterClasses}
        footerContent={this.renderZendeskLogo()}
        fullscreen={isMobile}>
        <ChatFeedbackForm
          feedbackMessage={message}
          rating={this.props.rating}
          skipClickFn={skipClickFn}
          sendClickFn={sendClickFn}
          cancelButtonText={i18n.t(cancelButtonTextKey)} />
      </ScrollContainer>
    );
  }

  renderChatContactDetailsPopup = () => {
    const { editContactDetails, setVisitorInfo, visitor, isMobile, updateContactDetailsVisibility } = this.props;

    if (!editContactDetails.show) return;

    const hideContactDetailsFn = () => updateContactDetailsVisibility(false);
    const tryAgainFn = () => updateContactDetailsVisibility(true);
    const saveContactDetailsFn = (name, email) => setVisitorInfo({ display_name: name, email });

    return (
      <ChatContactDetailsPopup
        contactDetails={editContactDetails}
        screen={editContactDetails.status}
        show={editContactDetails.show}
        isMobile={isMobile}
        leftCtaFn={hideContactDetailsFn}
        rightCtaFn={saveContactDetailsFn}
        tryAgainFn={tryAgainFn}
        visitor={visitor} />
    );
  }

  renderChatEmailTranscriptPopup = () => {
    const {
      emailTranscript,
      sendEmailTranscript,
      updateEmailTranscriptVisibility
    } = this.props;

    if (!emailTranscript.show) return;

    const hideEmailTranscriptFn = () => updateEmailTranscriptVisibility(false);
    const tryEmailTranscriptAgain = () => updateEmailTranscriptVisibility(true);
    const sendEmailTranscriptFn = (email) => sendEmailTranscript(email);

    return (
      <ChatEmailTranscriptPopup
        show={emailTranscript.show}
        isMobile={this.props.isMobile}
        leftCtaFn={hideEmailTranscriptFn}
        rightCtaFn={sendEmailTranscriptFn}
        visitor={this.props.visitor}
        emailTranscript={emailTranscript}
        tryEmailTranscriptAgain={tryEmailTranscriptAgain}
        resetEmailTranscript={this.props.resetEmailTranscript} />
    );
  }

  renderChatReconnectionBubble = () => {
    const { connection } = this.props;

    if (connection !== CONNECTION_STATUSES.CONNECTING) return;

    return <ChatReconnectionBubble />;
  }

  renderAgentListScreen = () => {
    if (this.props.screen !== screens.AGENT_LIST_SCREEN) return null;

    return (
      <AgentScreen
        hideZendeskLogo={this.props.hideZendeskLogo}
        isMobile={this.props.isMobile} />
    );
  }

  renderChatReconnectButton = () => {
    const { connection } = this.props;

    if (connection !== CONNECTION_STATUSES.CLOSED) return;

    return (
      <div className={styles.reconnectContainer}>
        <ButtonPill
          showIcon={false}
          onClick={this.props.handleReconnect}
          label={i18n.t('embeddable_framework.chat.chatLog.reconnect.label')} />
      </div>
    );
  }

  renderZendeskLogo = () => {
    return !this.props.hideZendeskLogo ?
      <ZendeskLogo
        className={`${styles.zendeskLogo}`}
        rtl={i18n.isRTL()}
        fullscreen={false}
      /> : null;
  }

  render = () => {
    const containerStyle = classNames(
      styles.container,
      { [styles.mobileContainer]: this.props.isMobile }
    );

    this.updateFrameSizeTimer = setTimeout(() => this.props.updateFrameSize(), 0);

    return (
      <div className={containerStyle}>
        {this.renderPrechatScreen()}
        {this.renderChatScreen()}
        {this.renderAgentListScreen()}
        {this.renderPostchatScreen()}
        {this.renderChatMenu()}
        {this.renderChatEndPopup()}
        {this.renderChatContactDetailsPopup()}
        {this.renderAttachmentsBox()}
        {this.renderChatEmailTranscriptPopup()}
        {this.renderChatReconnectionBubble()}
        {this.renderChatReconnectButton()}
      </div>
    );
  }
}

const actionCreators = {
  sendMsg,
  endChat,
  endChatViaPostChatScreen,
  setVisitorInfo,
  setDepartment,
  sendChatRating,
  sendChatComment,
  updateChatScreen,
  sendAttachments,
  handleSoundIconClick,
  sendEmailTranscript,
  resetEmailTranscript,
  handlePreChatFormChange,
  updateMenuVisibility,
  handleReconnect,
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility,
  resetCurrentMessage,
  sendOfflineMessage,
  clearDepartment,
  initiateSocialLogout
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Chat);
