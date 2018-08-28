import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';

import { ButtonPill } from 'component/button/ButtonPill';
import ChattingScreen from 'component/chat/chatting/ChattingScreen';
import AgentScreen from 'component/chat/agents/AgentScreen';
import RatingScreen from 'component/chat/rating/RatingScreen';
import PrechatScreen from 'component/chat/prechat/PrechatScreen';
import { ChatMenu } from 'component/chat/ChatMenu';
import { ChatPopup } from 'component/chat/ChatPopup';
import { ChatContactDetailsPopup } from 'component/chat/ChatContactDetailsPopup';
import { ChatEmailTranscriptPopup } from 'component/chat/ChatEmailTranscriptPopup';
import { ChatReconnectionBubble } from 'component/chat/ChatReconnectionBubble';
import { AttachmentBox } from 'component/attachment/AttachmentBox';
import { i18n } from 'service/i18n';
import {
  endChatViaPostChatScreen,
  sendAttachments,
  setVisitorInfo,
  handleSoundIconClick,
  sendEmailTranscript,
  resetEmailTranscript,
  handleReconnect,
  updateMenuVisibility,
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility } from 'src/redux/modules/chat';
import * as screens from 'src/redux/modules/chat/chat-screen-types';
import * as selectors from 'src/redux/modules/chat/chat-selectors';
import { locals as styles } from './ChatOnline.scss';
import { CONNECTION_STATUSES } from 'constants/chat';

const mapStateToProps = (state) => {
  return {
    attachmentsEnabled: selectors.getAttachmentsEnabled(state),
    chats: selectors.getChatMessages(state),
    events: selectors.getChatEvents(state),
    screen: selectors.getChatScreen(state),
    isChatting: selectors.getIsChatting(state),
    rating: selectors.getChatRating(state),
    visitor: selectors.getChatVisitor(state),
    userSoundSettings: selectors.getUserSoundSettings(state),
    emailTranscript: selectors.getEmailTranscript(state),
    editContactDetails: selectors.getEditContactDetails(state),
    menuVisible: selectors.getMenuVisible(state),
    agentJoined: selectors.getAgentJoined(state),
    connection: selectors.getConnection(state),
    loginSettings: selectors.getLoginSettings(state),
    departments: selectors.getDepartments(state),
    offlineMessage: selectors.getOfflineMessage(state),
    authUrls: selectors.getAuthUrls(state),
    socialLogin: selectors.getSocialLogin(state),
    chatVisitor: selectors.getChatVisitor(state),
    isAuthenticated: selectors.getIsAuthenticated(state),
    isLoggingOut: selectors.getIsLoggingOut(state)
  };
};

class Chat extends Component {
  static propTypes = {
    attachmentsEnabled: PropTypes.bool.isRequired,
    chats: PropTypes.array.isRequired,
    events: PropTypes.array.isRequired,
    endChatViaPostChatScreen: PropTypes.func.isRequired,
    screen: PropTypes.string.isRequired,
    sendAttachments: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    setVisitorInfo: PropTypes.func.isRequired,
    onBackButtonClick: PropTypes.func,
    handleReconnect: PropTypes.func.isRequired,
    isChatting: PropTypes.bool.isRequired,
    rating: PropTypes.object.isRequired,
    handleSoundIconClick: PropTypes.func.isRequired,
    userSoundSettings: PropTypes.bool.isRequired,
    sendEmailTranscript: PropTypes.func.isRequired,
    emailTranscript: PropTypes.object.isRequired,
    resetEmailTranscript: PropTypes.func,
    visitor: PropTypes.object.isRequired,
    getFrameContentDocument: PropTypes.func.isRequired,
    editContactDetails: PropTypes.object.isRequired,
    updateContactDetailsVisibility: PropTypes.func.isRequired,
    updateEmailTranscriptVisibility: PropTypes.func.isRequired,
    updateChatBackButtonVisibility: PropTypes.func,
    updateMenuVisibility: PropTypes.func,
    menuVisible: PropTypes.bool,
    agentJoined: PropTypes.bool,
    connection: PropTypes.string.isRequired,
    loginSettings: PropTypes.object.isRequired,
    hideZendeskLogo: PropTypes.bool,
    authUrls: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    chatVisitor: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    isLoggingOut: PropTypes.bool.isRequired
  };

  static defaultProps = {
    attachmentsEnabled: false,
    isMobile: false,
    onBackButtonClick: () => {},
    rating: {},
    chats: [],
    events: [],
    handleSoundIconClick: () => {},
    userSoundSettings: true,
    sendEmailTranscript: () => {},
    emailTranscript: {},
    resetEmailTranscript: () => {},
    editContactDetails: {},
    updateChatBackButtonVisibility: () => {},
    updateMenuVisibility: () => {},
    menuVisible: false,
    connection: '',
    loginSettings: {},
    visitor: {},
    departments: {},
    offlineMessage: {},
    sendOfflineMessage: () => {},
    clearDepartment: () => {},
    hideZendeskLogo: false,
    isAuthenticated: false,
    isLoggingOut: false
  };

  constructor(props) {
    super(props);

    this.state = {
      showEndChatMenu: false,
      endChatFromFeedbackForm: false
    };
  }

  componentDidMount() {
    this.props.updateChatBackButtonVisibility();
  }

  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.chats && !nextProps.events) return;

    this.props.updateChatBackButtonVisibility();
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

    return (
      <PrechatScreen
        getFrameContentDocument={this.props.getFrameContentDocument}
        hideZendeskLogo={this.props.hideZendeskLogo}
        isMobile={this.props.isMobile} />
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
        isMobile={this.props.isMobile}
        showContactDetails={this.showContactDetailsFn} />
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
    const { screen, attachmentsEnabled } = this.props;

    if (
      screen !== screens.CHATTING_SCREEN ||
      !this.state.isDragActive ||
      !attachmentsEnabled
    ) return;

    return (
      <AttachmentBox
        onDragLeave={this.handleDragLeave}
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

  renderPostchatScreen = () => {
    if (this.props.screen !== screens.FEEDBACK_SCREEN) return null;

    const onRatingButtonClick = () => {
      this.setState({ endChatFromFeedbackForm: false });
    };

    return (
      <RatingScreen
        onRatingButtonClick={onRatingButtonClick}
        endChatFromFeedbackForm={this.state.endChatFromFeedbackForm}
      />
    );
  }

  renderChatContactDetailsPopup = () => {
    const { editContactDetails,
      setVisitorInfo,
      visitor,
      isMobile,
      updateContactDetailsVisibility,
      isAuthenticated, socialLogin } = this.props;

    if (!editContactDetails.show) return;

    const hideContactDetailsFn = () => updateContactDetailsVisibility(false);
    const tryAgainFn = () => updateContactDetailsVisibility(true);
    const saveContactDetailsFn = (name, email) => setVisitorInfo({ display_name: name, email });
    const isAuthenticatedAtAll = isAuthenticated || _.get(socialLogin, 'authenticated', false);

    return (
      <ChatContactDetailsPopup
        contactDetails={editContactDetails}
        screen={editContactDetails.status}
        show={editContactDetails.show}
        isMobile={isMobile}
        leftCtaFn={hideContactDetailsFn}
        rightCtaFn={saveContactDetailsFn}
        tryAgainFn={tryAgainFn}
        visitor={visitor}
        isAuthenticated={isAuthenticatedAtAll} />
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
    const { connection, isLoggingOut } = this.props;

    if (connection !== CONNECTION_STATUSES.CONNECTING || isLoggingOut) return;

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
    const { connection, isLoggingOut } = this.props;

    if (connection !== CONNECTION_STATUSES.CLOSED || isLoggingOut) return;

    return (
      <div className={styles.reconnectContainer}>
        <ButtonPill
          onClick={this.props.handleReconnect}
          label={i18n.t('embeddable_framework.chat.chatLog.reconnect.label')} />
      </div>
    );
  }

  render = () => {
    const containerStyle = classNames(
      styles.container,
      { [styles.mobileContainer]: this.props.isMobile }
    );

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
  endChatViaPostChatScreen,
  setVisitorInfo,
  sendAttachments,
  handleSoundIconClick,
  sendEmailTranscript,
  resetEmailTranscript,
  updateMenuVisibility,
  handleReconnect,
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Chat);
