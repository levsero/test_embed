import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ChattingScreen from 'src/embeds/chat/pages/ChattingPage'
import AgentDetailsPage from 'src/embeds/chat/pages/AgentDetailsPage'
import ChatRatingPage from 'src/embeds/chat/pages/ChatRatingPage'
import PostChatPage from 'src/embeds/chat/pages/PostChatPage'
import PrechatScreen from 'component/chat/prechat/PrechatScreen'
import {
  sendAttachments,
  resetEmailTranscript,
  handleReconnect,
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility,
  updateEndChatModalVisibility,
} from 'src/redux/modules/chat'
import * as screens from 'src/redux/modules/chat/chat-screen-types'
import * as selectors from 'src/redux/modules/chat/chat-selectors'
import { CONNECTION_STATUSES } from 'constants/chat'
import { KEY_CODES } from '@zendeskgarden/react-selection'
import { getMenuVisible } from 'embeds/chat/selectors'
import { updateMenuVisibility } from 'embeds/chat/actions/actions'
import { sendEmailTranscript } from 'src/embeds/chat/actions/email-transcript'
import { FileDropProvider, FileDropTarget } from 'components/FileDropProvider'
import { locals as styles } from './ChatOnline.scss'
import ReconnectionBubble from 'embeds/chat/components/ReconnectionBubble'
import ReconnectButton from 'embeds/chat/components/ReconnectButton'

const mapStateToProps = (state) => {
  return {
    attachmentsEnabled: selectors.getAttachmentsEnabled(state),
    screen: selectors.getChatScreen(state),
    emailTranscript: selectors.getEmailTranscript(state),
    menuVisible: getMenuVisible(state),
    connection: selectors.getConnection(state),
    departments: selectors.getDepartments(state),
    isLoggingOut: selectors.getIsLoggingOut(state),
  }
}

class Chat extends Component {
  static propTypes = {
    attachmentsEnabled: PropTypes.bool.isRequired,
    screen: PropTypes.string.isRequired,
    sendAttachments: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    handleReconnect: PropTypes.func.isRequired,
    updateContactDetailsVisibility: PropTypes.func.isRequired,
    updateEmailTranscriptVisibility: PropTypes.func.isRequired,
    updateChatBackButtonVisibility: PropTypes.func,
    updateMenuVisibility: PropTypes.func,
    menuVisible: PropTypes.bool,
    connection: PropTypes.string.isRequired,
    hideZendeskLogo: PropTypes.bool,
    isLoggingOut: PropTypes.bool.isRequired,
    updateEndChatModalVisibility: PropTypes.func,
    isPreview: PropTypes.bool,
  }

  static defaultProps = {
    attachmentsEnabled: false,
    isMobile: false,
    sendEmailTranscript: () => {},
    emailTranscript: {},
    resetEmailTranscript: () => {},
    updateChatBackButtonVisibility: () => {},
    updateMenuVisibility: () => {},
    menuVisible: false,
    connection: '',
    departments: {},
    clearDepartment: () => {},
    hideZendeskLogo: false,
    isLoggingOut: false,
    isPreview: false,
  }

  constructor(props) {
    super(props)

    this.state = {
      endChatFromFeedbackForm: false,
    }

    this.menu = null
  }

  componentDidMount() {
    this.props.updateChatBackButtonVisibility()
  }

  toggleMenu = () => {
    this.props.updateMenuVisibility(!this.props.menuVisible)
  }

  onKeyDown = (e) => {
    if (e.keyCode === KEY_CODES.ESCAPE && this.props.menuVisible) {
      e.stopPropagation()
      this.props.updateMenuVisibility(false)
    }
  }

  showContactDetailsFn = (e) => {
    e.stopPropagation()
    this.props.updateContactDetailsVisibility(true)
  }

  renderPrechatScreen = () => {
    if (
      this.props.screen !== screens.PRECHAT_SCREEN &&
      this.props.screen !== screens.OFFLINE_MESSAGE_SUCCESS_SCREEN &&
      this.props.screen !== screens.LOADING_SCREEN
    )
      return

    return (
      <PrechatScreen
        hideZendeskLogo={this.props.hideZendeskLogo}
        isMobile={this.props.isMobile}
        isPreview={this.props.isPreview}
      />
    )
  }

  renderChatScreen = () => {
    if (this.props.screen !== screens.CHATTING_SCREEN) return

    const showChatEndFn = (e) => {
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
        hideZendeskLogo={this.props.hideZendeskLogo}
        isMobile={this.props.isMobile}
        showContactDetails={this.showContactDetailsFn}
        isPreview={this.props.isPreview}
      />
    )
  }

  handleDragDrop = (attachments) => {
    return this.props.sendAttachments(attachments)
  }

  renderAttachmentsBox = () => {
    const { screen, attachmentsEnabled, isPreview } = this.props

    if (screen !== screens.CHATTING_SCREEN || !attachmentsEnabled || isPreview) return

    return <FileDropTarget onDrop={this.handleDragDrop} />
  }

  renderChatRatingPage = () => {
    if (this.props.screen !== screens.FEEDBACK_SCREEN) return null

    return <ChatRatingPage />
  }

  renderPostChatPage = () => {
    if (this.props.screen !== screens.POST_CHAT_SCREEN) return null

    return <PostChatPage />
  }

  renderChatReconnectionBubble = () => {
    const { connection, isLoggingOut } = this.props

    if (connection !== CONNECTION_STATUSES.CONNECTING || isLoggingOut) return

    return <ReconnectionBubble />
  }

  renderAgentListScreen = () => {
    if (this.props.screen !== screens.AGENT_LIST_SCREEN) return null

    return <AgentDetailsPage />
  }

  renderChatReconnectButton = () => {
    const { connection, isLoggingOut } = this.props

    if (connection !== CONNECTION_STATUSES.CLOSED || isLoggingOut) return

    return <ReconnectButton onClick={this.props.handleReconnect} />
  }

  render = () => {
    return (
      <div onKeyDown={this.onKeyDown} role="presentation" className={styles.chat}>
        <FileDropProvider>
          {this.renderPrechatScreen()}
          {this.renderChatScreen()}
          {this.renderAgentListScreen()}
          {this.renderChatRatingPage()}
          {this.renderPostChatPage()}
          {this.renderAttachmentsBox()}
          {this.renderChatReconnectionBubble()}
          {this.renderChatReconnectButton()}
        </FileDropProvider>
      </div>
    )
  }
}

const actionCreators = {
  sendAttachments,
  sendEmailTranscript,
  resetEmailTranscript,
  updateMenuVisibility,
  handleReconnect,
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility,
  updateEndChatModalVisibility,
}

const connected = connect(mapStateToProps, actionCreators, null, { forwardRef: true })(Chat)

export { connected as default, Chat as Component }
