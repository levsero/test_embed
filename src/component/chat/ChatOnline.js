import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import ButtonPill from 'src/embeds/chat/components/ButtonPill'
import ChattingScreen from 'component/chat/chatting/ChattingScreen'
import AgentDetailsPage from 'src/embeds/chat/pages/AgentDetailsPage'
import ChatRatingPage from 'src/embeds/chat/pages/ChatRatingPage'
import PostChatPage from 'src/embeds/chat/pages/PostChatPage'
import PrechatScreen from 'component/chat/prechat/PrechatScreen'
import { ChatContactDetailsPopup } from 'component/chat/ChatContactDetailsPopup'
import { ChatEmailTranscriptPopup } from 'component/chat/ChatEmailTranscriptPopup'
import { ChatReconnectionBubble } from 'component/chat/ChatReconnectionBubble'
import { AttachmentBox } from 'component/attachment/AttachmentBox'
import { i18n } from 'service/i18n'
import {
  endChatViaPostChatScreen,
  sendAttachments,
  editContactDetailsSubmitted,
  sendEmailTranscript,
  resetEmailTranscript,
  handleReconnect,
  updateMenuVisibility,
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility,
  updateContactDetailsFields,
  initiateSocialLogout,
  updateEndChatModalVisibility
} from 'src/redux/modules/chat'
import * as screens from 'src/redux/modules/chat/chat-screen-types'
import * as selectors from 'src/redux/modules/chat/chat-selectors'
import { locals as styles } from './ChatOnline.scss'
import { CONNECTION_STATUSES } from 'constants/chat'
import { getDefaultFormFields } from 'src/redux/modules/selectors'
import ChatModal, { ModalActions } from 'embeds/chat/components/ChatModal'
import { Button } from '@zendeskgarden/react-buttons'
import { KEY_CODES } from '@zendeskgarden/react-selection'
import { TEST_IDS } from 'constants/shared'
import { getIsEndChatModalVisible } from 'src/redux/modules/chat/chat-selectors'
import { getMenuVisible } from 'embeds/chat/selectors'

const mapStateToProps = state => {
  return {
    attachmentsEnabled: selectors.getAttachmentsEnabled(state),
    screen: selectors.getChatScreen(state),
    visitor: selectors.getChatVisitor(state),
    emailTranscript: selectors.getEmailTranscript(state),
    editContactDetails: selectors.getEditContactDetails(state),
    menuVisible: getMenuVisible(state),
    connection: selectors.getConnection(state),
    departments: selectors.getDepartments(state),
    offlineMessage: selectors.getOfflineMessage(state),
    authUrls: selectors.getAuthUrls(state),
    socialLogin: selectors.getSocialLogin(state),
    isAuthenticated: selectors.getIsAuthenticated(state),
    isLoggingOut: selectors.getIsLoggingOut(state),
    contactDetailsRequiredFormData: getDefaultFormFields(state),
    endChatModalVisible: getIsEndChatModalVisible(state)
  }
}

class Chat extends Component {
  static propTypes = {
    attachmentsEnabled: PropTypes.bool.isRequired,
    endChatViaPostChatScreen: PropTypes.func.isRequired,
    screen: PropTypes.string.isRequired,
    sendAttachments: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    editContactDetailsSubmitted: PropTypes.func.isRequired,
    handleReconnect: PropTypes.func.isRequired,
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
    hideZendeskLogo: PropTypes.bool,
    chatId: PropTypes.string,
    authUrls: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    isLoggingOut: PropTypes.bool.isRequired,
    fullscreen: PropTypes.bool,
    initiateSocialLogout: PropTypes.func.isRequired,
    contactDetailsRequiredFormData: PropTypes.object,
    endChatModalVisible: PropTypes.bool,
    updateEndChatModalVisibility: PropTypes.func,
    isPreview: PropTypes.bool
  }

  static defaultProps = {
    attachmentsEnabled: false,
    isMobile: false,
    fullscreen: false,
    sendEmailTranscript: () => {},
    emailTranscript: {},
    resetEmailTranscript: () => {},
    editContactDetails: {},
    updateChatBackButtonVisibility: () => {},
    updateMenuVisibility: () => {},
    menuVisible: false,
    connection: '',
    visitor: {},
    departments: {},
    offlineMessage: {},
    sendOfflineMessage: () => {},
    clearDepartment: () => {},
    hideZendeskLogo: false,
    chatId: '',
    isAuthenticated: false,
    isLoggingOut: false,
    isPreview: false
  }

  constructor(props) {
    super(props)

    this.state = {
      endChatFromFeedbackForm: false
    }

    this.menu = null
  }

  componentDidMount() {
    this.props.updateChatBackButtonVisibility()
  }

  toggleMenu = () => {
    this.props.updateMenuVisibility(!this.props.menuVisible)
  }

  onKeyDown = e => {
    if (e.keyCode === KEY_CODES.ESCAPE && this.props.menuVisible) {
      e.stopPropagation()
      this.props.updateMenuVisibility(false)
    }
  }

  showContactDetailsFn = e => {
    e.stopPropagation()
    this.props.updateContactDetailsVisibility(true)
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
      this.props.updateEndChatModalVisibility(true)
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
        isPreview={this.props.isPreview}
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
    const { screen, attachmentsEnabled, isPreview } = this.props

    if (
      screen !== screens.CHATTING_SCREEN ||
      !this.state.isDragActive ||
      !attachmentsEnabled ||
      isPreview
    )
      return

    return <AttachmentBox onDragLeave={this.handleDragLeave} onDrop={this.handleDragDrop} />
  }

  renderChatEndPopup = () => {
    const hideChatEndFn = () => {
      this.props.updateEndChatModalVisibility(false)
    }
    const endChatFn = () => {
      this.props.updateEndChatModalVisibility(false)
      this.props.endChatViaPostChatScreen()
    }

    if (!this.props.endChatModalVisible) {
      return null
    }

    return (
      <ChatModal onClose={hideChatEndFn} focusOnMount={true}>
        <div className={styles.chatEndPopupDescription}>
          {i18n.t('embeddable_framework.chat.form.endChat.description')}
        </div>
        <ModalActions>
          <Button
            onClick={hideChatEndFn}
            data-testid={TEST_IDS.BUTTON_CANCEL}
            aria-label={i18n.t('embeddable_framework.common.button.cancel')}
          >
            {i18n.t('embeddable_framework.common.button.cancel')}
          </Button>
          <Button
            onClick={endChatFn}
            primary={true}
            aria-label={i18n.t('embeddable_framework.common.button.end')}
            data-testid={TEST_IDS.BUTTON_OK}
          >
            {i18n.t('embeddable_framework.common.button.end')}
          </Button>
        </ModalActions>
      </ChatModal>
    )
  }

  renderChatRatingPage = () => {
    if (this.props.screen !== screens.FEEDBACK_SCREEN) return null

    return <ChatRatingPage />
  }

  renderPostChatPage = () => {
    if (this.props.screen !== screens.POST_CHAT_SCREEN) return null

    return <PostChatPage />
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

    if (!editContactDetails.show) {
      return null
    }

    return (
      <ChatContactDetailsPopup
        contactDetails={editContactDetails}
        screen={editContactDetails.status}
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

    return <AgentDetailsPage />
  }

  renderChatReconnectButton = () => {
    const { connection, isLoggingOut } = this.props

    if (connection !== CONNECTION_STATUSES.CLOSED || isLoggingOut) return

    return (
      <div className={styles.reconnectContainer}>
        <ButtonPill onClick={this.props.handleReconnect}>
          {i18n.t('embeddable_framework.chat.chatLog.reconnect.label')}
        </ButtonPill>
      </div>
    )
  }

  render = () => {
    return (
      <div
        onKeyDown={this.onKeyDown}
        role="presentation"
        className={styles.chat}
        onDragEnter={this.handleDragEnter}
      >
        {this.renderPrechatScreen()}
        {this.renderChatScreen()}
        {this.renderAgentListScreen()}
        {this.renderChatRatingPage()}
        {this.renderPostChatPage()}
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
  sendEmailTranscript,
  resetEmailTranscript,
  updateMenuVisibility,
  handleReconnect,
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility,
  updateEndChatModalVisibility,
  updateContactDetailsFields,
  initiateSocialLogout
}

const connected = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(Chat)

export { connected as default, Chat as Component }
