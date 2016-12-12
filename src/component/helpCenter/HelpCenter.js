import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { Container } from 'component/Container';
import { HelpCenterArticle } from 'component/helpCenter/HelpCenterArticle';
import { HelpCenterDesktop } from 'component/helpCenter/HelpCenterDesktop';
import { HelpCenterMobile } from 'component/helpCenter/HelpCenterMobile';
import { HelpCenterResults } from 'component/helpCenter/HelpCenterResults';
import { i18n } from 'service/i18n';
import { bindMethods } from 'utility/utils';

const minimumSearchResults = 3;
const maximumSearchResults = 9;

export class HelpCenter extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, HelpCenter.prototype);

    this.state = {
      articles: [],
      resultsCount: 0,
      searchTerm: '',
      showNextButton: true,
      previousSearchTerm: '',
      hasSearched: false,
      hasContextualSearched: false,
      searchFailed: false,
      articleViewActive: false,
      activeArticle: {},
      searchTracked: false,
      searchResultClicked: false,
      searchFieldFocused: false,
      expanded: false,
      resultsPerPage: minimumSearchResults,
      showViewMore: true,
      chatOnline: false,
      viewMoreActive: false
    };
  }

  getHelpCenterComponent() {
    return (this.props.fullscreen)
           ? this.refs.helpCenterMobile
           : this.refs.helpCenterDesktop;
  }

  searchStartState(state) {
    return _.extend({
      isLoading: true,
      searchResultClicked: false
    }, state);
  }

  searchCompleteState(state) {
    return _.extend({
      hasSearched: true,
      isLoading: false,
      searchFailed: false,
      searchResultClicked: false
    }, state);
  }

  expand(expanded) {
    this.setState({ expanded });
  }

  setChatOnline(state) {
    this.setState({ chatOnline: state });
  }

  interactiveSearchSuccessFn(res, query) {
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

  focusField() {
    if (this.refs.helpCenterDesktop) {
      this.refs.helpCenterDesktop.focusField();
    }
  }

  contextualSearch(options) {
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

  manualSearch() {
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

  autoSearch() {
    const searchTerm = this.getHelpCenterComponent().refs.searchField.getValue();

    if (_.isEmpty(searchTerm) ||
        !(searchTerm.length >= 5 && _.last(searchTerm) === ' ') ||
        this.props.disableAutoSearch) {
      return;
    }

    const query = {
      locale: i18n.getLocale(),
      query: searchTerm,
      per_page: this.state.resultsPerPage,
      origin: null
    };

    this.setState(
      this.searchStartState({
        searchTerm: searchTerm,
        searchTracked: false
      })
    );

    this.performSearchWithLocaleFallback(query, this.interactiveSearchSuccessFn);
  }

  updateResults(res) {
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

  searchFail() {
    this.setState({
      isLoading: false,
      previousSearchTerm: this.state.searchTerm,
      hasSearched: true,
      searchFailed: true
    });

    this.focusField();
  }

  performSearchWithLocaleFallback(query, successFn) {
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

  performContextualSearch(query, successFn) {
    const doneFn = (res) => {
      if (res.ok) {
        successFn(res, query);
      } else {
        this.searchFail();
      }
    };

    this.props.contextualSearchSender(query, doneFn, this.searchFail);
  }

  handleViewMoreClick(e) {
    e.preventDefault();

    this.setState({
      resultsPerPage: maximumSearchResults,
      viewMoreActive: true
    });

    setTimeout(() => this.manualSearch(), 0);
  }

  handleNextClick(e) {
    e.preventDefault();
    this.props.onNextClick();
  }

  handleOnChangeValue(value) {
    this.setState({ searchFieldValue: value });
  }

  trackSearch() {
    /* eslint camelcase:0 */
    this.props.searchSender({
      query: this.state.searchTerm,
      per_page: 0,
      origin: 'web_widget'
    });

    this.setState({
      searchTracked: true
    });
  }

  /**
   * Instrument the last auto-search, if it's still pending to be instrumented
   */
  backtrackSearch() {
    if (!this.state.searchTracked &&
        this.state.searchTerm &&
        !this.state.hasContextualSearched) {
      this.trackSearch();
    }
  }

  resetState() {
    this.refs.helpCenterMobile.resetState();
  }

  showNextButton(value) {
    this.setState({ showNextButton: value });
  }

  setChatOnline(chatOnline) {
    this.setState({ chatOnline });
  }

  handleArticleClick(articleIndex, e) {
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

  trackArticleView() {
    const trackPayload = {
      query: this.state.searchTerm,
      resultsCount: this.state.resultsCount > 3 ? 3 : this.state.resultsCount,
      uniqueSearchResultClick: !this.state.searchResultClicked,
      articleId: this.state.activeArticle.id,
      locale: i18n.getLocale()
    };

    this.props.onArticleClick(trackPayload);

    this.setState({
      searchResultClicked: true
    });
  }

  onContainerClick() {
    if (this.refs.helpCenterDesktop) {
      this.refs.helpCenterDesktop.hideChannelChoice();
    }
  }

  updateImages(img) {
    this.setState({
      images: _.extend({}, this.state.images, img)
    });
  }

  renderResults() {
    const hasSearched = this.state.hasSearched || this.state.hasContextualSearched;

    if (this.state.articleViewActive || !hasSearched) {
      return null;
    }
    const showViewMore = this.props.viewMoreEnabled &&
                         this.state.showViewMore &&
                         this.state.resultsCount > minimumSearchResults;
    const showBottomBorder = !this.props.fullscreen &&
                             !(!this.state.showNextButton && this.props.hideZendeskLogo);
    const applyPadding = !this.state.showNextButton && !this.props.hideZendeskLogo;
    const hideBottomPadding = this.props.viewMoreEnabled &&
                              this.state.articles.length > minimumSearchResults &&
                              !this.state.showNextButton;

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
        hideBottomPadding={hideBottomPadding}
        showContactButton={this.state.showNextButton} />
    );
  }

  renderArticles() {
    if (!this.state.articleViewActive) {
      return null;
    }

    return (
      <HelpCenterArticle
        activeArticle={this.state.activeArticle}
        zendeskHost={this.props.zendeskHost}
        originalArticleButton={this.props.originalArticleButton}
        storedImages={this.state.images}
        imagesSender={this.props.imagesSender}
        updateStoredImages={this.updateImages}
        updateFrameSize={this.props.updateFrameSize}
        fullscreen={this.props.fullscreen} />
    );
  }

  renderHelpCenterDesktop(buttonLabel) {
    const shadowVisible = this.state.articleViewActive ||
                          this.state.articles.length > minimumSearchResults;

    return (
      <HelpCenterDesktop
        ref='helpCenterDesktop'
        handleOnChangeValue={this.handleOnChangeValue}
        handleNextClick={this.handleNextClick}
        autoSearch={this.autoSearch}
        manualSearch={this.manualSearch}
        showNextButton={this.state.showNextButton}
        hideZendeskLogo={this.props.hideZendeskLogo}
        disableAutoSearch={this.props.disableAutoSearch}
        isLoading={this.state.isLoading}
        onNextClick={this.props.onNextClick}
        channelChoice={this.props.channelChoice && this.state.chatOnline}
        articleViewActive={this.state.articleViewActive}
        hasSearched={this.state.hasSearched}
        buttonLabel={buttonLabel}
        expanded={this.state.expanded}
        formTitleKey={this.props.formTitleKey}
        searchFieldValue={this.state.searchFieldValue}
        shadowVisible={shadowVisible}
        updateFrameSize={this.props.updateFrameSize}>
        {this.renderResults()}
        {this.renderArticles()}
      </HelpCenterDesktop>
    );
  }

  renderHelpCenterMobile(buttonLabel) {
    return (
      <HelpCenterMobile
        ref='helpCenterMobile'
        handleOnChangeValue={this.handleOnChangeValue}
        handleNextClick={this.handleNextClick}
        manualSearch={this.manualSearch}
        isLoading={this.state.isLoading}
        showNextButton={this.state.showNextButton}
        chatOnline={this.state.chatOnline}
        articleViewActive={this.state.articleViewActive}
        hasSearched={this.state.hasSearched}
        disableAutoSearch={this.props.disableAutoSearch}
        searchFieldValue={this.state.searchFieldValue}
        hideZendeskLogo={this.props.hideZendeskLogo}
        buttonLabel={buttonLabel}
        formTitleKey={this.props.formTitleKey}>
        {this.renderResults()}
        {this.renderArticles()}
      </HelpCenterMobile>
    );
  }

  render() {
    let buttonLabel;

    if (this.props.channelChoice) {
      buttonLabel = i18n.t('embeddable_framework.helpCenter.submitButton.label.submitTicket.contact');
    } else if (this.state.chatOnline) {
      buttonLabel = i18n.t('embeddable_framework.helpCenter.submitButton.label.chat');
    } else {
      buttonLabel = i18n.t(`embeddable_framework.helpCenter.submitButton.label.submitTicket.${this.props.buttonLabelKey}`); // eslint-disable-line
    }

    const helpCenter = (this.props.fullscreen)
                     ? this.renderHelpCenterMobile(buttonLabel)
                     : this.renderHelpCenterDesktop(buttonLabel);

    setTimeout(() => this.props.updateFrameSize(), 0);

    return (
      <Container
        style={this.props.style}
        onClick={this.onContainerClick}
        expanded={this.state.expanded}
        fullscreen={this.props.fullscreen}>
        {helpCenter}
      </Container>
    );
  }
}

HelpCenter.propTypes = {
  searchSender: PropTypes.func.isRequired,
  contextualSearchSender: PropTypes.func.isRequired,
  imagesSender: PropTypes.func.isRequired,
  zendeskHost: PropTypes.string.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  buttonLabelKey: PropTypes.string,
  onSearch: PropTypes.func,
  showBackButton: PropTypes.func,
  onNextClick: PropTypes.func,
  onArticleClick: PropTypes.func,
  hideZendeskLogo: PropTypes.bool,
  updateFrameSize: PropTypes.func,
  style: PropTypes.object,
  formTitleKey: PropTypes.string,
  originalArticleButton: PropTypes.bool,
  channelChoice: PropTypes.bool,
  localeFallbacks: PropTypes.arr,
  disableAutoSearch: PropTypes.bool,
  viewMoreEnabled: PropTypes.bool
};

HelpCenter.defaultProps = {
  buttonLabelKey: 'message',
  onSearch: () => {},
  showBackButton: () => {},
  onNextClick: () => {},
  onArticleClick: () => {},
  hideZendeskLogo: false,
  updateFrameSize: () => {},
  style: null,
  formTitleKey: 'help',
  originalArticleButton: true,
  localeFallbacks: [],
  channelChoice: false,
  disableAutoSearch: false,
  viewMoreEnabled: false
};
