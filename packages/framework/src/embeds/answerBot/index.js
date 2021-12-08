import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isMobileBrowser, onNextTick } from '@zendesk/widget-shared-services'
import { Widget, Header, Main } from 'src/components/Widget'
import { conversationScrollChanged } from 'src/embeds/answerBot/actions/conversation'
import AnswerBotContainer from 'src/embeds/answerBot/components/AnswerBotContainer'
import ConversationFooter from 'src/embeds/answerBot/components/ConversationFooter'
import { ARTICLE_SCREEN, CONVERSATION_SCREEN } from 'src/embeds/answerBot/constants'
import ArticlePage from 'src/embeds/answerBot/pages/ArticlePage'
import ConversationPage from 'src/embeds/answerBot/pages/ConversationPage'
import { getLastScroll } from 'src/embeds/answerBot/selectors/conversation'
import { getCurrentScreen } from 'src/embeds/answerBot/selectors/root'
import { updateBackButtonVisibility } from 'src/redux/modules/base'
import { getSettingsAnswerBotTitle } from 'src/redux/modules/selectors'
import { getHideZendeskLogo } from 'src/redux/modules/selectors'

const SCROLL_TO_BOTTOM_INDICATOR = -1

class AnswerBot extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    currentScreen: PropTypes.string.isRequired,
    lastConversationScroll: PropTypes.number.isRequired,
    hideZendeskLogo: PropTypes.bool,
    actions: PropTypes.shape({
      updateBackButtonVisibility: PropTypes.func.isRequired,
      conversationScrollChanged: PropTypes.func.isRequired,
    }),
    title: PropTypes.string.isRequired,
  }

  static defaultProps = {
    isMobile: false,
    hideZendeskLogo: false,
  }

  constructor(props) {
    super(props)

    this.conversationContainer = null
  }

  componentDidMount() {
    // Restore conversation scroll position after switching back from another embed
    if (this.props.currentScreen === CONVERSATION_SCREEN) {
      this.restoreConversationScroll()
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentScreen === ARTICLE_SCREEN && prevProps.currentScreen !== ARTICLE_SCREEN) {
      this.props.actions.updateBackButtonVisibility(true)
    }
  }

  componentWillUnmount() {
    // Save conversation scroll position before switching to another embed
    if (this.props.currentScreen === CONVERSATION_SCREEN) {
      this.saveConversationScroll()
    }
  }

  articleScreen = () => {
    return (
      <ArticlePage
        isMobile={this.props.isMobile}
        saveConversationScroll={this.saveConversationScroll}
      />
    )
  }

  conversationScreen = () => {
    return (
      <Widget>
        <Header title={this.props.title} />
        <Main
          ref={(el) => {
            this.conversationContainer = el
          }}
        >
          <ConversationPage scrollToBottom={this.scrollToBottom} />
        </Main>
        <ConversationFooter
          hideZendeskLogo={this.props.hideZendeskLogo}
          scrollToBottom={this.scrollToBottom}
          isMobile={this.props.isMobile}
        />
      </Widget>
    )
  }

  scrollToBottom = () => {
    onNextTick(() => {
      if (this.conversationContainer) {
        this.conversationContainer.scrollTop = this.conversationContainer.scrollHeight
      }
    })
  }

  restoreConversationScroll = () => {
    const scrollTop = this.props.lastConversationScroll

    if (scrollTop === SCROLL_TO_BOTTOM_INDICATOR) {
      this.scrollToBottom()
    } else {
      onNextTick(() => {
        if (this.conversationContainer) {
          this.conversationContainer.scrollTop = scrollTop
        }
      })
    }
  }

  saveConversationScroll = (opts = {}) => {
    if (opts.scrollToBottom || this.conversationContainer) {
      this.props.actions.conversationScrollChanged(
        opts.scrollToBottom ? SCROLL_TO_BOTTOM_INDICATOR : this.conversationContainer.scrollTop
      )
    }
  }

  render = () => {
    return (
      <AnswerBotContainer
        restoreConversationScroll={this.restoreConversationScroll}
        saveConversationScroll={this.saveConversationScroll}
      >
        {this.props.currentScreen === ARTICLE_SCREEN
          ? this.articleScreen()
          : this.conversationScreen()}
      </AnswerBotContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentScreen: getCurrentScreen(state),
    lastConversationScroll: getLastScroll(state),
    title: getSettingsAnswerBotTitle(state),
    isMobile: isMobileBrowser(),
    hideZendeskLogo: getHideZendeskLogo(state),
  }
}

const actionCreators = (dispatch) => ({
  actions: bindActionCreators(
    {
      updateBackButtonVisibility,
      conversationScrollChanged,
    },
    dispatch
  ),
})

const connectedComponent = connect(mapStateToProps, actionCreators, null, { forwardRef: true })(
  AnswerBot
)

export { connectedComponent as default, AnswerBot as Component }
