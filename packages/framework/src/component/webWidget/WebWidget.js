import PropTypes from 'prop-types'
import { Component, lazy } from 'react'
import { connect } from 'react-redux'
import { isPopout, isMobileBrowser } from '@zendesk/widget-shared-services'
import { Container } from 'src/component/container/Container'
import OnBackProvider from 'src/component/webWidget/OnBackProvider'
import ChatNotificationPopup from 'src/components/NotificationPopup'
import SuspensePage from 'src/components/Widget/SuspensePage'
import { screenChanged as updateAnswerBotScreen } from 'src/embeds/answerBot/actions/root'
import { CONVERSATION_SCREEN } from 'src/embeds/answerBot/constants'
import {
  getStandaloneMobileNotificationVisible,
  getShowChatHistory,
} from 'src/embeds/chat/selectors'
import { closeCurrentArticle } from 'src/embeds/helpCenter/actions'
import ChannelChoicePage from 'src/embeds/webWidget/pages/ChannelChoicePage'
import {
  updateActiveEmbed,
  updateEmbedAccessible,
  updateBackButtonVisibility,
  onChannelChoiceNextClick,
} from 'src/redux/modules/base'
import { getActiveEmbed, getWebWidgetOpen } from 'src/redux/modules/base/base-selectors'
import {
  proactiveChatNotificationDismissed,
  updateChatScreen,
  chatNotificationRespond,
  closedChatHistory,
} from 'src/redux/modules/chat'
import {
  getHelpCenterAvailable,
  getChannelChoiceAvailable,
  getSubmitTicketAvailable,
  getAnswerBotAvailable,
} from 'src/redux/modules/selectors'
import { getChatNotification } from 'src/redux/modules/selectors'
import { getSettingsMobileNotificationsDisabled } from 'src/redux/modules/settings/settings-selectors'
import history from 'src/service/history'
import { WidgetContainer } from './styles'

const Talk = lazy(() => import(/* webpackChunkName: 'lazy/talk' */ 'src/embeds/talk'))
const HelpCenter = lazy(() =>
  import(/* webpackChunkName: 'lazy/help_center' */ 'src/embeds/helpCenter')
)
const Support = lazy(() => import(/* webpackChunkName: 'lazy/support' */ 'src/embeds/support'))
const AnswerBot = lazy(() =>
  import(/* webpackChunkName: 'lazy/answerBot' */ 'src/embeds/answerBot')
)
const Chat = lazy(() => import(/* webpackChunkName: 'lazy/chat' */ 'src/component/chat/Chat'))

const submitTicket = 'ticketSubmissionForm'
const helpCenter = 'helpCenterForm'
const chat = 'chat'
const channelChoice = 'channelChoice'
const talk = 'talk'
const mobileChatPopup = 'mobileChatPopup'
const answerBot = 'answerBot'

const mapStateToProps = (state) => {
  return {
    chatNotification: getChatNotification(state),
    chatStandaloneMobileNotificationVisible: getStandaloneMobileNotificationVisible(state),
    activeEmbed: getActiveEmbed(state),
    mobileNotificationsDisabled: getSettingsMobileNotificationsDisabled(state),
    helpCenterAvailable: getHelpCenterAvailable(state),
    channelChoiceAvailable: getChannelChoiceAvailable(state),
    submitTicketAvailable: getSubmitTicketAvailable(state),
    webWidgetOpen: getWebWidgetOpen(state),
    answerBotAvailable: getAnswerBotAvailable(state),
    showChatHistory: getShowChatHistory(state),
    ipmHelpCenterAvailable: !getHelpCenterAvailable(state),
    isMobile: isMobileBrowser(),
  }
}

class WebWidget extends Component {
  static propTypes = {
    chatNotification: PropTypes.shape({
      avatar_path: PropTypes.string, // eslint-disable-line camelcase
      count: PropTypes.number,
      display_name: PropTypes.string, // eslint-disable-line camelcase
      msg: PropTypes.string,
      nick: PropTypes.string,
      proactive: PropTypes.bool,
      show: PropTypes.bool,
    }).isRequired,
    chatStandaloneMobileNotificationVisible: PropTypes.bool.isRequired,
    style: PropTypes.shape({
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    updateActiveEmbed: PropTypes.func.isRequired,
    updateBackButtonVisibility: PropTypes.func.isRequired,
    proactiveChatNotificationDismissed: PropTypes.func.isRequired,
    chatNotificationRespond: PropTypes.func.isRequired,
    activeEmbed: PropTypes.string.isRequired,
    closeCurrentArticle: PropTypes.func.isRequired,
    ipmHelpCenterAvailable: PropTypes.bool,
    mobileNotificationsDisabled: PropTypes.bool,
    helpCenterAvailable: PropTypes.bool.isRequired,
    channelChoiceAvailable: PropTypes.bool.isRequired,
    submitTicketAvailable: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    webWidgetOpen: PropTypes.bool.isRequired,
    answerBotAvailable: PropTypes.bool.isRequired,
    updateAnswerBotScreen: PropTypes.func.isRequired,
    closedChatHistory: PropTypes.func.isRequired,
    showChatHistory: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    chatNotification: { show: false, playSound: false },
    helpCenterAvailable: false,
    style: null,
    ticketFieldSettings: [],
    ticketFormSettings: [],
    updateBackButtonVisibility: () => {},
    talkOnline: false,
    onBackButtonClick: () => {},
    closeCurrentArticle: () => {},
    ipmHelpCenterAvailable: false,
    mobileNotificationsDisabled: false,
    proactiveChatNotificationDismissed: () => {},
    webWidgetOpen: true,
    answerBotAvailable: false,
    updateAnswerBotScreen: () => {},
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
      channelChoiceAvailable,
      showChatHistory,
      closedChatHistory,
    } = this.props
    const isShowingChatHistory = activeEmbed === chat && showChatHistory

    if (activeEmbed === answerBot) {
      updateBackButtonVisibility(false)
      updateAnswerBotScreen(CONVERSATION_SCREEN)
    } else if (isShowingChatHistory) {
      closedChatHistory()
    } else if (answerBotAvailable) {
      updateBackButtonVisibility(false)
      updateActiveEmbed(answerBot)
    } else if (channelChoiceAvailable && activeEmbed !== channelChoice) {
      updateActiveEmbed(channelChoice)
      updateBackButtonVisibility(helpCenterAvailable)
      history.goBack()
    } else if (helpCenterAvailable) {
      this.showHelpCenter()
      history.goBack()
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

    return (
      <SuspensePage>
        <Chat />
      </SuspensePage>
    )
  }

  renderAnswerBot = () => {
    if (this.props.activeEmbed !== answerBot) return

    return (
      <SuspensePage>
        <AnswerBot />
      </SuspensePage>
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

    return (
      <SuspensePage>
        <Support />
      </SuspensePage>
    )
  }

  renderChannelChoice = () => {
    if (this.props.activeEmbed !== channelChoice) return null

    return <ChannelChoicePage />
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
      proactiveChatNotificationDismissed,
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
            chatNotificationRespond={onNotificatonResponded}
            chatNotificationDismissed={proactiveChatNotificationDismissed}
          />
        </Container>
      </div>
    )
  }

  render = () => {
    const {
      isMobile,
      activeEmbed,
      mobileNotificationsDisabled,
      webWidgetOpen,
      chatStandaloneMobileNotificationVisible,
    } = this.props

    if (isMobile && chatStandaloneMobileNotificationVisible && !mobileNotificationsDisabled) {
      return this.renderStandaloneChatPopup()
    }

    if (!webWidgetOpen) return null

    return (
      // data-embed is needed for our integration tests
      <WidgetContainer data-embed={activeEmbed} isFullHeight={isMobileBrowser() || isPopout()}>
        <OnBackProvider value={this.onBackClick}>
          {this.renderSubmitTicket()}
          {this.renderChat()}
          {this.renderHelpCenter()}
          {this.renderChannelChoice()}
          {this.renderTalk()}
          {this.renderAnswerBot()}
        </OnBackProvider>
      </WidgetContainer>
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
  onChannelChoiceNextClick,
}

const connectedComponent = connect(mapStateToProps, actionCreators, null, { forwardRef: true })(
  WebWidget
)

export { connectedComponent as default, WebWidget as Component }
