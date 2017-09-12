import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { HelpCenterArticle } from 'component/helpCenter/HelpCenterArticle';
import { HelpCenterDesktop } from 'component/helpCenter/HelpCenterDesktop';
import { HelpCenterMobile } from 'component/helpCenter/HelpCenterMobile';
import { HelpCenterResults } from 'component/helpCenter/HelpCenterResults';
import { i18n } from 'service/i18n';

const minimumSearchResults = 3;
const maximumSearchResults = 9;

export class HelpCenter extends Component {
  static propTypes = {
    buttonLabelKey: PropTypes.string,
    channelChoice: PropTypes.bool,
    chatOnline: PropTypes.bool,
    contextualSearchSender: PropTypes.func.isRequired,
    disableAutoComplete: PropTypes.bool,
    formTitleKey: PropTypes.string,
    fullscreen: PropTypes.bool.isRequired,
    hideZendeskLogo: PropTypes.bool,
    imagesSender: PropTypes.func.isRequired,
    localeFallbacks: PropTypes.array,
    onArticleClick: PropTypes.func,
    onViewOriginalArticleClick: PropTypes.func,
    onNextClick: PropTypes.func,
    newDesign: PropTypes.bool,
    onSearch: PropTypes.func,
    originalArticleButton: PropTypes.bool,
    searchSender: PropTypes.func.isRequired,
    showBackButton: PropTypes.func,
    // TODO: make this a single prop when single iframe is GA'd
    showNextButton: PropTypes.bool,
    showNextButtonSingleIframe: PropTypes.bool,
    style: PropTypes.object,
    updateFrameSize: PropTypes.func,
    hideChatNotification: PropTypes.func,
    viewMoreEnabled: PropTypes.bool,
    zendeskHost: PropTypes.string.isRequired,
    notification: PropTypes.object.isRequired
  };

  static defaultProps = {
    buttonLabelKey: 'message',
    channelChoice: false,
    chatOnline: false,
    disableAutoComplete: false,
    formTitleKey: 'help',
    hideZendeskLogo: false,
    localeFallbacks: [],
    onArticleClick: () => {},
    onViewOriginalArticleClick: () => {},
    onNextClick: () => {},
    onSearch: () => {},
    newDesign: false,
    originalArticleButton: true,
    showBackButton: () => {},
    showNextButton: true,
    showNextButtonSingleIframe: false,
    style: null,
    updateFrameSize: () => {},
    hideChatNotification: () => {},
    viewMoreEnabled: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      activeArticle: {},
      articles: [],
      articleViewActive: false,
      chatOnline: false,
      hasContextualSearched: false,
      hasSearched: false,
      loadingSpinnerActive: false,
      previousSearchTerm: '',
      resultsCount: 0,
      resultsPerPage: minimumSearchResults,
      searchFailed: false,
      searchFieldFocused: false,
      searchResultClicked: false,
      searchTerm: '',
      searchTracked: false,
      showNextButton: this.props.showNextButton,
      showViewMore: true,
      viewMoreActive: false,
      channelChoiceShown: false
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

  searchStartState = (state) => {
    return _.extend({
      isLoading: true,
      searchResultClicked: false
    }, state);
  }

  searchCompleteState = (state) => {
    return _.extend({
      hasSearched: true,
      isLoading: false,
      searchFailed: false,
      searchResultClicked: false
    }, state);
  }

  setArticleView = (articleViewActive) => {
    this.setState({ articleViewActive });
  }

  setChannelChoiceShown = (channelChoiceShown) => {
    this.setState({ channelChoiceShown });
  }

  interactiveSearchSuccessFn = (res, query) => {
    this.setState(
      this.searchCompleteState({
        hasContextualSearched: false,
        previousSearchTerm: this.state.searchTerm
      })
    );

    this.props.onSearch({searchTerm: query.query, searchLocale: query.locale});
    this.updateResults(res);
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
        this.setState(
          this.searchCompleteState({
            searchTerm: searchTerm,
            hasContextualSearched: true,
            previousSearchTerm: this.state.searchTerm
          })
        );
        this.updateResults(res);

        if (this.refs.helpCenterMobile) {
          this.refs.helpCenterMobile.setContextualSearched();
        }
      }
    };

    _.extend(query, {
      locale: i18n.getLocale(),
      per_page: this.state.resultsPerPage,
      origin: null
    });

    this.performContextualSearch(query, successFn);
  }

  search = () => {
    const searchField = this.getHelpCenterComponent().refs.searchField;
    const searchTerm = (this.state.viewMoreActive)
                     ? this.state.previousSearchTerm
                     : searchField.getValue();

    if (_.isEmpty(searchTerm)) {
      return;
    }

    const query = {
      locale: i18n.getLocale(),
      query: searchTerm,
      per_page: this.state.resultsPerPage, // eslint camelcase:0
      origin: 'web_widget'
    };

    this.setState(
      this.searchStartState({
        searchTerm: searchTerm,
        searchTracked: true
      })
    );

    this.performSearchWithLocaleFallback(query, this.interactiveSearchSuccessFn);

    if (this.props.fullscreen) {
      setTimeout(() => {
        searchField.blur();
      }, 1);
    }
  }

  updateResults = (res) => {
    const json = res.body;
    const articles = json.results;

    this.setState({
      articles: articles,
      resultsCount: json.count,
      articleViewActive: false,
      resultsPerPage: minimumSearchResults,
      showViewMore: !this.state.viewMoreActive && !this.state.hasContextualSearched,
      viewMoreActive: false
    });

    this.props.showBackButton(false);
  }

  searchFail = () => {
    this.setState({
      isLoading: false,
      previousSearchTerm: this.state.searchTerm,
      hasSearched: true,
      searchFailed: true
    });

    this.focusField();
  }

  performSearchWithLocaleFallback = (query, successFn) => {
    // When localeFallbacks is defined in the zESettings object then
    // attempt the search with each locale in that array in order. Otherwise
    // try the search with no locale.
    const localeFallbacks = !_.isEmpty(this.props.localeFallbacks)
                          ? this.props.localeFallbacks.slice()
                          : [''];
    const doneFn = (res) => {
      if (res.ok) {
        if (res.body.count > 0 || _.isEmpty(localeFallbacks)) {
          successFn(res, query);
        } else {
          query.locale = localeFallbacks.shift();
          this.props.searchSender(_.pickBy(query), doneFn, this.searchFail);
        }
      } else {
        this.searchFail();
      }
    };

    this.props.searchSender(query, doneFn, this.searchFail);
  }

  performContextualSearch = (query, successFn) => {
    const doneFn = (res) => {
      if (res.ok) {
        successFn(res, query);
      } else {
        this.searchFail();
      }
    };

    this.props.contextualSearchSender(query, doneFn, this.searchFail);
  }

  handleViewMoreClick = (e) => {
    e.preventDefault();

    this.setState({
      resultsPerPage: maximumSearchResults,
      viewMoreActive: true
    });

    setTimeout(() => this.search(), 0);
  }

  handleNextClick = (e) => {
    const chatOnline = this.state.chatOnline || this.props.chatOnline;

    e.preventDefault();

    if (this.props.channelChoice && chatOnline) {
      setTimeout(() => this.setChannelChoiceShown(true), 0);
    } else {
      this.props.onNextClick();
    }
  }

  handleOnChangeValue = (value) => {
    this.setState({ searchFieldValue: value });
  }

  trackSearch = () => {
    /* eslint camelcase:0 */
    this.props.searchSender({
      query: this.state.searchTerm,
      per_page: 0,
      origin: 'web_widget'
    });

    this.setState({ searchTracked: true });
  }

  /**
   * Instrument the last auto-search, if it's still pending to be instrumented
   */
  backtrackSearch = () => {
    if (!this.state.searchTracked &&
        this.state.searchTerm &&
        !this.state.hasContextualSearched) {
      this.trackSearch();
    }
  }

  resetState = () => {
    this.refs.helpCenterMobile.resetState();
  }

  showNextButton = (value) => {
    this.setState({ showNextButton: value });
  }

  shouldShowNextButton = () => this.state.showNextButton || this.props.showNextButtonSingleIframe;

  setChatOnline = (chatOnline) => {
    this.setState({ chatOnline });
  }

  handleArticleClick = (articleIndex, e) => {
    e.preventDefault();

    this.setState({
      activeArticle: this.state.articles[articleIndex],
      articleViewActive: true
    });

    // call nextTick so state has a chance to be consistent
    setTimeout(() => this.trackArticleView(), 0);

    this.props.showBackButton();

    if (!this.state.searchTracked && !this.state.hasContextualSearched) {
      this.trackSearch();
    }
  }

  trackArticleView = () => {
    this.props.onArticleClick(this.getTrackPayload());
    this.setState({ searchResultClicked: true });
  }

  getTrackPayload = () => {
    return {
      query: this.state.searchTerm,
      resultsCount: (this.state.resultsCount > 3) ? 3 : this.state.resultsCount,
      uniqueSearchResultClick: !this.state.searchResultClicked,
      articleId: this.state.activeArticle.id,
      locale: i18n.getLocale()
    };
  }

  handleOriginalArticleClick = () => {
    this.props.onViewOriginalArticleClick(this.getTrackPayload());
  }

  onContainerClick = () => {
    this.setChannelChoiceShown(false);
  }

  updateImages = (img) => {
    this.setState({
      images: _.extend({}, this.state.images, img)
    });
  }

  renderResults = () => {
    const hasSearched = this.state.hasSearched || this.state.hasContextualSearched;

    if (this.state.articleViewActive || !hasSearched) {
      return null;
    }

    const showViewMore = this.props.viewMoreEnabled &&
                         this.state.showViewMore &&
                         this.state.resultsCount > minimumSearchResults;
    const showBottomBorder = !this.props.fullscreen &&
                             !(!this.shouldShowNextButton() && this.props.hideZendeskLogo);
    const applyPadding = !this.shouldShowNextButton() && !this.props.hideZendeskLogo;

    return (
      <HelpCenterResults
        fullscreen={this.props.fullscreen}
        articles={this.state.articles}
        showViewMore={showViewMore}
        applyPadding={applyPadding}
        searchFailed={this.state.searchFailed}
        showBottomBorder={showBottomBorder}
        previousSearchTerm={this.state.previousSearchTerm}
        handleArticleClick={this.handleArticleClick}
        handleViewMoreClick={this.handleViewMoreClick}
        hasContextualSearched={this.state.hasContextualSearched}
        showContactButton={this.shouldShowNextButton()} />
    );
  }

  renderArticles = () => {
    if (!this.state.articleViewActive) return null;

    return (
      <HelpCenterArticle
        activeArticle={this.state.activeArticle}
        zendeskHost={this.props.zendeskHost}
        originalArticleButton={this.props.originalArticleButton}
        handleOriginalArticleClick={this.handleOriginalArticleClick}
        storedImages={this.state.images}
        imagesSender={this.props.imagesSender}
        updateStoredImages={this.updateImages}
        updateFrameSize={this.props.updateFrameSize}
        fullscreen={this.props.fullscreen} />
    );
  }

  renderHelpCenterDesktop = (buttonLabel) => {
    const shadowVisible = this.state.articleViewActive ||
                          this.state.articles.length > minimumSearchResults;
    const chatOnline = this.state.chatOnline || this.props.chatOnline;

    return (
      <HelpCenterDesktop
        ref='helpCenterDesktop'
        notification={this.props.notification}
        chatOnline={chatOnline}
        handleOnChangeValue={this.handleOnChangeValue}
        handleNextClick={this.handleNextClick}
        search={this.search}
        showNextButton={this.shouldShowNextButton()}
        hideZendeskLogo={this.props.hideZendeskLogo}
        disableAutoComplete={this.props.disableAutoComplete}
        isLoading={this.state.isLoading}
        onNextClick={this.props.onNextClick}
        newDesign={this.props.newDesign}
        channelChoice={this.state.channelChoiceShown}
        articleViewActive={this.state.articleViewActive}
        hasSearched={this.state.hasSearched}
        buttonLabel={buttonLabel}
        formTitleKey={this.props.formTitleKey}
        searchFieldValue={this.state.searchFieldValue}
        shadowVisible={shadowVisible}
        updateFrameSize={this.props.updateFrameSize}
        hideChatNotification={this.props.hideChatNotification}>
        {this.renderResults()}
        {this.renderArticles()}
      </HelpCenterDesktop>
    );
  }

  renderHelpCenterMobile = (buttonLabel) => {
    const chatOnline = this.state.chatOnline || this.props.chatOnline;

    return (
      <HelpCenterMobile
        ref='helpCenterMobile'
        handleOnChangeValue={this.handleOnChangeValue}
        handleNextClick={this.handleNextClick}
        search={this.search}
        isLoading={this.state.isLoading}
        onNextClick={this.props.onNextClick}
        newDesign={this.props.newDesign}
        showNextButton={this.shouldShowNextButton()}
        chatOnline={chatOnline}
        channelChoice={this.state.channelChoiceShown}
        articleViewActive={this.state.articleViewActive}
        hasSearched={this.state.hasSearched}
        searchFieldValue={this.state.searchFieldValue}
        hideZendeskLogo={this.props.hideZendeskLogo}
        buttonLabel={buttonLabel}
        formTitleKey={this.props.formTitleKey}
        setChannelChoiceShown={this.setChannelChoiceShown}>
        {this.renderResults()}
        {this.renderArticles()}
      </HelpCenterMobile>
    );
  }

  render = () => {
    let buttonLabel;

    if (this.props.channelChoice) {
      buttonLabel = i18n.t('embeddable_framework.helpCenter.submitButton.label.submitTicket.contact');
    } else if (this.state.chatOnline || this.props.chatOnline) {
      buttonLabel = i18n.t('embeddable_framework.helpCenter.submitButton.label.chat');
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
