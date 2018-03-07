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
import { updateSearchTerm,
         handleArticleClick,
         performSearch,
         performContextualSearch,
         performImageSearch,
         handleOriginalArticleClicked,
         addRestrictedImage,
         updateChannelChoiceShown,
         handleSearchFieldChange } from 'src/redux/modules/helpCenter';
import { getActiveArticle,
         getResultsCount,
         getSearchLoading,
         getSearchFailed,
         getSearchTerm,
         getPreviousSearchTerm,
         getHasSearched,
         getHasContextuallySearched,
         getArticles,
         getArticleViewActive,
         getRestrictedImages,
         getChannelChoiceShown,
         getSearchFieldValue } from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { isCallbackEnabled } from 'src/redux/modules/talk/talk-selectors';

const maximumSearchResults = 9;
const maximumContextualSearchResults = 3;

const mapStateToProps = (state) => {
  return {
    resultsCount: getResultsCount(state),
    activeArticle: getActiveArticle(state),
    searchLoading: getSearchLoading(state),
    searchFailed: getSearchFailed(state),
    searchTerm: getSearchTerm(state),
    previousSearchTerm: getPreviousSearchTerm(state),
    hasSearched: getHasSearched(state),
    hasContextualSearched: getHasContextuallySearched(state),
    callbackEnabled: isCallbackEnabled(state),
    articleViewActive: getArticleViewActive(state),
    articles: getArticles(state),
    restrictedImages: getRestrictedImages(state),
    channelChoiceShown: getChannelChoiceShown(state),
    searchFieldValue: getSearchFieldValue(state)
  };
};

class HelpCenter extends Component {
  static propTypes = {
    activeArticle: PropTypes.object,
    buttonLabelKey: PropTypes.string,
    callbackEnabled: PropTypes.bool.isRequired,
    channelChoice: PropTypes.bool,
    chatEnabled: PropTypes.bool.isRequired,
    formTitleKey: PropTypes.string,
    fullscreen: PropTypes.bool.isRequired,
    previousSearchTerm: PropTypes.string.isRequired,
    searchTerm: PropTypes.string.isRequired,
    hasContextualSearched: PropTypes.bool.isRequired,
    hideZendeskLogo: PropTypes.bool,
    localeFallbacks: PropTypes.array,
    onNextClick: PropTypes.func,
    newDesign: PropTypes.bool,
    originalArticleButton: PropTypes.bool,
    performContextualSearch: PropTypes.func.isRequired,
    performSearch: PropTypes.func.isRequired,
    performImageSearch: PropTypes.func.isRequired,
    showBackButton: PropTypes.func,
    showNextButton: PropTypes.bool,
    searchLoading: PropTypes.bool.isRequired,
    searchFailed: PropTypes.bool.isRequired,
    style: PropTypes.object,
    submitTicketAvailable: PropTypes.bool,
    chatAvailable: PropTypes.bool,
    talkAvailable: PropTypes.bool.isRequired,
    talkEnabled: PropTypes.bool.isRequired,
    updateFrameSize: PropTypes.func,
    updateChatScreen: PropTypes.func,
    updateSearchTerm: PropTypes.func.isRequired,
    handleArticleClick: PropTypes.func.isRequired,
    zendeskHost: PropTypes.string.isRequired,
    resultsCount: PropTypes.number.isRequired,
    articles: PropTypes.array.isRequired,
    hasSearched: PropTypes.bool.isRequired,
    handleOriginalArticleClicked: PropTypes.func.isRequired,
    articleViewActive: PropTypes.bool.isRequired,
    restrictedImages: PropTypes.object.isRequired,
    addRestrictedImage: PropTypes.func,
    updateChannelChoiceShown: PropTypes.func.isRequired,
    channelChoiceShown: PropTypes.bool.isRequired,
    searchFieldValue: PropTypes.string.isRequired,
    handleSearchFieldChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    buttonLabelKey: 'message',
    callbackEnabled: false,
    channelChoice: false,
    formTitleKey: 'help',
    hideZendeskLogo: false,
    localeFallbacks: [],
    onNextClick: () => {},
    newDesign: false,
    originalArticleButton: true,
    showBackButton: () => {},
    showNextButton: true,
    style: null,
    submitTicketAvailable: true,
    chatAvailable: false,
    updateFrameSize: () => {},
    updateChatScreen: () => {},
    handleArticleClick: () => {},
    updateSearchTerm: () => {},
    articles: [],
    articleViewActive: false,
    handleOriginalArticleClicked: () => {},
    hasSearched: false,
    activeArticle: null,
    restrictedImages: {},
    addRestrictedImage: () => {},
    updateChannelChoiceShown: () => {},
    handleSearchFieldChange: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      images: []
    };
  }

  pauseAllVideos = () => {
    const componentNode = ReactDOM.findDOMNode(this);
    const videoList = componentNode.getElementsByTagName('video');

    _.forEach(videoList, (videoElem) => {
      videoElem.pause();
    });
  }

  getHelpCenterComponent = () => {
    return (this.props.fullscreen)
         ? this.refs.helpCenterMobile
         : this.refs.helpCenterDesktop;
  }

  interactiveSearchSuccessFn = () => {
    this.props.showBackButton(false);
    this.focusField();
  }

  focusField = () => {
    if (this.refs.helpCenterDesktop) {
      this.refs.helpCenterDesktop.focusField();
    }
  }

  contextualSearch = (options) => {
    /* eslint camelcase:0 */
    const hasLabelsKey = options.labels &&
                         _.isArray(options.labels) &&
                         options.labels.length > 0;
    const query = {};
    let searchTerm;

    // This `isString` check is needed in the case that a user passes in only a
    // string to `zE.setHelpCenterSuggestions`. It avoids options.search evaluating
    // to true in that case because it equals the string function `String.prototype.search`.
    if (_.isString(options.search) && options.search.length > 0) {
      searchTerm = query.query = options.search;
    } else if (hasLabelsKey) {
      searchTerm = query.label_names = options.labels.join(',');
    } else if (options.url && options.pageKeywords && options.pageKeywords.length > 0) {
      searchTerm = query.query = options.pageKeywords;
    } else {
      return;
    }

    const successFn = (res) => {
      if (res.body.count > 0) {
        this.props.showBackButton(false);
        this.props.updateSearchTerm(searchTerm);

        if (this.refs.helpCenterMobile) {
          this.refs.helpCenterMobile.setIntroScreen();
        }
      }
    };

    _.extend(query, {
      locale: i18n.getLocale(),
      per_page: maximumContextualSearchResults
    });

    this.performContextualSearch(query, successFn);
  }

  search = () => {
    const searchField = this.getHelpCenterComponent().refs.searchField;
    const searchTerm = searchField.getValue();

    if (_.isEmpty(searchTerm)) {
      return;
    }

    const query = {
      locale: i18n.getLocale(),
      query: searchTerm,
      per_page: maximumSearchResults,
      origin: 'web_widget'
    };

    this.props.updateSearchTerm(searchTerm);

    this.performSearchWithLocaleFallback(query, this.interactiveSearchSuccessFn);

    if (this.props.fullscreen) {
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
    const doneFn = (res) => {
      if (res.ok) {
        if (res.body.count > 0 || _.isEmpty(localeFallbacks)) {
          successFn();
        } else {
          query.locale = localeFallbacks.shift();
          this.props.performSearch(_.pickBy(query), doneFn, this.focusField);
        }
      } else {
        this.focusField();
      }
    };

    this.props.performSearch(query, doneFn, this.focusField);
  }

  performContextualSearch = (query, successFn) => {
    const doneFn = (res) => {
      if (res.ok) {
        successFn(res, query);
      } else {
        this.focusField();
      }
    };

    this.props.performContextualSearch(query, doneFn, this.focusField);
  }

  handleNextClick = (e) => {
    e.preventDefault();

    if (this.props.channelChoice) {
      setTimeout(() => this.props.updateChannelChoiceShown(true), 0);
    } else {
      this.props.onNextClick();
    }
  }

  resetState = () => {
    this.refs.helpCenterMobile.resetState();
  }

  handleArticleClick = (articleIndex, e) => {
    e.preventDefault();
    this.props.handleArticleClick(this.props.articles[articleIndex]);
    this.props.showBackButton();
  }

  onContainerClick = () => {
    this.props.updateChannelChoiceShown(false);
  }

  renderResults = () => {
    const {
      showNextButton,
      fullscreen,
      hideZendeskLogo,
      searchFailed,
      previousSearchTerm,
      hasContextualSearched,
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
        previousSearchTerm={previousSearchTerm}
        handleArticleClick={this.handleArticleClick}
        hasContextualSearched={hasContextualSearched}
        showContactButton={showNextButton}
        hideZendeskLogo={hideZendeskLogo} />
    );
  }

  renderArticles = () => {
    if (!this.props.articleViewActive) return null;

    return (
      <HelpCenterArticle
        activeArticle={this.props.activeArticle}
        zendeskHost={this.props.zendeskHost}
        originalArticleButton={this.props.originalArticleButton}
        handleOriginalArticleClick={this.props.handleOriginalArticleClicked}
        storedImages={this.props.restrictedImages}
        imagesSender={this.props.performImageSearch}
        newDesign={this.props.newDesign}
        updateStoredImages={this.props.addRestrictedImage}
        updateFrameSize={this.props.updateFrameSize}
        fullscreen={this.props.fullscreen} />
    );
  }

  renderHelpCenterDesktop = (buttonLabel) => {
    const shadowVisible = this.props.articleViewActive ||
                          this.props.resultsCount > 0;

    return (
      <HelpCenterDesktop
        ref='helpCenterDesktop'
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
        newDesign={this.props.newDesign}
        channelChoice={this.props.channelChoiceShown}
        callbackEnabled={this.props.callbackEnabled}
        talkEnabled={this.props.talkEnabled}
        talkAvailable={this.props.talkAvailable}
        articleViewActive={this.props.articleViewActive}
        hasSearched={this.props.hasSearched}
        buttonLabel={buttonLabel}
        formTitleKey={this.props.formTitleKey}
        searchFieldValue={this.props.searchFieldValue}
        shadowVisible={shadowVisible}
        updateFrameSize={this.props.updateFrameSize}
        updateChatScreen={this.props.updateChatScreen}>
        {this.renderResults()}
        {this.renderArticles()}
      </HelpCenterDesktop>
    );
  }

  renderHelpCenterMobile = (buttonLabel) => {
    return (
      <HelpCenterMobile
        ref='helpCenterMobile'
        handleOnChangeValue={this.props.handleSearchFieldChange}
        submitTicketAvailable={this.props.submitTicketAvailable}
        chatEnabled={this.props.chatEnabled}
        handleNextClick={this.handleNextClick}
        search={this.search}
        isLoading={this.props.searchLoading}
        onNextClick={this.props.onNextClick}
        newDesign={this.props.newDesign}
        showNextButton={this.props.showNextButton}
        chatAvailable={this.props.chatAvailable}
        hasContextualSearched={this.props.hasContextualSearched}
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
        setChannelChoiceShown={this.props.updateChannelChoiceShown}>
        {this.renderResults()}
        {this.renderArticles()}
      </HelpCenterMobile>
    );
  }

  render = () => {
    let buttonLabel;
    const { channelChoice, chatAvailable, talkAvailable, callbackEnabled } = this.props;

    if (channelChoice || (chatAvailable && talkAvailable)) {
      buttonLabel = i18n.t('embeddable_framework.helpCenter.submitButton.label.submitTicket.contact');
    } else if (chatAvailable) {
      buttonLabel = i18n.t('embeddable_framework.common.button.chat');
    } else if (talkAvailable) {
      buttonLabel = callbackEnabled
                  ? i18n.t('embeddable_framework.helpCenter.submitButton.label.callback')
                  : i18n.t('embeddable_framework.helpCenter.submitButton.label.phone');
    } else {
      buttonLabel = i18n.t(`embeddable_framework.helpCenter.submitButton.label.submitTicket.${this.props.buttonLabelKey}`); // eslint-disable-line
    }

    const helpCenter = (this.props.fullscreen)
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
  updateChannelChoiceShown,
  handleArticleClick,
  updateSearchTerm,
  performSearch,
  performImageSearch,
  performContextualSearch,
  handleOriginalArticleClicked,
  addRestrictedImage
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(HelpCenter);
