import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { HelpCenterArticle } from 'component/helpCenter/HelpCenterArticle';
import { HelpCenterDesktop } from 'component/helpCenter/HelpCenterDesktop';
import { HelpCenterMobile } from 'component/helpCenter/HelpCenterMobile';
import { HelpCenterResults } from 'component/helpCenter/HelpCenterResults';
import { i18n } from 'service/i18n';
import { handleArticleClick,
  performSearch,
  performImageSearch,
  handleOriginalArticleClicked,
  addRestrictedImage,
  updateChannelChoiceShown,
  handleSearchFieldChange,
  handleSearchFieldFocus } from 'src/redux/modules/helpCenter';
import { getActiveArticle,
  getResultsLocale,
  getSearchLoading,
  getSearchFailed,
  getPreviousSearchTerm,
  getHasSearched,
  getHasContextuallySearched,
  getArticles,
  getArticleViewActive,
  getRestrictedImages,
  getChannelChoiceShown,
  getSearchFieldValue,
  getIsContextualSearchPending,
  getIsContextualSearchComplete } from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { isCallbackEnabled } from 'src/redux/modules/talk/talk-selectors';
import { getNotificationCount,
  getIsChatting } from 'src/redux/modules/chat/chat-selectors';
import { getIsOnInitialDesktopSearchScreen, getMaxWidgetHeight } from 'src/redux/modules/selectors';
import { MAXIMUM_SEARCH_RESULTS } from 'src/constants/helpCenter';

const mapStateToProps = (state) => {
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
    channelChoiceShown: getChannelChoiceShown(state),
    searchFieldValue: getSearchFieldValue(state),
    chatNotificationCount: getNotificationCount(state),
    isChatting: getIsChatting(state),
    maxWidgetHeight: getMaxWidgetHeight(state, 'webWidget'),
    isOnInitialDesktopSearchScreen: getIsOnInitialDesktopSearchScreen(state)
  };
};

class HelpCenter extends Component {
  static propTypes = {
    activeArticle: PropTypes.object,
    buttonLabelKey: PropTypes.string,
    callbackEnabled: PropTypes.bool.isRequired,
    channelChoice: PropTypes.bool,
    channelChoiceShown: PropTypes.bool.isRequired,
    chatEnabled: PropTypes.bool.isRequired,
    formTitleKey: PropTypes.string,
    fullscreen: PropTypes.bool.isRequired,
    previousSearchTerm: PropTypes.string.isRequired,
    hasContextualSearched: PropTypes.bool.isRequired,
    hideZendeskLogo: PropTypes.bool,
    localeFallbacks: PropTypes.array,
    onNextClick: PropTypes.func,
    originalArticleButton: PropTypes.bool,
    performSearch: PropTypes.func.isRequired,
    performImageSearch: PropTypes.func.isRequired,
    showBackButton: PropTypes.func,
    showNextButton: PropTypes.bool,
    searchLoading: PropTypes.bool.isRequired,
    searchFailed: PropTypes.bool.isRequired,
    submitTicketAvailable: PropTypes.bool,
    chatAvailable: PropTypes.bool,
    chatOfflineAvailable: PropTypes.bool,
    talkAvailable: PropTypes.bool.isRequired,
    talkEnabled: PropTypes.bool.isRequired,
    updateChatScreen: PropTypes.func,
    handleArticleClick: PropTypes.func.isRequired,
    resultsLocale: PropTypes.string.isRequired,
    articles: PropTypes.array.isRequired,
    hasSearched: PropTypes.bool.isRequired,
    handleOriginalArticleClicked: PropTypes.func.isRequired,
    articleViewActive: PropTypes.bool.isRequired,
    restrictedImages: PropTypes.object.isRequired,
    addRestrictedImage: PropTypes.func,
    updateChannelChoiceShown: PropTypes.func.isRequired,
    searchFieldValue: PropTypes.string.isRequired,
    handleSearchFieldChange: PropTypes.func.isRequired,
    handleSearchFieldFocus: PropTypes.func.isRequired,
    chatNotificationCount: PropTypes.number,
    isChatting: PropTypes.bool,
    isContextualSearchPending: PropTypes.bool.isRequired,
    contextualHelpEnabled: PropTypes.bool.isRequired,
    isContextualSearchComplete: PropTypes.bool.isRequired,
    maxWidgetHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    isOnInitialDesktopSearchScreen: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired
  };

  static defaultProps = {
    buttonLabelKey: 'message',
    callbackEnabled: false,
    channelChoice: false,
    formTitleKey: 'help',
    hideZendeskLogo: false,
    localeFallbacks: [],
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
    updateChannelChoiceShown: () => {},
    handleSearchFieldChange: () => {},
    chatNotificationCount: 0,
    isChatting: false,
    isOnInitialDesktopSearchScreen: true
  };

  constructor(props) {
    super(props);

    this.state = {
      images: []
    };

    this.helpCenterMobile = null;
    this.helpCenterDesktop = null;
  }

  componentDidUpdate() {
    if (this.props.articles.length > 0) {
      if (this.helpCenterMobile) {
        this.helpCenterMobile.setIntroScreen();
      }
    }
  }

  pauseAllVideos = () => {
    const componentNode = ReactDOM.findDOMNode(this);
    const videoList = componentNode.getElementsByTagName('video');

    _.forEach(videoList, (videoElem) => {
      videoElem.pause();
    });
  }

  getHelpCenterComponent = () => {
    return (this.props.isMobile)
      ? this.helpCenterMobile
      : this.helpCenterDesktop;
  }

  interactiveSearchSuccessFn = () => {
    this.props.showBackButton(false);
    this.focusField();
  }

  focusField = () => {
    if (this.helpCenterDesktop) {
      this.helpCenterDesktop.focusField();
    }
  }

  search = () => {
    const searchField = this.getHelpCenterComponent().getSearchField();
    const searchTerm = searchField.getValue();

    if (_.isEmpty(searchTerm)) {
      return;
    }

    /* eslint camelcase:0 */
    const query = {
      locale: i18n.getLocale(),
      query: searchTerm,
      per_page: MAXIMUM_SEARCH_RESULTS,
      origin: 'web_widget'
    };

    this.performSearchWithLocaleFallback(query, this.interactiveSearchSuccessFn);

    if (this.props.isMobile) {
      setTimeout(() => {
        searchField.blur();
      }, 1);
    }
  }

  performSearchWithLocaleFallback = (query, successFn) => {
    // When localeFallbacks is defined in the zESettings object then
    // attempt the search with each locale in that array in order. Otherwise
    // try the search with no locale (injects an empty string into localeFallbacks).
    const localeFallbacks = !_.isEmpty(this.props.localeFallbacks)
      ? this.props.localeFallbacks.slice()
      : [''];
    const failFn = () => {
      this.focusField();
    };
    const doneFn = (res) => {
      if (res.ok) {
        if (res.body.count > 0 || _.isEmpty(localeFallbacks)) {
          successFn();
        } else {
          query.locale = localeFallbacks.shift();
          this.props.performSearch(_.pickBy(query), doneFn, failFn);
        }
      } else {
        this.focusField();
      }
    };

    this.props.performSearch(query, doneFn, failFn);
  }

  handleNextClick = (e) => {
    e.preventDefault();

    this.props.onNextClick();
  }

  resetState = () => {
    this.helpCenterMobile.resetState();
  }

  handleArticleClick = (articleIndex, e) => {
    e.preventDefault();
    this.props.handleArticleClick(this.props.articles[articleIndex]);
    this.props.showBackButton();
  }

  onContainerClick = () => {
    if (this.props.channelChoiceShown) {
      this.props.updateChannelChoiceShown(false);
    }
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
      articles
    } = this.props;

    if (articleViewActive || !hasSearched) return null;

    const applyPadding = !showNextButton && !hideZendeskLogo;

    return (
      <HelpCenterResults
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
        isMobile={this.props.isMobile} />
    );
  }

  renderArticles = () => {
    if (!this.props.articleViewActive) return null;

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
        isMobile={this.props.isMobile} />
    );
  }

  renderHelpCenterDesktop = (buttonLabel) => {
    return (
      <HelpCenterDesktop
        ref={(el) => { this.helpCenterDesktop = el; }}
        isOnInitialDesktopSearchScreen={this.props.isOnInitialDesktopSearchScreen}
        chatOfflineAvailable={this.props.chatOfflineAvailable}
        hasContextualSearched={this.props.hasContextualSearched}
        isContextualSearchPending={this.props.isContextualSearchPending}
        chatAvailable={this.props.chatAvailable}
        submitTicketAvailable={this.props.submitTicketAvailable}
        chatEnabled={this.props.chatEnabled}
        handleOnChangeValue={this.props.handleSearchFieldChange}
        handleNextClick={this.handleNextClick}
        search={this.search}
        showNextButton={this.props.showNextButton}
        hideZendeskLogo={this.props.hideZendeskLogo}
        isLoading={this.props.searchLoading}
        onNextClick={this.props.onNextClick}
        channelChoice={this.props.channelChoice}
        channelChoiceShown={this.props.channelChoiceShown}
        callbackEnabled={this.props.callbackEnabled}
        talkEnabled={this.props.talkEnabled}
        talkAvailable={this.props.talkAvailable}
        articleViewActive={this.props.articleViewActive}
        hasSearched={this.props.hasSearched}
        buttonLabel={buttonLabel}
        formTitleKey={this.props.formTitleKey}
        searchFieldValue={this.props.searchFieldValue}
        updateChatScreen={this.props.updateChatScreen}
        maxWidgetHeight={this.props.maxWidgetHeight}>
        {this.renderResults()}
        {this.renderArticles()}
      </HelpCenterDesktop>
    );
  }

  renderHelpCenterMobile = (buttonLabel) => {
    return (
      <HelpCenterMobile
        ref={(el) => { this.helpCenterMobile = el; }}
        chatOfflineAvailable={this.props.chatOfflineAvailable}
        handleOnChangeValue={this.props.handleSearchFieldChange}
        onSearchFieldFocus={this.props.handleSearchFieldFocus}
        submitTicketAvailable={this.props.submitTicketAvailable}
        chatEnabled={this.props.chatEnabled}
        handleNextClick={this.handleNextClick}
        search={this.search}
        isLoading={this.props.searchLoading}
        onNextClick={this.props.onNextClick}
        showNextButton={this.props.showNextButton}
        chatAvailable={this.props.chatAvailable}
        hasContextualSearched={this.props.hasContextualSearched}
        isContextualSearchPending={this.props.isContextualSearchPending}
        channelChoice={this.props.channelChoiceShown}
        callbackEnabled={this.props.callbackEnabled}
        talkEnabled={this.props.talkEnabled}
        talkAvailable={this.props.talkAvailable}
        articleViewActive={this.props.articleViewActive}
        hasSearched={this.props.hasSearched}
        searchFieldValue={this.props.searchFieldValue}
        hideZendeskLogo={this.props.hideZendeskLogo}
        buttonLabel={buttonLabel}
        formTitleKey={this.props.formTitleKey}
        setChannelChoiceShown={this.props.updateChannelChoiceShown}
        contextualHelpEnabled={this.props.contextualHelpEnabled}>
        {this.renderResults()}
        {this.renderArticles()}
      </HelpCenterMobile>
    );
  }

  render = () => {
    let buttonLabel;
    const { chatNotificationCount,
      channelChoice,
      chatAvailable,
      chatOfflineAvailable,
      isChatting,
      talkAvailable,
      callbackEnabled } = this.props;

    const renderChatLabel = () => {
      if (chatNotificationCount > 0) {
        return chatNotificationCount > 1
          ? i18n.t('embeddable_framework.common.notification.manyMessages', { plural_number: chatNotificationCount })
          : i18n.t('embeddable_framework.common.notification.oneMessage');
      } else if (chatOfflineAvailable) {
        return i18n.t(`embeddable_framework.helpCenter.submitButton.label.submitTicket.${this.props.buttonLabelKey}`);
      }
      return i18n.t('embeddable_framework.common.button.chat');
    };

    if (isChatting) {
      buttonLabel = renderChatLabel();
    } else if (channelChoice) {
      buttonLabel = i18n.t('embeddable_framework.helpCenter.submitButton.label.submitTicket.contact');
    } else if (chatAvailable || chatOfflineAvailable) {
      buttonLabel = renderChatLabel();
    } else if (talkAvailable) {
      buttonLabel = callbackEnabled
        ? i18n.t('embeddable_framework.helpCenter.submitButton.label.callback')
        : i18n.t('embeddable_framework.helpCenter.submitButton.label.phone');
    } else {
      buttonLabel = i18n.t(`embeddable_framework.helpCenter.submitButton.label.submitTicket.${this.props.buttonLabelKey}`); // eslint-disable-line
    }

    const helpCenter = (this.props.isMobile)
      ? this.renderHelpCenterMobile(buttonLabel)
      : this.renderHelpCenterDesktop(buttonLabel);

    return (
      <div>
        {helpCenter}
      </div>
    );
  }
}

const actionCreators = {
  handleSearchFieldChange,
  handleSearchFieldFocus,
  updateChannelChoiceShown,
  handleArticleClick,
  performSearch,
  performImageSearch,
  handleOriginalArticleClicked,
  addRestrictedImage
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(HelpCenter);
