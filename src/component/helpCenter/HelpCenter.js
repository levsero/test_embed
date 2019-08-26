import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import HelpCenterArticle from 'components/HelpCenterArticle'
import DesktopPage from 'embeds/helpCenter/pages/DesktopPage'
import MobilePage from 'embeds/helpCenter/pages/MobilePage'
import Results from 'embeds/helpCenter/components/Results'
import {
  handleArticleClick,
  performSearch,
  performImageSearch,
  handleOriginalArticleClicked,
  addRestrictedImage,
  handleSearchFieldChange
} from 'embeds/helpCenter/actions'
import {
  getActiveArticle,
  getResultsLocale,
  getSearchLoading,
  getSearchFailed,
  getPreviousSearchTerm,
  getHasSearched,
  getHasContextuallySearched,
  getArticles,
  getArticleViewActive,
  getRestrictedImages,
  getSearchFieldValue,
  getIsContextualSearchPending,
  getIsContextualSearchComplete,
  getContextualHelpRequestNeeded
} from 'embeds/helpCenter/selectors'
import { isCallbackEnabled } from 'src/redux/modules/talk/talk-selectors'
import { getNotificationCount, getIsChatting } from 'src/redux/modules/chat/chat-selectors'
import {
  getIsOnInitialDesktopSearchScreen,
  getMaxWidgetHeight,
  getSettingsHelpCenterSearchPlaceholder,
  getSettingsHelpCenterTitle,
  getContactOptionsButton,
  getChatConnectionConnecting,
  getHelpCenterButtonLabel
} from 'src/redux/modules/selectors'

const mapStateToProps = state => {
  return {
    resultsLocale: getResultsLocale(state),
    activeArticle: getActiveArticle(state),
    searchLoading: getSearchLoading(state),
    searchFailed: getSearchFailed(state),
    previousSearchTerm: getPreviousSearchTerm(state),
    hasSearched: getHasSearched(state),
    hasContextualSearched: getHasContextuallySearched(state),
    isContextualSearchPending: getIsContextualSearchPending(state),
    isContextualSearchComplete: getIsContextualSearchComplete(state),
    callbackEnabled: isCallbackEnabled(state),
    articleViewActive: getArticleViewActive(state),
    articles: getArticles(state),
    restrictedImages: getRestrictedImages(state),
    searchFieldValue: getSearchFieldValue(state),
    chatNotificationCount: getNotificationCount(state),
    isChatting: getIsChatting(state),
    maxWidgetHeight: getMaxWidgetHeight(state, 'webWidget'),
    isOnInitialDesktopSearchScreen: getIsOnInitialDesktopSearchScreen(state),
    searchPlaceholder: getSettingsHelpCenterSearchPlaceholder(state),
    title: getSettingsHelpCenterTitle(state),
    contactButtonLabel: getContactOptionsButton(state),
    chatConnecting: getChatConnectionConnecting(state),
    contextualHelpRequestNeeded: getContextualHelpRequestNeeded(state),
    buttonLabel: getHelpCenterButtonLabel(state)
  }
}

class HelpCenter extends Component {
  static propTypes = {
    activeArticle: PropTypes.object,
    channelChoice: PropTypes.bool,
    fullscreen: PropTypes.bool.isRequired,
    previousSearchTerm: PropTypes.string.isRequired,
    hasContextualSearched: PropTypes.bool.isRequired,
    hideZendeskLogo: PropTypes.bool,
    onNextClick: PropTypes.func,
    originalArticleButton: PropTypes.bool,
    performSearch: PropTypes.func.isRequired,
    performImageSearch: PropTypes.func.isRequired,
    showBackButton: PropTypes.func,
    showNextButton: PropTypes.bool,
    searchLoading: PropTypes.bool.isRequired,
    searchFailed: PropTypes.bool.isRequired,
    updateChatScreen: PropTypes.func,
    handleArticleClick: PropTypes.func.isRequired,
    resultsLocale: PropTypes.string.isRequired,
    articles: PropTypes.array.isRequired,
    hasSearched: PropTypes.bool.isRequired,
    handleOriginalArticleClicked: PropTypes.func.isRequired,
    articleViewActive: PropTypes.bool.isRequired,
    restrictedImages: PropTypes.object.isRequired,
    addRestrictedImage: PropTypes.func,
    searchFieldValue: PropTypes.string.isRequired,
    handleSearchFieldChange: PropTypes.func.isRequired,
    isContextualSearchPending: PropTypes.bool.isRequired,
    contextualHelpRequestNeeded: PropTypes.bool.isRequired,
    isContextualSearchComplete: PropTypes.bool.isRequired,
    maxWidgetHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    isOnInitialDesktopSearchScreen: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
    searchPlaceholder: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    chatConnecting: PropTypes.bool.isRequired,
    buttonLabel: PropTypes.string
  }

  static defaultProps = {
    callbackEnabled: false,
    channelChoice: false,
    hideZendeskLogo: false,
    onNextClick: () => {},
    originalArticleButton: true,
    showBackButton: () => {},
    showNextButton: true,
    submitTicketAvailable: true,
    chatAvailable: false,
    chatOfflineAvailable: false,
    updateChatScreen: () => {},
    handleArticleClick: () => {},
    articles: [],
    articleViewActive: false,
    handleOriginalArticleClicked: () => {},
    hasSearched: false,
    activeArticle: null,
    restrictedImages: {},
    addRestrictedImage: () => {},
    handleSearchFieldChange: () => {},
    chatNotificationCount: 0,
    isChatting: false,
    isOnInitialDesktopSearchScreen: true,
    chatConnecting: false
  }

  constructor(props) {
    super(props)

    this.state = {
      images: []
    }

    this.helpCenterMobile = null
    this.helpCenterDesktop = null
    this.helpCenterResults = null
  }

  componentDidUpdate() {
    if (this.props.articles.length > 0) {
      if (this.helpCenterMobile) {
        this.helpCenterMobile.setIntroScreen()
      }
    }
  }

  pauseAllVideos = () => {
    const componentNode = ReactDOM.findDOMNode(this)
    const videoList = componentNode.getElementsByTagName('video')

    _.forEach(videoList, videoElem => {
      videoElem.pause()
    })
  }

  getHelpCenterComponent = () => {
    return this.props.isMobile ? this.helpCenterMobile : this.helpCenterDesktop
  }

  focusField = () => {
    if (this.helpCenterDesktop) {
      this.helpCenterDesktop.focusField()
    } else if (this.helpCenterMobile) {
      this.helpCenterMobile.focusField()
    }
  }

  focusOnFirstResult() {
    if (this.helpCenterDesktop && this.helpCenterResults) {
      this.helpCenterResults.focusField()
    }
  }

  search = (searchValue = '') => {
    const searchField = this.getHelpCenterComponent().getSearchField()
    const searchTerm = searchValue || searchField.getValue()
    if (_.isEmpty(searchTerm)) {
      return
    }

    const success = () => {
      this.props.showBackButton(false)
      this.focusOnFirstResult()
    }
    const fail = () => {
      this.focusField()
    }
    this.props.performSearch(searchTerm, success, fail)

    if (this.props.isMobile) {
      setTimeout(() => {
        searchField.blur()
      }, 1)
    }
  }

  handleNextClick = e => {
    e.preventDefault()

    this.props.onNextClick()
  }

  handleArticleClick = (articleIndex, e) => {
    e.preventDefault()
    this.props.handleArticleClick(this.props.articles[articleIndex])
    this.props.showBackButton()
  }

  renderResults = () => {
    const {
      showNextButton,
      fullscreen,
      hideZendeskLogo,
      searchFailed,
      resultsLocale,
      previousSearchTerm,
      hasContextualSearched,
      isContextualSearchComplete,
      articleViewActive,
      hasSearched,
      contextualHelpRequestNeeded,
      articles
    } = this.props

    if (articleViewActive || (!hasSearched && !contextualHelpRequestNeeded)) return null

    const applyPadding = !showNextButton && !hideZendeskLogo

    return (
      <Results
        ref={ref => {
          this.helpCenterResults = ref
        }}
        fullscreen={fullscreen}
        articles={articles}
        applyPadding={applyPadding}
        searchFailed={searchFailed}
        locale={resultsLocale}
        previousSearchTerm={previousSearchTerm}
        handleArticleClick={this.handleArticleClick}
        hasContextualSearched={hasContextualSearched}
        isContextualSearchComplete={isContextualSearchComplete}
        showContactButton={showNextButton}
        hideZendeskLogo={hideZendeskLogo}
        isMobile={this.props.isMobile}
        contextualHelpRequestNeeded={contextualHelpRequestNeeded}
        hasSearched={hasSearched}
      />
    )
  }

  renderArticles = () => {
    if (!this.props.articleViewActive) return null

    return (
      <HelpCenterArticle
        activeArticle={this.props.activeArticle}
        locale={this.props.resultsLocale}
        originalArticleButton={this.props.originalArticleButton}
        handleOriginalArticleClick={this.props.handleOriginalArticleClicked}
        storedImages={this.props.restrictedImages}
        imagesSender={this.props.performImageSearch}
        updateStoredImages={this.props.addRestrictedImage}
        fullscreen={this.props.fullscreen}
        isMobile={this.props.isMobile}
      />
    )
  }

  renderHelpCenterDesktop = () => {
    return (
      <DesktopPage
        ref={el => {
          this.helpCenterDesktop = el
        }}
        isOnInitialDesktopSearchScreen={this.props.isOnInitialDesktopSearchScreen}
        hasContextualSearched={this.props.hasContextualSearched}
        isContextualSearchPending={this.props.isContextualSearchPending}
        handleOnChangeValue={this.props.handleSearchFieldChange}
        handleNextClick={this.handleNextClick}
        search={this.search}
        showNextButton={this.props.showNextButton}
        hideZendeskLogo={this.props.hideZendeskLogo}
        isLoading={this.props.searchLoading}
        onNextClick={this.props.onNextClick}
        channelChoice={this.props.channelChoice}
        articleViewActive={this.props.articleViewActive}
        hasSearched={this.props.hasSearched}
        buttonLabel={this.props.buttonLabel}
        buttonLoading={this.props.chatConnecting}
        title={this.props.title}
        searchFieldValue={this.props.searchFieldValue}
        updateChatScreen={this.props.updateChatScreen}
        maxWidgetHeight={this.props.maxWidgetHeight}
        searchPlaceholder={this.props.searchPlaceholder}
        contextualHelpRequestNeeded={this.props.contextualHelpRequestNeeded}
      >
        {this.renderResults()}
        {this.renderArticles()}
      </DesktopPage>
    )
  }

  renderHelpCenterMobile = () => {
    return (
      <MobilePage
        buttonLoading={this.props.chatConnecting}
        ref={el => {
          this.helpCenterMobile = el
        }}
        handleOnChangeValue={this.props.handleSearchFieldChange}
        handleNextClick={this.handleNextClick}
        search={this.search}
        isLoading={this.props.searchLoading}
        showNextButton={this.props.showNextButton}
        hasContextualSearched={this.props.hasContextualSearched}
        isContextualSearchPending={this.props.isContextualSearchPending}
        articleViewActive={this.props.articleViewActive}
        hasSearched={this.props.hasSearched}
        searchFieldValue={this.props.searchFieldValue}
        hideZendeskLogo={this.props.hideZendeskLogo}
        buttonLabel={this.props.buttonLabel}
        title={this.props.title}
        contextualHelpRequestNeeded={this.props.contextualHelpRequestNeeded}
        searchPlaceholder={this.props.searchPlaceholder}
      >
        {this.renderResults()}
        {this.renderArticles()}
      </MobilePage>
    )
  }

  render = () => {
    const helpCenter = this.props.isMobile
      ? this.renderHelpCenterMobile()
      : this.renderHelpCenterDesktop()

    return <div>{helpCenter}</div>
  }
}

const actionCreators = {
  handleSearchFieldChange,
  handleArticleClick,
  performSearch,
  performImageSearch,
  handleOriginalArticleClicked,
  addRestrictedImage
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(HelpCenter)

export { connectedComponent as default, HelpCenter as Component }
