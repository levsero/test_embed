import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types'
import AnswerBot from 'component/answerBot'
import Chat from 'component/chat/Chat'
import Talk from 'src/embeds/talk'
import { ChannelChoice } from 'component/channelChoice/ChannelChoice'
import { ChatNotificationPopup } from 'component/chat/ChatNotificationPopup'
import { Container } from 'component/container/Container'
import HelpCenter from 'component/helpCenter/HelpCenter'
import SubmitTicket from 'component/submitTicket/SubmitTicket'
import {
  updateActiveEmbed,
  updateEmbedAccessible,
  updateBackButtonVisibility,
  nextButtonClicked,
  cancelButtonClicked
} from 'src/redux/modules/base'
import {
  proactiveChatNotificationDismissed,
  chatNotificationDismissed,
  updateChatScreen,
  chatNotificationRespond,
  showStandaloneMobileNotification,
  closedChatHistory
} from 'src/redux/modules/chat'
import { resetActiveArticle } from 'embeds/helpCenter/actions'
import {
  getChatAvailable,
  getChatOfflineAvailable,
  getChatEnabled,
  getHideZendeskLogo,
  getShowTicketFormsBackButton,
  getTalkOnline,
  getHelpCenterAvailable,
  getChannelChoiceAvailable,
  getSubmitTicketAvailable,
  getAnswerBotAvailable
} from 'src/redux/modules/selectors'
import {
  getArticleViewActive,
  getSearchFieldFocused,
  getResultsCount
} from 'embeds/helpCenter/selectors'
import {
  getZopimChatEmbed,
  getActiveEmbed,
  getChatStandalone,
  getWebWidgetVisible
} from 'src/redux/modules/base/base-selectors'
import {
  getStandaloneMobileNotificationVisible,
  getShowChatHistory
} from 'src/redux/modules/chat/chat-selectors'
import { getChatNotification } from 'src/redux/modules/selectors'
import { isCallbackEnabled } from 'src/redux/modules/talk/talk-selectors'
import {
  getSettingsMobileNotificationsDisabled,
  getSettingsHelpCenterOriginalArticleButton
} from 'src/redux/modules/settings/settings-selectors'
import { screenChanged as updateAnswerBotScreen } from 'src/redux/modules/answerBot/root/actions'
import { CONVERSATION_SCREEN } from 'src/constants/answerBot'

const submitTicket = 'ticketSubmissionForm'
const helpCenter = 'helpCenterForm'
const chat = 'chat'
const zopimChat = 'zopimChat'
const channelChoice = 'channelChoice'
const talk = 'talk'
const mobileChatPopup = 'mobileChatPopup'
const answerBot = 'answerBot'
const noActiveEmbed = ''

const mapStateToProps = state => {
  return {
    articleViewActive: getArticleViewActive(state),
    helpCenterSearchFocused: getSearchFieldFocused(state),
    chatNotification: getChatNotification(state),
    chatStandaloneMobileNotificationVisible: getStandaloneMobileNotificationVisible(state),
    activeEmbed: getActiveEmbed(state),
    talkOnline: getTalkOnline(state),
    callbackEnabled: isCallbackEnabled(state),
    chatAvailable: getChatAvailable(state),
    chatOfflineAvailable: getChatOfflineAvailable(state),
    chatEnabled: getChatEnabled(state),
    oldChat: getZopimChatEmbed(state),
    showTicketFormsBackButton: getShowTicketFormsBackButton(state),
    chatStandalone: getChatStandalone(state),
    resultsCount: getResultsCount(state),
    mobileNotificationsDisabled: getSettingsMobileNotificationsDisabled(state),
    helpCenterAvailable: getHelpCenterAvailable(state),
    channelChoiceAvailable: getChannelChoiceAvailable(state),
    submitTicketAvailable: getSubmitTicketAvailable(state),
    hideZendeskLogo: getHideZendeskLogo(state),
    originalArticleButton: getSettingsHelpCenterOriginalArticleButton(state),
    webWidgetVisible: getWebWidgetVisible(state),
    answerBotAvailable: getAnswerBotAvailable(state),
    showChatHistory: getShowChatHistory(state)
  }
}

class WebWidget extends Component {
  static propTypes = {
    attachmentSender: PropTypes.func,
    callbackEnabled: PropTypes.bool.isRequired,
    chatNotification: PropTypes.shape({
      avatar_path: PropTypes.string, // eslint-disable-line camelcase
      count: PropTypes.number,
      display_name: PropTypes.string, // eslint-disable-line camelcase
      msg: PropTypes.string,
      nick: PropTypes.string,
      proactive: PropTypes.bool,
      show: PropTypes.bool
    }).isRequired,
    chatStandaloneMobileNotificationVisible: PropTypes.bool.isRequired,
    fullscreen: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    oldChat: PropTypes.bool.isRequired,
    onSubmitted: PropTypes.func,
    originalArticleButton: PropTypes.bool,
    position: PropTypes.string,
    showTicketFormsBackButton: PropTypes.bool,
    style: PropTypes.shape({
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }),
    submitTicketConfig: PropTypes.shape({
      color: PropTypes.string,
      customFields: PropTypes.object,
      formTitleKey: PropTypes.string,
      maxFileCount: PropTypes.number,
      maxFileSize: PropTypes.number,
      position: PropTypes.string,
      ticketForms: PropTypes.array
    }),
    ticketFieldSettings: PropTypes.array,
    ticketFormSettings: PropTypes.array,
    zopimOnNext: PropTypes.func,
    onBackButtonClick: PropTypes.func,
    updateActiveEmbed: PropTypes.func.isRequired,
    updateBackButtonVisibility: PropTypes.func.isRequired,
    chatNotificationDismissed: PropTypes.func.isRequired,
    proactiveChatNotificationDismissed: PropTypes.func.isRequired,
    chatNotificationRespond: PropTypes.func.isRequired,
    updateChatScreen: PropTypes.func.isRequired,
    nextButtonClicked: PropTypes.func.isRequired,
    cancelButtonClicked: PropTypes.func.isRequired,
    activeEmbed: PropTypes.string.isRequired,
    chatAvailable: PropTypes.bool.isRequired,
    chatEnabled: PropTypes.bool.isRequired,
    talkOnline: PropTypes.bool.isRequired,
    talkConfig: PropTypes.shape({
      serviceUrl: PropTypes.string,
      nickname: PropTypes.string
    }),
    resetActiveArticle: PropTypes.func.isRequired,
    articleViewActive: PropTypes.bool.isRequired,
    helpCenterSearchFocused: PropTypes.bool.isRequired,
    chatStandalone: PropTypes.bool.isRequired,
    showStandaloneMobileNotification: PropTypes.func.isRequired,
    resultsCount: PropTypes.number.isRequired,
    ipmHelpCenterAvailable: PropTypes.bool,
    mobileNotificationsDisabled: PropTypes.bool,
    chatOfflineAvailable: PropTypes.bool.isRequired,
    helpCenterAvailable: PropTypes.bool.isRequired,
    channelChoiceAvailable: PropTypes.bool.isRequired,
    submitTicketAvailable: PropTypes.bool.isRequired,
    chatId: PropTypes.string,
    isMobile: PropTypes.bool.isRequired,
    webWidgetVisible: PropTypes.bool.isRequired,
    answerBotAvailable: PropTypes.bool.isRequired,
    updateAnswerBotScreen: PropTypes.func.isRequired,
    closedChatHistory: PropTypes.func.isRequired,
    showChatHistory: PropTypes.bool.isRequired
  }

  static defaultProps = {
    chatNotification: { show: false, playSound: false },
    fullscreen: true,
    helpCenterAvailable: false,
    hideZendeskLogo: false,
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
    talkOnline: false,
    zopimOnNext: () => {},
    onBackButtonClick: () => {},
    talkConfig: {},
    resetActiveArticle: () => {},
    articleViewActive: false,
    ipmHelpCenterAvailable: false,
    mobileNotificationsDisabled: false,
    proactiveChatNotificationDismissed: () => {},
    chatId: '',
    webWidgetVisible: true,
    answerBotAvailable: false,
    updateAnswerBotScreen: () => {}
  }

  setComponent = activeComponent => {
    this.props.updateBackButtonVisibility(true)

    if (activeComponent === chat) {
      this.showChat()
    } else {
      this.props.updateActiveEmbed(activeComponent)
    }
  }

  getActiveComponent = () => {
    return this.refs[this.props.activeEmbed]
  }

  getSubmitTicketComponent = () => {
    return this.refs[submitTicket]
  }

  getHelpCenterComponent = () => this.refs[helpCenter]

  noActiveEmbed = () => this.props.activeEmbed === ''

  showChat = (options = { proactive: false }) => {
    const { updateActiveEmbed, oldChat, zopimOnNext } = this.props

    if (oldChat) {
      zopimOnNext()

      updateActiveEmbed(zopimChat)
    } else {
      updateActiveEmbed(chat)
      if (options.proactive) {
        this.props.updateChatScreen(CHATTING_SCREEN)
      }
    }
  }

  showProactiveChat = () => {
    if (this.props.isMobile) {
      this.props.showStandaloneMobileNotification()
    } else {
      const { proactive, show } = this.props.chatNotification

      if (proactive && show) {
        this.showChat({ proactive: true })
      }
    }
  }

  show = () => {
    const { activeEmbed, chatAvailable, channelChoiceAvailable } = this.props

    // If chat came online when contact form was open it should
    // replace it when it's next opened.
    if (activeEmbed === submitTicket && chatAvailable && !channelChoiceAvailable) {
      this.showChat()
    }
  }

  showHelpCenter = () => {
    const { updateActiveEmbed, updateBackButtonVisibility, articleViewActive } = this.props

    updateActiveEmbed(helpCenter)
    updateBackButtonVisibility(articleViewActive)
  }

  onNextClick = embed => {
    const {
      updateBackButtonVisibility,
      ipmHelpCenterAvailable,
      updateActiveEmbed,
      oldChat,
      chatAvailable,
      talkOnline,
      channelChoiceAvailable,
      nextButtonClicked
    } = this.props

    if (channelChoiceAvailable) {
      updateActiveEmbed(channelChoice)
      if (!ipmHelpCenterAvailable) {
        updateBackButtonVisibility(true)
      }
    } else if (embed) {
      this.setComponent(embed)
    } else if (chatAvailable) {
      this.showChat()
      // TODO: track chat started
      if (!oldChat) {
        updateBackButtonVisibility(true)
      }
    } else if (talkOnline) {
      updateActiveEmbed(talk)
      updateBackButtonVisibility(true)
    } else {
      updateActiveEmbed(submitTicket)
      if (!ipmHelpCenterAvailable) {
        updateBackButtonVisibility(true)
      }
    }

    nextButtonClicked()
  }

  onCancelClick = () => {
    const {
      updateActiveEmbed,
      cancelButtonClicked,
      updateBackButtonVisibility,
      helpCenterAvailable,
      channelChoiceAvailable,
      answerBotAvailable
    } = this.props

    if (answerBotAvailable) {
      updateBackButtonVisibility(false)
      updateActiveEmbed(answerBot)
    } else if (helpCenterAvailable) {
      this.showHelpCenter()
    } else if (channelChoiceAvailable) {
      updateActiveEmbed(channelChoice)
      updateBackButtonVisibility(false)
    } else {
      cancelButtonClicked()
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
      answerBotAvailable,
      updateAnswerBotScreen,
      showTicketFormsBackButton,
      channelChoiceAvailable,
      showChatHistory,
      closedChatHistory
    } = this.props
    const activeComponent = this.getActiveComponent()
    const isShowingChatHistory = activeEmbed === chat && showChatHistory

    if (activeEmbed === answerBot) {
      updateBackButtonVisibility(false)
      updateAnswerBotScreen(CONVERSATION_SCREEN)
    } else if (isShowingChatHistory) {
      closedChatHistory()
    } else if (activeEmbed === helpCenter) {
      updateBackButtonVisibility(false)
      resetActiveArticle()
      if (ipmHelpCenterAvailable) {
        updateActiveEmbed(channelChoice)
      }
    } else if (showTicketFormsBackButton) {
      activeComponent.clearForm()
      updateBackButtonVisibility(helpCenterAvailable || channelChoiceAvailable)
    } else if (answerBotAvailable) {
      updateBackButtonVisibility(false)
      updateActiveEmbed(answerBot)
    } else if (channelChoiceAvailable && activeEmbed !== channelChoice) {
      updateActiveEmbed(channelChoice)
      updateBackButtonVisibility(helpCenterAvailable)
    } else if (helpCenterAvailable) {
      this.showHelpCenter()
    } else {
      if (ipmHelpCenterAvailable) {
        resetActiveArticle()
      }
      updateActiveEmbed(channelChoice)
      updateBackButtonVisibility(false)
    }
  }

  onContainerClick = () => {
    const { activeEmbed } = this.props
    const activeComponent = this.getActiveComponent() || {}

    if (activeEmbed === noActiveEmbed) return

    _.attempt(activeComponent.onContainerClick)
  }

  onContainerDragEnter = () => {
    const { activeEmbed } = this.props

    if (activeEmbed === submitTicket || activeEmbed === chat) {
      this.getActiveComponent().handleDragEnter()
    }
  }

  renderChat = () => {
    if (this.props.activeEmbed !== chat) return

    const updateChatBackButtonVisibility = () => {
      if (this.props.chatStandalone) return

      this.props.updateBackButtonVisibility(
        this.props.helpCenterAvailable || this.props.channelChoiceAvailable
      )
    }

    return (
      <Chat
        ref={chat}
        forwardRef={chat}
        isMobile={this.props.isMobile}
        fullscreen={this.props.fullscreen}
        hideZendeskLogo={this.props.hideZendeskLogo}
        position={this.props.position}
        chatId={this.props.chatId}
        updateChatBackButtonVisibility={updateChatBackButtonVisibility}
        onBackButtonClick={this.props.onBackButtonClick}
      />
    )
  }

  renderAnswerBot = () => {
    if (this.props.activeEmbed !== answerBot) return

    return (
      <AnswerBot
        ref={answerBot}
        isMobile={this.props.isMobile}
        hideZendeskLogo={this.props.hideZendeskLogo}
      />
    )
  }

  renderHelpCenter = () => {
    if (!this.props.helpCenterAvailable && !this.props.ipmHelpCenterAvailable) return
    if (this.props.activeEmbed !== helpCenter) return null

    const { chatAvailable, channelChoiceAvailable } = this.props
    const classes = this.props.activeEmbed !== helpCenter ? 'u-isHidden' : ''

    return (
      <div className={classes}>
        <HelpCenter
          ref={helpCenter}
          chatOfflineAvailable={this.props.chatOfflineAvailable}
          notification={this.props.chatNotification}
          talkOnline={this.props.talkOnline}
          hideZendeskLogo={this.props.hideZendeskLogo}
          onNextClick={this.onNextClick}
          position={this.props.position}
          showBackButton={this.props.updateBackButtonVisibility}
          style={this.props.style}
          fullscreen={this.props.fullscreen}
          originalArticleButton={this.props.originalArticleButton}
          channelChoice={channelChoiceAvailable}
          callbackEnabled={this.props.callbackEnabled}
          chatAvailable={chatAvailable}
          chatNotificationDismissed={this.props.chatNotificationDismissed}
          updateChatScreen={this.props.updateChatScreen}
          isMobile={this.props.isMobile}
        />
      </div>
    )
  }

  renderSubmitTicket = () => {
    if (!this.props.submitTicketAvailable) return null
    if (this.props.activeEmbed !== submitTicket) return null

    const { submitTicketConfig } = this.props
    const classes = this.props.activeEmbed !== submitTicket ? 'u-isHidden' : ''

    return (
      <div className={classes}>
        <SubmitTicket
          ref={submitTicket}
          attachmentSender={this.props.attachmentSender}
          customFields={submitTicketConfig.customFields}
          formTitleKey={submitTicketConfig.formTitleKey}
          hideZendeskLogo={this.props.hideZendeskLogo}
          maxFileCount={submitTicketConfig.maxFileCount}
          maxFileSize={submitTicketConfig.maxFileSize}
          onCancel={this.onCancelClick}
          onSubmitted={this.props.onSubmitted}
          position={submitTicketConfig.position}
          showBackButton={this.props.updateBackButtonVisibility}
          style={this.props.style}
          ticketFieldSettings={this.props.ticketFieldSettings}
          ticketFormSettings={this.props.ticketFormSettings}
          fullscreen={this.props.fullscreen}
          isMobile={this.props.isMobile}
        />
      </div>
    )
  }

  renderChannelChoice = () => {
    if (this.props.activeEmbed !== channelChoice) return null

    return (
      <ChannelChoice
        ref={channelChoice}
        style={this.props.style}
        chatAvailable={this.props.chatAvailable}
        chatOfflineAvailable={this.props.chatOfflineAvailable}
        talkOnline={this.props.talkOnline}
        callbackEnabled={this.props.callbackEnabled}
        submitTicketAvailable={this.props.submitTicketAvailable}
        chatEnabled={this.props.chatEnabled}
        isMobile={this.props.isMobile}
        onNextClick={this.setComponent}
        hideZendeskLogo={this.props.hideZendeskLogo}
      />
    )
  }

  renderTalk = () => {
    if (this.props.activeEmbed !== talk) return null

    return <Talk />
  }

  renderChatNotification = () => {
    // For now only display notifications inside Help Center
    if (this.props.activeEmbed !== helpCenter) return null

    const onNotificatonResponded = () => {
      this.onNextClick(chat)
      this.props.chatNotificationRespond()
    }

    const shouldShow = !this.props.isMobile || !this.props.helpCenterSearchFocused

    return (
      <ChatNotificationPopup
        resultsCount={this.props.resultsCount}
        isMobile={this.props.isMobile}
        notification={this.props.chatNotification}
        shouldShow={shouldShow}
        fullscreen={this.props.fullscreen}
        chatNotificationRespond={onNotificatonResponded}
        chatNotificationDismissed={this.props.chatNotificationDismissed}
      />
    )
  }

  dismissStandaloneChatPopup = () => {
    this.props.proactiveChatNotificationDismissed()
  }

  renderStandaloneChatPopup() {
    const { style, chatNotification, chatNotificationRespond } = this.props
    const onNotificatonResponded = () => {
      chatNotificationRespond()
      this.showChat({ proactive: true })
    }
    const containerStyle = { ...style, background: 'transparent' }
    const notification = { ...chatNotification, show: true }

    return (
      <div style={style} data-embed={mobileChatPopup}>
        <Container style={containerStyle} isMobile={true}>
          <ChatNotificationPopup
            isMobile={true}
            notification={notification}
            fullscreen={this.props.fullscreen}
            shouldShow={true}
            chatNotificationRespond={onNotificatonResponded}
            chatNotificationDismissed={this.dismissStandaloneChatPopup}
          />
        </Container>
      </div>
    )
  }

  render = () => {
    const {
      fullscreen,
      isMobile,
      style,
      activeEmbed,
      position,
      mobileNotificationsDisabled,
      webWidgetVisible,
      chatStandaloneMobileNotificationVisible
    } = this.props

    if (isMobile && chatStandaloneMobileNotificationVisible && !mobileNotificationsDisabled) {
      return this.renderStandaloneChatPopup()
    }

    if (!webWidgetVisible) return null

    let containerStyle =
      fullscreen && !isMobile
        ? {
            ...style,
            left: '50%',
            transform: 'translate(-50%)' // Position the widget in the center
          }
        : style

    return (
      // data-embed is needed for our intergration tests
      <div data-embed={activeEmbed} style={{ height: '100%' }}>
        <Container
          style={containerStyle}
          fullscreen={fullscreen}
          isMobile={isMobile}
          position={position}
          onClick={this.onContainerClick}
          onDragEnter={this.onContainerDragEnter}
        >
          {this.renderSubmitTicket()}
          {this.renderChat()}
          {this.renderHelpCenter()}
          {this.renderChannelChoice()}
          {this.renderTalk()}
          {this.renderAnswerBot()}
          {this.renderChatNotification()}
        </Container>
      </div>
    )
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
  cancelButtonClicked,
  proactiveChatNotificationDismissed,
  updateAnswerBotScreen,
  closedChatHistory
}

export default connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(WebWidget)
