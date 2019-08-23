import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ZendeskLogo } from 'component/ZendeskLogo'

import AnswerBotContainer from './AnswerBotContainer'

import ArticleScreen from './articleScreen/'
import ConversationFooter from './conversationScreen/footer/'
import ConversationScreen from './conversationScreen/'

import { ScrollContainer } from 'component/container/ScrollContainer'
import { i18n } from 'service/i18n'
import { onNextTick } from 'src/util/utils'

import { updateBackButtonVisibility } from 'src/redux/modules/base'
import { getLastScroll } from 'src/redux/modules/answerBot/conversation/selectors'
import { getCurrentScreen } from 'src/redux/modules/answerBot/root/selectors'
import { conversationScrollChanged } from 'src/redux/modules/answerBot/conversation/actions'
import { getSettingsAnswerBotTitle } from 'src/redux/modules/selectors'
import { ARTICLE_SCREEN, CONVERSATION_SCREEN } from 'src/constants/answerBot'

import classNames from 'classnames'
import { locals as styles } from './AnswerBot.scss'

const SCROLL_TO_BOTTOM_INDICATOR = -1

class AnswerBot extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    currentScreen: PropTypes.string.isRequired,
    lastConversationScroll: PropTypes.number.isRequired,
    hideZendeskLogo: PropTypes.bool,
    actions: PropTypes.shape({
      updateBackButtonVisibility: PropTypes.func.isRequired,
      conversationScrollChanged: PropTypes.func.isRequired
    }),
    title: PropTypes.string.isRequired
  }

  static defaultProps = {
    isMobile: false,
    hideZendeskLogo: false
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

  componentDidUpdate() {
    if (this.props.currentScreen === ARTICLE_SCREEN) {
      this.props.actions.updateBackButtonVisibility(true)
    }
  }

  componentWillUnmount() {
    // Save conversation scroll position before switching to another embed
    if (this.props.currentScreen === CONVERSATION_SCREEN) {
      this.saveConversationScroll()
    }
  }

  containerStyle() {
    return this.props.isMobile ? styles.scrollContainerMobile : styles.scrollContainer
  }

  articleScreen = () => {
    return (
      <ArticleScreen
        isMobile={this.props.isMobile}
        scrollContainerClasses={this.containerStyle()}
        saveConversationScroll={this.saveConversationScroll}
      />
    )
  }

  renderZendeskLogo = () => {
    const logoClasses = classNames({
      [styles.zendeskLogoChatMobile]: this.props.isMobile
    })

    return !this.props.hideZendeskLogo ? (
      <ZendeskLogo
        className={`${styles.zendeskLogo} ${logoClasses}`}
        rtl={i18n.isRTL()}
        fullscreen={false}
      />
    ) : null
  }

  conversationScreen = () => {
    const { isMobile, hideZendeskLogo } = this.props
    const footerClasses = classNames({
      [styles.footer]: !isMobile && hideZendeskLogo,
      [styles.footerWithLogo]: !isMobile && !hideZendeskLogo,
      [styles.footerMobile]: isMobile,
      [styles.footerMobileWithLogo]: isMobile && !hideZendeskLogo
    })

    return (
      <div>
        <ScrollContainer
          ref={el => {
            this.conversationContainer = el
          }}
          containerClasses={this.containerStyle()}
          title={this.props.title}
          isMobile={this.props.isMobile}
          footerContent={this.renderFooterContent()}
          footerClasses={footerClasses}
        >
          <ConversationScreen scrollToBottom={this.scrollToBottom} />
        </ScrollContainer>
        {this.renderZendeskLogo()}
      </div>
    )
  }

  renderFooterContent = () => {
    return (
      <ConversationFooter
        hideZendeskLogo={this.props.hideZendeskLogo}
        scrollToBottom={this.scrollToBottom}
        isMobile={this.props.isMobile}
      />
    )
  }

  scrollToBottom = () => {
    onNextTick(() => {
      if (this.conversationContainer) {
        this.conversationContainer.scrollToBottom()
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
          this.conversationContainer.scrollTo(scrollTop)
        }
      })
    }
  }

  saveConversationScroll = (opts = {}) => {
    if (opts.scrollToBottom || this.conversationContainer) {
      this.props.actions.conversationScrollChanged(
        opts.scrollToBottom
          ? SCROLL_TO_BOTTOM_INDICATOR
          : this.conversationContainer.content.scrollTop
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

const mapStateToProps = state => {
  return {
    currentScreen: getCurrentScreen(state),
    lastConversationScroll: getLastScroll(state),
    title: getSettingsAnswerBotTitle(state)
  }
}

const actionCreators = dispatch => ({
  actions: bindActionCreators(
    {
      updateBackButtonVisibility,
      conversationScrollChanged
    },
    dispatch
  )
})

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(AnswerBot)

export { connectedComponent as default, AnswerBot as Component }
