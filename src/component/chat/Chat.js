import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ChatBox } from 'component/chat/ChatBox';
import { ChatFooter } from 'component/chat/ChatFooter';
import { ChatLog } from 'component/chat/ChatLog';
import { ChatHeader } from 'component/chat/ChatHeader';
import { ChatMenu } from 'component/chat/ChatMenu';
import { ChatPrechatForm } from 'component/chat/ChatPrechatForm';
import { ChatFeedbackForm } from 'component/chat/ChatFeedbackForm';
import { ChatPopup } from 'component/chat/ChatPopup';
import { ChatRatings } from 'component/chat/ChatRatingGroup';
import { ChatContactDetailsPopup } from 'component/chat/ChatContactDetailsPopup';
import { ChatEmailTranscriptPopup } from 'component/chat/ChatEmailTranscriptPopup';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { LoadingEllipses } from 'component/loading/LoadingEllipses';
import { AttachmentBox } from 'component/attachment/AttachmentBox';
import { i18n } from 'service/i18n';
import { endChat,
         sendMsg,
         sendAttachments,
         setVisitorInfo,
         getAccountSettings,
         handleChatBoxChange,
         sendChatRating,
         sendChatComment,
         updateChatScreen,
         handleSoundIconClick,
         sendEmailTranscript,
         resetEmailTranscript } from 'src/redux/modules/chat';
import { PRECHAT_SCREEN, CHATTING_SCREEN, FEEDBACK_SCREEN } from 'src/redux/modules/chat/chat-screen-types';
import { getPrechatFormFields,
         getAttachmentsEnabled,
         getPrechatFormSettings,
         getIsChatting,
         getAgents,
         getChatMessages,
         getChatEvents,
         getGroupedChatLog,
         getChatScreen,
         getChatVisitor,
         getCurrentMessage,
         getChatRating,
         getUserSoundSettings,
         getConciergeSettings,
         getPostchatFormSettings,
         getRatingSettings,
         getEmailTranscript } from 'src/redux/modules/chat/chat-selectors';
import { EMAIL_TRANSCRIPT_IDLE,
         EMAIL_TRANSCRIPT_SUCCESS,
         EMAIL_TRANSCRIPT_FAILURE } from 'src/redux/modules/chat/chat-action-types';

import { locals as styles } from './Chat.scss';

const mapStateToProps = (state) => {
  const prechatForm = getPrechatFormSettings(state);
  const prechatFormFields = getPrechatFormFields(state);

  return {
    attachmentsEnabled: getAttachmentsEnabled(state),
    chats: getChatMessages(state),
    events: getChatEvents(state),
    chatLog: getGroupedChatLog(state),
    currentMessage: getCurrentMessage(state),
    screen: getChatScreen(state),
    concierge: getConciergeSettings(state),
    prechatFormSettings: { ...prechatForm, form: prechatFormFields },
    postChatFormSettings: getPostchatFormSettings(state),
    isChatting: getIsChatting(state),
    agents: getAgents(state),
    rating: getChatRating(state),
    visitor: getChatVisitor(state),
    userSoundSettings: getUserSoundSettings(state),
    ratingSettings: getRatingSettings(state),
    emailTranscript: getEmailTranscript(state)
  };
};

class Chat extends Component {
  static propTypes = {
    attachmentsEnabled: PropTypes.bool.isRequired,
    concierge: PropTypes.object.isRequired,
    chats: PropTypes.array.isRequired,
    events: PropTypes.array.isRequired,
    chatLog: PropTypes.object.isRequired,
    currentMessage: PropTypes.string.isRequired,
    endChat: PropTypes.func.isRequired,
    screen: PropTypes.string.isRequired,
    sendAttachments: PropTypes.func.isRequired,
    prechatFormSettings: PropTypes.object.isRequired,
    postChatFormSettings: PropTypes.object.isRequired,
    isMobile: PropTypes.bool,
    newDesign: PropTypes.bool,
    position: PropTypes.string,
    sendMsg: PropTypes.func.isRequired,
    setVisitorInfo: PropTypes.func.isRequired,
    handleChatBoxChange: PropTypes.func.isRequired,
    updateFrameSize: PropTypes.func,
    getAccountSettings: PropTypes.func.isRequired,
    sendChatRating: PropTypes.func.isRequired,
    sendChatComment: PropTypes.func.isRequired,
    updateChatScreen: PropTypes.func.isRequired,
    isChatting: PropTypes.bool.isRequired,
    agents: PropTypes.object.isRequired,
    visitor: PropTypes.object.isRequired,
    rating: PropTypes.string,
    handleSoundIconClick: PropTypes.func.isRequired,
    userSoundSettings: PropTypes.bool.isRequired,
    ratingSettings: PropTypes.object.isRequired,
    getFrameDimensions: PropTypes.func.isRequired,
    sendEmailTranscript: PropTypes.func.isRequired,
    emailTranscript: PropTypes.object.isRequired,
    resetEmailTranscript: PropTypes.func
  };

  static defaultProps = {
    attachmentsEnabled: false,
    isMobile: false,
    newDesign: false,
    position: 'right',
    updateFrameSize: () => {},
    getAccountSettings: () => {},
    concierge: {},
    rating: null,
    chats: [],
    events: [],
    chatLog: {},
    postChatFormSettings: {},
    handleSoundIconClick: () => {},
    userSoundSettings: true,
    ratingSettings: { enabled: false },
    agents: {},
    getFrameDimensions: () => {},
    sendEmailTranscript: () => {},
    emailTranscript: {},
    resetEmailTranscript: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      showEndChatMenu: false,
      showEditContactDetailsMenu: false,
      showEmailTranscriptMenu: false
    };

    this.scrollContainer = null;
  }

  componentWillReceiveProps = (nextProps) => {
    const { chats, events } = this.props;

    if (!nextProps.chats && !nextProps.events) return;

    const chatLogLength = chats.length + events.length;
    const nextChatLogLength = nextProps.chats.length + nextProps.events.length;

    if (chatLogLength !== nextChatLogLength) {
      setTimeout(() => {
        if (this.scrollContainer) {
          this.scrollContainer.scrollToBottom();
        }
      }, 0);
    }
    if (nextProps.emailTranscript.status !== EMAIL_TRANSCRIPT_IDLE &&
        nextProps.emailTranscript.status !== this.props.emailTranscript.status) {
      this.setState({ showEmailTranscriptMenu: true });
    }
  }

  toggleMenu = () => {
    this.setState({ showMenu: !this.state.showMenu });
  }

  onContainerClick = () => {
    this.setState({
      showMenu: false,
      showEndChatMenu: false,
      showEditContactDetailsMenu: false,
      showEmailTranscriptMenu: false
    });
    if (this.props.emailTranscript.status === EMAIL_TRANSCRIPT_FAILURE ||
        this.props.emailTranscript.status === EMAIL_TRANSCRIPT_SUCCESS) {
      this.props.resetEmailTranscript();
    }
  }

  onPrechatFormComplete = (info) => {
    this.props.setVisitorInfo(_.pick(info, ['display_name', 'email', 'phone']));
    this.props.sendMsg(info.message);

    this.props.updateChatScreen(CHATTING_SCREEN);
  }

  renderChatMenu = () => {
    const {
      userSoundSettings,
      isChatting,
      handleSoundIconClick
    } = this.props;
    const showChatEndFn = (e) => {
      e.stopPropagation();
      this.setState({ showEndChatMenu: true });
      this.setState({ showMenu: false });
    };
    const showContactDetailsFn = (e) => {
      e.stopPropagation();
      this.setState({ showEditContactDetailsMenu: true });
      this.setState({ showMenu: false });
    };
    const showEmailTranscriptFn = (e) => {
      e.stopPropagation();
      this.setState({ showEmailTranscriptMenu: true });
      this.setState({ showMenu: false });
    };
    const toggleSoundFn = () => {
      handleSoundIconClick({ sound: !userSoundSettings });
    };

    return (
      <ChatMenu
        show={this.state.showMenu}
        playSound={userSoundSettings}
        disableEndChat={!isChatting}
        endChatOnClick={showChatEndFn}
        contactDetailsOnClick={showContactDetailsFn}
        emailTranscriptOnClick={showEmailTranscriptFn}
        onSoundClick={toggleSoundFn}
        isChatting={this.props.isChatting} />
    );
  }

  renderChatFooter = () => {
    const { currentMessage, sendMsg, handleChatBoxChange } = this.props;

    const showChatEndFn = (e) => {
      e.stopPropagation();
      this.setState({ showEndChatMenu: true });
      this.setState({ showMenu: false });
      this.setState({ showEmailTranscriptMenu: false });
      this.setState({ showEditContactDetailsMenu: false });
    };

    return (
      <ChatFooter
        attachmentsEnabled={this.props.attachmentsEnabled}
        endChat={showChatEndFn}
        isChatting={this.props.isChatting}
        handleAttachmentDrop={this.props.sendAttachments}
        toggleMenu={this.toggleMenu}>
        <ChatBox
          currentMessage={currentMessage}
          sendMsg={sendMsg}
          handleChatBoxChange={handleChatBoxChange} />
      </ChatFooter>
    );
  }

  renderChatHeader = (showRating = false) => {
    const { rating, sendChatRating, concierge } = this.props;
    // Title in chat refers to the byline and display_name refers to the display title
    const { avatar_path, display_name, title } = concierge;
    const displayName = _.has(display_name, 'toString') ? display_name.toString() : display_name; // eslint-disable-line camelcase
    const byline = _.has(title, 'toString') ? title.toString() : title;

    return (
      <ChatHeader
        showRating={showRating}
        rating={rating}
        updateRating={sendChatRating}
        avatar={avatar_path} // eslint-disable-line camelcase
        title={displayName}
        byline={byline} />
    );
  }

  renderPrechatScreen = () => {
    if (this.props.screen !== PRECHAT_SCREEN) return;

    const { form, message } = this.props.prechatFormSettings;

    return (
      <ScrollContainer
        newDesign={this.props.newDesign}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}>
        <ChatPrechatForm
          form={form}
          greetingMessage={message}
          visitor={this.props.visitor}
          onFormCompleted={this.onPrechatFormComplete} />
      </ScrollContainer>
    );
  }

  renderAgentTyping = () => {
    const agentList = _.filter(this.props.agents, (agent) => agent.typing === true);
    let typingNotification;

    switch (agentList.length) {
      case 0: return null;
      case 1:
        const agent = agentList[0].display_name;

        typingNotification = i18n.t('embeddable_framework.chat.chatLog.isTyping', { agent });
        break;
      case 2:
        const agent1 = agentList[0].display_name,
          agent2 = agentList[1].display_name;

        typingNotification = i18n.t('embeddable_framework.chat.chatLog.isTyping_two', { agent1, agent2 });
        break;
      default:
        typingNotification = i18n.t('embeddable_framework.chat.chatLog.isTyping_multiple');
    }

    return (
      <div className={styles.agentTyping}>
        <LoadingEllipses
          useUserColor={false}
          className={styles.loadingEllipses}
          itemClassName={styles.loadingEllipsesItem} />
        {typingNotification}
      </div>
    );
  }

  renderChatScreen = () => {
    const { screen, ratingSettings, agents, isMobile, newDesign } = this.props;

    if (screen !== CHATTING_SCREEN) return;
    const showRating = ratingSettings.enabled && _.size(agents) > 0;
    const containerClasses = isMobile ? styles.scrollContainerMobile : '';

    return (
      <ScrollContainer
        ref={(el) => { this.scrollContainer = el; }}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        headerContent={this.renderChatHeader(showRating)}
        headerClasses={styles.header}
        containerClasses={containerClasses}
        newDesign={newDesign}
        footerClasses={styles.footer}
        footerContent={this.renderChatFooter()}>
        <div className={styles.messages}>
          <ChatLog chatLog={this.props.chatLog} agents={this.props.agents} />
          {this.renderAgentTyping()}
        </div>
      </ScrollContainer>
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
      screen !== CHATTING_SCREEN ||
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

  renderChatLog = () => {
    const { chats, agents } = this.props;

    return (
      <ChatLog agents={agents} chats={chats} />
    );
  }

  renderChatEndPopup = () => {
    const hideChatEndFn = () => this.setState({ showEndChatMenu: false });
    const endChatFn = () => {
      this.setState({ showEndChatMenu: false });
      this.props.endChat();
    };

    return (
      <ChatPopup
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
    if (this.props.screen !== FEEDBACK_SCREEN) return null;

    const { sendChatRating, updateChatScreen, endChat, sendChatComment } = this.props;
    const { message } = this.props.postChatFormSettings;
    const skipClickFn = () => {
      sendChatRating(ChatRatings.NOT_SET);
      updateChatScreen(CHATTING_SCREEN);
      endChat();
    };
    const sendClickFn = (text = '') => {
      sendChatComment(text);
      updateChatScreen(CHATTING_SCREEN);
    };

    return (
      <ScrollContainer
        headerContent={this.renderChatHeader()}
        newDesign={this.props.newDesign}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}>
        <ChatFeedbackForm
          feedbackMessage={message}
          rating={this.props.rating}
          updateRating={sendChatRating}
          skipClickFn={skipClickFn}
          sendClickFn={sendClickFn} />
      </ScrollContainer>
    );
  }

  renderChatContactDetailsPopup = () => {
    const hideContactDetailsFn = () => this.setState({ showEditContactDetailsMenu: false });
    const saveContactDetailsFn = (name, email) => {
      this.setState({ showEditContactDetailsMenu: false });
      this.props.setVisitorInfo({ display_name: name, email });
    };

    return (
      <ChatContactDetailsPopup
        show={this.state.showEditContactDetailsMenu}
        leftCtaFn={hideContactDetailsFn}
        rightCtaFn={saveContactDetailsFn}
        visitor={this.props.visitor} />
    );
  }

  renderChatEmailTranscriptPopup = () => {
    if (!this.state.showEmailTranscriptMenu) return null;

    const hideEmailTranscriptFn = () => this.setState({ showEmailTranscriptMenu: false });
    const sendEmailTranscriptFn = (email) => {
      this.props.sendEmailTranscript(email);
    };
    const tryEmailTranscriptAgain = () => {
      this.props.resetEmailTranscript();
      this.setState( { showEmailTranscriptMenu: true });
    };

    return (
      <ChatEmailTranscriptPopup
        className={styles.bottomPopup}
        leftCtaFn={hideEmailTranscriptFn}
        rightCtaFn={sendEmailTranscriptFn}
        visitor={this.props.visitor}
        emailTranscript={this.props.emailTranscript}
        tryEmailTranscriptAgain={tryEmailTranscriptAgain} />
    );
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    return (
      <div className={styles.container}>
        {this.renderPrechatScreen()}
        {this.renderChatScreen()}
        {this.renderPostchatScreen()}
        {this.renderChatMenu()}
        {this.renderChatEndPopup()}
        {this.renderChatContactDetailsPopup()}
        {this.renderAttachmentsBox()}
        {this.renderChatEmailTranscriptPopup()}
      </div>
    );
  }
}

const actionCreators = {
  sendMsg,
  handleChatBoxChange,
  getAccountSettings,
  endChat,
  setVisitorInfo,
  sendChatRating,
  sendChatComment,
  updateChatScreen,
  sendAttachments,
  handleSoundIconClick,
  sendEmailTranscript,
  resetEmailTranscript
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Chat);
