import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import DesktopPage from 'embeds/helpCenter/pages/DesktopPage'
import MobilePage from 'embeds/helpCenter/pages/MobilePage'
import { performSearch, handleSearchFieldChange } from 'embeds/helpCenter/actions'
import {
  getResultsLocale,
  getSearchLoading,
  getSearchFailed,
  getPreviousSearchTerm,
  getHasSearched,
  getHasContextuallySearched,
  getArticleViewActive,
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
import ArticlePage from 'src/embeds/helpCenter/pages/ArticlePage'
import SearchPage from 'src/embeds/helpCenter/pages/SearchPage'

const mapStateToProps = state => {
  return {
    resultsLocale: getResultsLocale(state),
    searchLoading: getSearchLoading(state),
    searchFailed: getSearchFailed(state),
    previousSearchTerm: getPreviousSearchTerm(state),
    hasSearched: getHasSearched(state),
    hasContextualSearched: getHasContextuallySearched(state),
    isContextualSearchPending: getIsContextualSearchPending(state),
    isContextualSearchComplete: getIsContextualSearchComplete(state),
    callbackEnabled: isCallbackEnabled(state),
    articleViewActive: getArticleViewActive(state),
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
    channelChoice: PropTypes.bool,
    hasContextualSearched: PropTypes.bool.isRequired,
    hideZendeskLogo: PropTypes.bool,
    onNextClick: PropTypes.func,
    performSearch: PropTypes.func.isRequired,
    showBackButton: PropTypes.func,
    showNextButton: PropTypes.bool,
    searchLoading: PropTypes.bool.isRequired,
    updateChatScreen: PropTypes.func,
    hasSearched: PropTypes.bool.isRequired,
    articleViewActive: PropTypes.bool.isRequired,
    searchFieldValue: PropTypes.string.isRequired,
    handleSearchFieldChange: PropTypes.func.isRequired,
    isContextualSearchPending: PropTypes.bool.isRequired,
    contextualHelpRequestNeeded: PropTypes.bool.isRequired,
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
    showBackButton: () => {},
    showNextButton: true,
    submitTicketAvailable: true,
    chatAvailable: false,
    chatOfflineAvailable: false,
    updateChatScreen: () => {},
    articleViewActive: false,
    hasSearched: false,
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
    if (this.props.hasSearched) {
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

  search = (searchValue = '') => {
    const searchField = this.getHelpCenterComponent().getSearchField()
    const searchTerm = searchValue || searchField.getValue()
    if (_.isEmpty(searchTerm)) {
      return
    }

    const success = () => {
      this.props.showBackButton(false)
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
      />
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
        onNextClick={this.props.onNextClick}
        contextualHelpRequestNeeded={this.props.contextualHelpRequestNeeded}
        searchPlaceholder={this.props.searchPlaceholder}
      />
    )
  }

  render = () => {
    const { articleViewActive, hasSearched, contextualHelpRequestNeeded } = this.props

    if (articleViewActive) {
      return <ArticlePage onClick={this.handleNextClick} />
    } else if (hasSearched || contextualHelpRequestNeeded) {
      return <SearchPage onClick={this.handleNextClick} />
    }

    const helpCenter = this.props.isMobile
      ? this.renderHelpCenterMobile()
      : this.renderHelpCenterDesktop()

    return <div>{helpCenter}</div>
  }
}

const actionCreators = {
  handleSearchFieldChange,
  performSearch
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(HelpCenter)

export { connectedComponent as default, HelpCenter as Component }
