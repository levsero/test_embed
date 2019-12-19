import React, { Component, lazy } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import AnswerBot from 'component/answerBot'
import Chat from 'component/chat/Chat'

import Support from 'embeds/support'
import { ChannelChoice } from 'component/channelChoice/ChannelChoice'
import ChatNotificationPopup from 'components/NotificationPopup'
import { Container } from 'component/container/Container'
import SubmitTicket from 'component/submitTicket/SubmitTicket'
import {
  updateActiveEmbed,
  updateEmbedAccessible,
  updateBackButtonVisibility,
  onChannelChoiceNextClick
} from 'src/redux/modules/base'
import {
  proactiveChatNotificationDismissed,
  updateChatScreen,
  chatNotificationRespond,
  closedChatHistory
} from 'src/redux/modules/chat'
import { closeCurrentArticle } from 'embeds/helpCenter/actions'
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
import { getSettingsMobileNotificationsDisabled } from 'src/redux/modules/settings/settings-selectors'
import { screenChanged as updateAnswerBotScreen } from 'src/redux/modules/answerBot/root/actions'
import { CONVERSATION_SCREEN } from 'src/constants/answerBot'
import { getNewSupportEmbedEnabled } from 'embeds/support/selectors'
import OnBackProvider from 'component/webWidget/OnBackProvider'
import SuspensePage from 'src/components/Widget/SuspensePage'

const Talk = lazy(() => import(/* webpackChunkName: 'lazy/talk' */ 'embeds/talk'))
const HelpCenter = lazy(() =>
  import(/* webpackChunkName: 'lazy/help_center' */ 'embeds/helpCenter')
)

const submitTicket = 'ticketSubmissionForm'
const helpCenter = 'helpCenterForm'
const chat = 'chat'
const channelChoice = 'channelChoice'
const talk = 'talk'
const mobileChatPopup = 'mobileChatPopup'
const answerBot = 'answerBot'

const mapStateToProps = state => {
  return {
    chatNotification: getChatNotification(state),
    chatStandaloneMobileNotificationVisible: getStandaloneMobileNotificationVisible(state),
    activeEmbed: getActiveEmbed(state),
    talkOnline: getTalkOnline(state),
    callbackEnabled: isCallbackEnabled(state),
    chatAvailable: getChatAvailable(state),
    chatOfflineAvailable: getChatOfflineAvailable(state),
    chatEnabled: getChatEnabled(state),
    showTicketFormsBackButton: getShowTicketFormsBackButton(state),
    chatStandalone: getChatStandalone(state),
    mobileNotificationsDisabled: getSettingsMobileNotificationsDisabled(state),
    helpCenterAvailable: getHelpCenterAvailable(state),
    channelChoiceAvailable: getChannelChoiceAvailable(state),
    onChannelChoiceNextClick: onChannelChoiceNextClick(state),
    submitTicketAvailable: getSubmitTicketAvailable(state),
    hideZendeskLogo: getHideZendeskLogo(state),
    webWidgetVisible: getWebWidgetVisible(state),
    answerBotAvailable: getAnswerBotAvailable(state),
    showChatHistory: getShowChatHistory(state),
    webWidgetReactRouterSupport: getNewSupportEmbedEnabled(state)
  }
}

class WebWidget extends Component {
  static propTypes = {
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
    showTicketFormsBackButton: PropTypes.bool,
    style: PropTypes.shape({
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }),
    ticketFieldSettings: PropTypes.array,
    ticketFormSettings: PropTypes.array,
    onBackButtonClick: PropTypes.func,
    updateActiveEmbed: PropTypes.func.isRequired,
    updateBackButtonVisibility: PropTypes.func.isRequired,
    proactiveChatNotificationDismissed: PropTypes.func.isRequired,
    chatNotificationRespond: PropTypes.func.isRequired,
    activeEmbed: PropTypes.string.isRequired,
    chatAvailable: PropTypes.bool.isRequired,
    chatEnabled: PropTypes.bool.isRequired,
    talkOnline: PropTypes.bool.isRequired,
    closeCurrentArticle: PropTypes.func.isRequired,
    chatStandalone: PropTypes.bool.isRequired,
    ipmHelpCenterAvailable: PropTypes.bool,
    mobileNotificationsDisabled: PropTypes.bool,
    chatOfflineAvailable: PropTypes.bool.isRequired,
    helpCenterAvailable: PropTypes.bool.isRequired,
    channelChoiceAvailable: PropTypes.bool.isRequired,
    onChannelChoiceNextClick: PropTypes.func.isRequired,
    submitTicketAvailable: PropTypes.bool.isRequired,
    chatId: PropTypes.string,
    isMobile: PropTypes.bool.isRequired,
    webWidgetVisible: PropTypes.bool.isRequired,
    answerBotAvailable: PropTypes.bool.isRequired,
    updateAnswerBotScreen: PropTypes.func.isRequired,
    closedChatHistory: PropTypes.func.isRequired,
    showChatHistory: PropTypes.bool.isRequired,
    webWidgetReactRouterSupport: PropTypes.bool
  }

  static defaultProps = {
    chatNotification: { show: false, playSound: false },
    fullscreen: true,
    helpCenterAvailable: false,
    hideZendeskLogo: false,
    style: null,
    showTicketFormsBackButton: false,
    ticketFieldSettings: [],
    ticketFormSettings: [],
    updateBackButtonVisibility: () => {},
    talkOnline: false,
    onBackButtonClick: () => {},
    closeCurrentArticle: () => {},
    ipmHelpCenterAvailable: false,
    mobileNotificationsDisabled: false,
    chatId: '',
    proactiveChatNotificationDismissed: () => {},
    webWidgetVisible: true,
    answerBotAvailable: false,
    updateAnswerBotScreen: () => {},
    webWidgetReactRouterSupport: false
  }

  getActiveComponent = () => {
    return this.refs[this.props.activeEmbed]
  }

  getSubmitTicketComponent = () => {
    return this.refs[submitTicket]
  }

  getHelpCenterComponent = () => this.refs[helpCenter]

  noActiveEmbed = () => this.props.activeEmbed === ''

  showHelpCenter = () => {
    this.props.updateActiveEmbed(helpCenter)
  }

  onBackClick = () => {
    const {
      ipmHelpCenterAvailable,
      activeEmbed,
      updateBackButtonVisibility,
      updateActiveEmbed,
      closeCurrentArticle,
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
        closeCurrentArticle()
      }
      updateActiveEmbed(channelChoice)
      updateBackButtonVisibility(false)
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

    return (
      <SuspensePage>
        <HelpCenter />
      </SuspensePage>
    )
  }

  renderSubmitTicket = () => {
    if (!this.props.submitTicketAvailable) return null
    if (this.props.activeEmbed !== submitTicket) return null

    const { webWidgetReactRouterSupport } = this.props

    if (webWidgetReactRouterSupport) {
      return <Support />
    }

    const classes = this.props.activeEmbed !== submitTicket ? 'u-isHidden' : ''

    return (
      <div className={classes}>
        <SubmitTicket
          ref={submitTicket}
          hideZendeskLogo={this.props.hideZendeskLogo}
          onCancel={this.onCancelClick}
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
        onNextClick={this.props.onChannelChoiceNextClick}
        hideZendeskLogo={this.props.hideZendeskLogo}
      />
    )
  }

  renderTalk = () => {
    if (this.props.activeEmbed !== talk) return null

    return (
      <SuspensePage>
        <Talk />
      </SuspensePage>
    )
  }

  renderStandaloneChatPopup() {
    const {
      style,
      chatNotification,
      chatNotificationRespond,
      proactiveChatNotificationDismissed
    } = this.props
    const onNotificatonResponded = () => {
      chatNotificationRespond()
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
            chatNotificationRespond={onNotificatonResponded}
            chatNotificationDismissed={proactiveChatNotificationDismissed}
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
      // data-embed is needed for our integration tests
      <div data-embed={activeEmbed} style={{ height: '100%' }}>
        <Container style={containerStyle} fullscreen={fullscreen} isMobile={isMobile}>
          <OnBackProvider value={this.onBackClick}>
            {this.renderSubmitTicket()}
            {this.renderChat()}
            {this.renderHelpCenter()}
            {this.renderChannelChoice()}
            {this.renderTalk()}
            {this.renderAnswerBot()}
          </OnBackProvider>
        </Container>
      </div>
    )
  }
}

const actionCreators = {
  closeCurrentArticle,
  updateActiveEmbed,
  updateEmbedAccessible,
  updateBackButtonVisibility,
  proactiveChatNotificationDismissed,
  chatNotificationRespond,
  updateChatScreen,
  updateAnswerBotScreen,
  closedChatHistory,
  onChannelChoiceNextClick
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(WebWidget)

export { connectedComponent as default, WebWidget as Component }
