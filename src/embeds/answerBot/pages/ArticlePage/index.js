import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import FeedbackPopup from 'src/embeds/answerBot/components/FeedbackPopup'

import HelpCenterArticle from 'components/HelpCenterArticle'
import { FeedbackContainer } from './styles'

import { articleDismissed } from 'src/embeds/answerBot/actions/article'
import * as sessionActions from 'src/redux/modules/answerBot/sessions/actions/'
import {
  botMessage,
  botFeedbackMessage,
  botFeedbackRequested,
  botFallbackMessage
} from 'src/embeds/answerBot/actions/root/bot'
import * as rootActions from 'src/embeds/answerBot/actions/root'
import * as rootSelectors from 'src/redux/modules/answerBot/root/selectors'
import * as baseSelectors from 'src/redux/modules/base/base-selectors'
import { getFormTitleKey, getRestrictedImages } from 'embeds/helpCenter/selectors'
import { performImageSearch, addRestrictedImage } from 'src/embeds/helpCenter/actions'
import { getSettingsHelpCenterOriginalArticleButton } from 'src/redux/modules/settings/settings-selectors'

import { CONVERSATION_SCREEN } from 'src/constants/answerBot'

import { i18n } from 'service/i18n'
import { appendParams } from 'utility/utils'
import { originalArticleClicked } from 'src/embeds/answerBot/actions/article/article-viewed'
import { Widget, Header, Main, Footer } from 'components/Widget'

class ArticlePage extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
    isMobile: PropTypes.bool,
    articleTitleKey: PropTypes.string,
    article: PropTypes.object.isRequired,
    isFeedbackRequired: PropTypes.bool.isRequired,
    originalArticleButton: PropTypes.bool.isRequired,
    saveConversationScroll: PropTypes.func,
    authToken: PropTypes.string,
    storedImages: PropTypes.objectOf(PropTypes.string).isRequired,
    actions: PropTypes.shape({
      screenChanged: PropTypes.func.isRequired,
      articleDismissed: PropTypes.func.isRequired,
      sessionResolved: PropTypes.func.isRequired,
      sessionFallback: PropTypes.func.isRequired,
      botMessage: PropTypes.func.isRequired,
      botFeedbackMessage: PropTypes.func.isRequired,
      botFeedbackRequested: PropTypes.func.isRequired,
      botFallbackMessage: PropTypes.func.isRequired,
      originalArticleClicked: PropTypes.func.isRequired,
      addRestrictedImage: PropTypes.func.isRequired,
      performImageSearch: PropTypes.func.isRequired
    })
  }

  static defaultProps = {
    articleTitleKey: 'help',
    authToken: '',
    isMobile: false,
    scrollContainerClasses: '',
    saveConversationScroll: () => {}
  }

  constructor(props) {
    super(props)

    this.state = {
      showPopup: false,
      popupDisplayed: false,
      initialOptions: true,
      showFooter: true
    }
    this.showPopupTimer = null
  }

  componentDidMount = () => {
    this.showPopupTimer = setTimeout(() => {
      if (this.props.isFeedbackRequired && !this.state.showPopup) {
        this.setState({ showPopup: true, showFooter: false })
      }
    }, 1000)
  }

  componentWillUnmount() {
    this.showPopupTimer = clearTimeout(this.showPopupTimer)
  }

  onYesFeedback = () => {
    const { actions, saveConversationScroll } = this.props

    actions.sessionResolved()

    // Clear previous feedback
    actions.botFeedbackRequested()

    actions.botMessage('embeddable_framework.answerBot.msg.yes_acknowledgement')
    actions.botMessage('embeddable_framework.answerBot.msg.prompt_again_after_yes')

    this.setState({ showPopup: false, popupDisplayed: false })

    // Scroll to bottom when user switches back to conversation screen
    saveConversationScroll({ scrollToBottom: true })
  }

  onNoFeedback = reasonID => {
    const { actions, saveConversationScroll } = this.props

    actions.articleDismissed(reasonID)
    actions.sessionFallback()

    // Clear previous feedback
    actions.botFeedbackRequested()

    actions.botFeedbackMessage('embeddable_framework.answerBot.msg.no_acknowledgement')
    actions.botFallbackMessage(true)

    // Scroll to bottom when user switches back to conversation screen
    saveConversationScroll({ scrollToBottom: true })
    actions.screenChanged(CONVERSATION_SCREEN)
  }

  handlePopupAppeared = () => {
    this.setState({ popupDisplayed: true })
  }

  handleNoClick = () => {
    this.setState({ initialOptions: false })
  }

  feedbackPopup = () => {
    return (
      <FeedbackContainer
        trigger={this.state.showPopup}
        startPosHeight={'-100px'}
        endPosHeight={'0px'}
        duration={400}
        onEntered={this.handlePopupAppeared}
        onExited={() => this.setState({ showFooter: true })}
      >
        <FeedbackPopup
          onYesClick={this.onYesFeedback}
          onNoClick={this.handleNoClick}
          onReasonClick={this.onNoFeedback}
        />
      </FeedbackContainer>
    )
  }

  render = () => {
    const url = this.props.authToken
      ? appendParams(this.props.article.html_url, `auth_token=${this.props.authToken}`)
      : this.props.article.html_url

    return (
      <Widget>
        <Header
          title={i18n.t(`embeddable_framework.helpCenter.form.title.${this.props.articleTitleKey}`)}
        />
        <Main>
          <HelpCenterArticle
            activeArticle={{ ...this.props.article, html_url: url }}
            isMobile={this.props.isMobile}
            originalArticleButton={this.props.originalArticleButton}
            imagesSender={(...args) => {
              this.props.actions.performImageSearch(...args)
            }}
            updateStoredImages={(...args) => {
              this.props.actions.addRestrictedImage(...args)
            }}
            storedImages={this.props.storedImages}
            handleOriginalArticleClick={() => {
              this.props.actions.originalArticleClicked(this.props.article.id)
            }}
          />
        </Main>
        {this.state.showFooter && <Footer />}
        {this.feedbackPopup()}
      </Widget>
    )
  }
}

const mapStateToProps = state => ({
  article: rootSelectors.getCurrentArticle(state),
  isFeedbackRequired: rootSelectors.isFeedbackRequired(state),
  locale: baseSelectors.getLocale(state),
  authToken: rootSelectors.getAuthToken(state),
  articleTitleKey: getFormTitleKey(state),
  storedImages: getRestrictedImages(state),
  originalArticleButton: getSettingsHelpCenterOriginalArticleButton(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      screenChanged: rootActions.screenChanged,
      articleDismissed,
      sessionResolved: sessionActions.sessionResolved,
      sessionFallback: sessionActions.sessionFallback,
      botMessage,
      botFeedbackMessage,
      botFeedbackRequested,
      botFallbackMessage,
      originalArticleClicked,
      performImageSearch,
      addRestrictedImage
    },
    dispatch
  )
})

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(ArticlePage)

export { connectedComponent as default, ArticlePage as Component }
