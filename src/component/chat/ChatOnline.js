import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { ButtonPill } from 'component/button/ButtonPill'
import ChattingScreen from 'component/chat/chatting/ChattingScreen'
import AgentScreen from 'component/chat/agents/AgentScreen'
import RatingScreen from 'component/chat/rating/RatingScreen'
import PrechatScreen from 'component/chat/prechat/PrechatScreen'
import { ChatMenu } from 'component/chat/ChatMenu'
import { ChatPopup } from 'component/chat/ChatPopup'
import { ChatContactDetailsPopup } from 'component/chat/ChatContactDetailsPopup'
import { ChatEmailTranscriptPopup } from 'component/chat/ChatEmailTranscriptPopup'
import { ChatReconnectionBubble } from 'component/chat/ChatReconnectionBubble'
import { AttachmentBox } from 'component/attachment/AttachmentBox'
import { i18n } from 'service/i18n'
import { onNextTick } from 'src/util/utils'
import {
  endChatViaPostChatScreen,
  sendAttachments,
  editContactDetailsSubmitted,
  handleSoundIconClick,
  sendEmailTranscript,
  resetEmailTranscript,
  handleReconnect,
  updateMenuVisibility,
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility,
  updateContactDetailsFields,
  initiateSocialLogout
} from 'src/redux/modules/chat'
import * as screens from 'src/redux/modules/chat/chat-screen-types'
import * as selectors from 'src/redux/modules/chat/chat-selectors'
import { getChatEmailTranscriptEnabled } from 'src/redux/modules/selectors'
import { locals as styles } from './ChatOnline.scss'
import { CONNECTION_STATUSES } from 'constants/chat'
import {
  getChannelChoiceAvailable,
  getHelpCenterAvailable,
  getDefaultFormFields
} from 'src/redux/modules/selectors'

const mapStateToProps = state => {
  return {
    attachmentsEnabled: selectors.getAttachmentsEnabled(state),
    emailTranscriptEnabled: getChatEmailTranscriptEnabled(state),
    screen: selectors.getChatScreen(state),
    isChatting: selectors.getIsChatting(state),
    visitor: selectors.getChatVisitor(state),
    userSoundSettings: selectors.getUserSoundSettings(state),
    emailTranscript: selectors.getEmailTranscript(state),
    editContactDetails: selectors.getEditContactDetails(state),
    menuVisible: selectors.getMenuVisible(state),
    connection: selectors.getConnection(state),
    loginSettings: selectors.getLoginSettings(state),
    departments: selectors.getDepartments(state),
    offlineMessage: selectors.getOfflineMessage(state),
    authUrls: selectors.getAuthUrls(state),
    socialLogin: selectors.getSocialLogin(state),
    isAuthenticated: selectors.getIsAuthenticated(state),
    isLoggingOut: selectors.getIsLoggingOut(state),
    channelChoiceAvailable: getChannelChoiceAvailable(state),
    helpCenterAvailable: getHelpCenterAvailable(state),
    contactDetailsRequiredFormData: getDefaultFormFields(state)
  }
}

class Chat extends Component {
  static propTypes = {
    attachmentsEnabled: PropTypes.bool.isRequired,
    emailTranscriptEnabled: PropTypes.bool.isRequired,
    endChatViaPostChatScreen: PropTypes.func.isRequired,
    screen: PropTypes.string.isRequired,
    sendAttachments: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    editContactDetailsSubmitted: PropTypes.func.isRequired,
    onBackButtonClick: PropTypes.func,
    handleReconnect: PropTypes.func.isRequired,
    isChatting: PropTypes.bool.isRequired,
    handleSoundIconClick: PropTypes.func.isRequired,
    userSoundSettings: PropTypes.bool.isRequired,
    sendEmailTranscript: PropTypes.func.isRequired,
    emailTranscript: PropTypes.object.isRequired,
    resetEmailTranscript: PropTypes.func,
    visitor: PropTypes.object.isRequired,
    editContactDetails: PropTypes.object.isRequired,
    updateContactDetailsVisibility: PropTypes.func.isRequired,
    updateEmailTranscriptVisibility: PropTypes.func.isRequired,
    updateContactDetailsFields: PropTypes.func,
    updateChatBackButtonVisibility: PropTypes.func,
    updateMenuVisibility: PropTypes.func,
    menuVisible: PropTypes.bool,
    connection: PropTypes.string.isRequired,
    loginSettings: PropTypes.object.isRequired,
    hideZendeskLogo: PropTypes.bool,
    chatId: PropTypes.string,
    authUrls: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    isLoggingOut: PropTypes.bool.isRequired,
    fullscreen: PropTypes.bool,
    initiateSocialLogout: PropTypes.func.isRequired,
    channelChoiceAvailable: PropTypes.bool.isRequired,
    helpCenterAvailable: PropTypes.bool.isRequired,
    contactDetailsRequiredFormData: PropTypes.object
  }

  static defaultProps = {
    attachmentsEnabled: false,
    isMobile: false,
    fullscreen: false,
    onBackButtonClick: () => {},
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
    chatId: '',
    isAuthenticated: false,
    isLoggingOut: false
  }

  constructor(props) {
    super(props)

    this.state = {
      showEndChatMenu: false,
      endChatFromFeedbackForm: false
    }

    this.menu = null
  }

  componentDidMount() {
    this.props.updateChatBackButtonVisibility()
  }

  toggleMenu = keypress => {
    this.props.updateMenuVisibility(!this.props.menuVisible)

    if (!this.props.menuVisible && keypress) {
      onNextTick(this.menu.focus)
    }
  }

  onContainerClick = () => {
    this.setState({
      showEndChatMenu: false
    })

    this.props.updateMenuVisibility(false)
    this.props.updateContactDetailsVisibility(false)
    this.props.updateEmailTranscriptVisibility(false)
  }

  showContactDetailsFn = e => {
    e.stopPropagation()
    this.props.updateContactDetailsVisibility(true)
  }

  showEmailTranscriptFn = e => {
    e.stopPropagation()
    this.props.updateEmailTranscriptVisibility(true)
  }

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
      emailTranscriptEnabled,
      helpCenterAvailable,
      channelChoiceAvailable
    } = this.props
    const showChatEndFn = e => {
      e.stopPropagation()
      updateMenuVisibility(false)
      this.setState({
        showEndChatMenu: true
      })
    }
    const toggleSoundFn = () => {
      handleSoundIconClick({ sound: !userSoundSettings })
    }

    return (
      <ChatMenu
        ref={el => (this.menu = el)}
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
        emailTranscriptEnabled={emailTranscriptEnabled}
        isMobile={isMobile}
        loginEnabled={loginSettings.enabled}
        helpCenterAvailable={helpCenterAvailable}
        channelChoiceAvailable={channelChoiceAvailable}
      />
    )
  }

  renderPrechatScreen = () => {
    if (
      this.props.screen !== screens.PRECHAT_SCREEN &&
      this.props.screen !== screens.OFFLINE_MESSAGE_SCREEN &&
      this.props.screen !== screens.LOADING_SCREEN
    )
      return

    return (
      <PrechatScreen
        hideZendeskLogo={this.props.hideZendeskLogo}
        chatId={this.props.chatId}
        isMobile={this.props.isMobile}
        fullscreen={this.props.fullscreen}
      />
    )
  }

  renderChatScreen = () => {
    if (this.props.screen !== screens.CHATTING_SCREEN) return

    const showChatEndFn = e => {
      e.stopPropagation()
      this.props.updateMenuVisibility(false)
      this.setState({
        showEndChatMenu: true
      })
      this.props.updateContactDetailsVisibility(false)
      this.props.updateEmailTranscriptVisibility(false)
    }

    return (
      <ChattingScreen
        toggleMenu={this.toggleMenu}
        showChatEndFn={showChatEndFn}
        chatId={this.props.chatId}
        hideZendeskLogo={this.props.hideZendeskLogo}
        isMobile={this.props.isMobile}
        fullscreen={this.props.fullscreen}
        showContactDetails={this.showContactDetailsFn}
      />
    )
  }

  handleDragEnter = () => {
    this.setState({ isDragActive: true })
  }

  handleDragLeave = () => {
    this.setState({ isDragActive: false })
  }

  handleDragDrop = attachments => {
    this.setState({ isDragActive: false })
    return this.props.sendAttachments(attachments)
  }

  renderAttachmentsBox = () => {
    const { screen, attachmentsEnabled } = this.props

    if (screen !== screens.CHATTING_SCREEN || !this.state.isDragActive || !attachmentsEnabled)
      return

    return <AttachmentBox onDragLeave={this.handleDragLeave} onDrop={this.handleDragDrop} />
  }

  renderChatEndPopup = () => {
    const hideChatEndFn = () => this.setState({ showEndChatMenu: false })
    const endChatFn = () => {
      this.setState({
        showEndChatMenu: false,
        endChatFromFeedbackForm: true
      })
      this.props.endChatViaPostChatScreen()
    }

    return (
      <ChatPopup
        isMobile={this.props.isMobile}
        useOverlay={this.props.isMobile}
        leftCtaFn={hideChatEndFn}
        leftCtaLabel={i18n.t('embeddable_framework.common.button.cancel')}
        rightCtaFn={endChatFn}
        show={this.state.showEndChatMenu}
        rightCtaLabel={i18n.t('embeddable_framework.chat.form.endChat.button.end')}
      >
        <div className={styles.chatEndPopupDescription}>
          {i18n.t('embeddable_framework.chat.form.endChat.description')}
        </div>
      </ChatPopup>
    )
  }

  renderPostchatScreen = () => {
    if (this.props.screen !== screens.FEEDBACK_SCREEN) return null

    const onRatingButtonClick = () => {
      this.setState({ endChatFromFeedbackForm: false })
    }

    return (
      <RatingScreen
        isMobile={this.props.isMobile}
        fullscreen={this.props.fullscreen}
        onRatingButtonClick={onRatingButtonClick}
        endChatFromFeedbackForm={this.state.endChatFromFeedbackForm}
      />
    )
  }

  renderChatContactDetailsPopup = () => {
    const {
      editContactDetails,
      editContactDetailsSubmitted,
      visitor,
      isMobile,
      updateContactDetailsVisibility,
      updateContactDetailsFields,
      authUrls,
      isAuthenticated,
      socialLogin,
      initiateSocialLogout,
      contactDetailsRequiredFormData
    } = this.props

    const hideContactDetailsFn = () => updateContactDetailsVisibility(false)
    const tryAgainFn = () => updateContactDetailsVisibility(true)
    const saveContactDetailsFn = (name, email) =>
      editContactDetailsSubmitted({ display_name: name, email })
    const isAuthenticatedAtAll = isAuthenticated || _.get(socialLogin, 'authenticated', false)
    const updateDetailsFn = (name, email) =>
      updateContactDetailsFields({ display_name: name, email })

    return (
      <ChatContactDetailsPopup
        contactDetails={editContactDetails}
        screen={editContactDetails.status}
        show={editContactDetails.show}
        requiredFormData={contactDetailsRequiredFormData}
        isMobile={isMobile}
        leftCtaFn={hideContactDetailsFn}
        rightCtaFn={saveContactDetailsFn}
        tryAgainFn={tryAgainFn}
        updateFn={updateDetailsFn}
        visitor={visitor}
        authUrls={authUrls}
        socialLogin={socialLogin}
        initiateSocialLogout={initiateSocialLogout}
        isAuthenticated={isAuthenticatedAtAll}
      />
    )
  }

  renderChatEmailTranscriptPopup = () => {
    const { emailTranscript, sendEmailTranscript, updateEmailTranscriptVisibility } = this.props

    const hideEmailTranscriptFn = () => updateEmailTranscriptVisibility(false)
    const tryEmailTranscriptAgain = () => updateEmailTranscriptVisibility(true)
    const sendEmailTranscriptFn = email => sendEmailTranscript(email)

    if (!emailTranscript.show) {
      return
    }

    return (
      <ChatEmailTranscriptPopup
        isMobile={this.props.isMobile}
        leftCtaFn={hideEmailTranscriptFn}
        rightCtaFn={sendEmailTranscriptFn}
        visitor={this.props.visitor}
        emailTranscript={emailTranscript}
        tryEmailTranscriptAgain={tryEmailTranscriptAgain}
        resetEmailTranscript={this.props.resetEmailTranscript}
      />
    )
  }

  renderChatReconnectionBubble = () => {
    const { connection, isLoggingOut } = this.props

    if (connection !== CONNECTION_STATUSES.CONNECTING || isLoggingOut) return

    return <ChatReconnectionBubble />
  }

  renderAgentListScreen = () => {
    if (this.props.screen !== screens.AGENT_LIST_SCREEN) return null

    return (
      <AgentScreen
        chatId={this.props.chatId}
        hideZendeskLogo={this.props.hideZendeskLogo}
        isMobile={this.props.isMobile}
        fullscreen={this.props.fullscreen}
      />
    )
  }

  renderChatReconnectButton = () => {
    const { connection, isLoggingOut } = this.props

    if (connection !== CONNECTION_STATUSES.CLOSED || isLoggingOut) return

    return (
      <div className={styles.reconnectContainer}>
        <ButtonPill
          onClick={this.props.handleReconnect}
          label={i18n.t('embeddable_framework.chat.chatLog.reconnect.label')}
        />
      </div>
    )
  }

  render = () => {
    return (
      <div>
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
    )
  }
}

const actionCreators = {
  endChatViaPostChatScreen,
  editContactDetailsSubmitted,
  sendAttachments,
  handleSoundIconClick,
  sendEmailTranscript,
  resetEmailTranscript,
  updateMenuVisibility,
  handleReconnect,
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility,
  updateContactDetailsFields,
  initiateSocialLogout
}

export default connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(Chat)
