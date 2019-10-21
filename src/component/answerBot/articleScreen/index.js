import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import FeedbackPopup from './feedbackPopup'

import HelpCenterArticle from 'components/HelpCenterArticle'
import { ScrollContainer } from 'component/container/ScrollContainer'
import { SlideAppear } from 'component/transition/SlideAppear'

import { articleDismissed } from 'src/redux/modules/answerBot/article/actions/'
import * as sessionActions from 'src/redux/modules/answerBot/sessions/actions/'
import {
  botMessage,
  botFeedbackMessage,
  botFeedbackRequested,
  botFallbackMessage
} from 'src/redux/modules/answerBot/root/actions/bot'
import * as rootActions from 'src/redux/modules/answerBot/root/actions/'
import * as rootSelectors from 'src/redux/modules/answerBot/root/selectors'
import * as baseSelectors from 'src/redux/modules/base/base-selectors'
import { getFormTitleKey, getRestrictedImages } from 'embeds/helpCenter/selectors'
import { performImageSearch, addRestrictedImage } from 'src/embeds/helpCenter/actions'

import { CONVERSATION_SCREEN } from 'src/constants/answerBot'

import { i18n } from 'service/i18n'
import { locals as styles } from './ArticleScreen.scss'
import { appendParams } from 'utility/utils'
import { originalArticleClicked } from 'src/redux/modules/answerBot/article/actions/article-viewed'

class ArticleScreen extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
    isMobile: PropTypes.bool,
    scrollContainerClasses: PropTypes.string,
    articleTitleKey: PropTypes.string,
    article: PropTypes.object.isRequired,
    isFeedbackRequired: PropTypes.bool.isRequired,
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
      initialOptions: true
    }
    this.showPopupTimer = null
  }

  componentDidMount = () => {
    this.showPopupTimer = setTimeout(() => {
      if (this.props.isFeedbackRequired && !this.state.showPopup) {
        this.setState({ showPopup: true })
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
      <SlideAppear
        className={styles.popupWrapper}
        trigger={this.state.showPopup}
        startPosHeight={'-100px'}
        endPosHeight={'0px'}
        duration={400}
        onEntered={this.handlePopupAppeared}
      >
        <FeedbackPopup
          onYesClick={this.onYesFeedback}
          onNoClick={this.handleNoClick}
          onReasonClick={this.onNoFeedback}
          locale={this.props.locale}
        />
      </SlideAppear>
    )
  }

  render = () => {
    let popupStyles = ''

    if (this.state.popupDisplayed) {
      popupStyles = this.state.initialOptions
        ? styles.optionsPopupSpacing
        : styles.reasonsPopupSpacing
    }

    const url = this.props.authToken
      ? appendParams(this.props.article.html_url, `auth_token=${this.props.authToken}`)
      : this.props.article.html_url

    return (
      <div className={styles.container}>
        <ScrollContainer
          containerClasses={`${this.props.scrollContainerClasses} ${styles.scrollContainer} ${popupStyles}`}
          title={i18n.t(`embeddable_framework.helpCenter.form.title.${this.props.articleTitleKey}`)}
          isMobile={this.props.isMobile}
          footerClasses={styles.footer}
        >
          <HelpCenterArticle
            activeArticle={{ ...this.props.article, html_url: url }}
            originalArticleButton={true}
            isMobile={this.props.isMobile}
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
        </ScrollContainer>
        {this.feedbackPopup()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  article: rootSelectors.getCurrentArticle(state),
  isFeedbackRequired: rootSelectors.isFeedbackRequired(state),
  locale: baseSelectors.getLocale(state),
  authToken: rootSelectors.getAuthToken(state),
  articleTitleKey: getFormTitleKey(state),
  storedImages: getRestrictedImages(state)
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
)(ArticleScreen)

export { connectedComponent as default, ArticleScreen as Component }
