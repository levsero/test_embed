import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { Container } from 'component/Container';
import { HelpCenterArticle } from 'component/HelpCenterArticle';
import { HelpCenterDesktop } from 'component/HelpCenterDesktop';
import { HelpCenterMobile } from 'component/HelpCenterMobile';
import { HelpCenterResults } from 'component/HelpCenterResults';
import { beacon } from 'service/beacon';
import { i18n } from 'service/i18n';
import { search } from 'service/search';
import { isMobileBrowser } from 'utility/devices';
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
      buttonLabel: i18n.t(`embeddable_framework.helpCenter.submitButton.label.submitTicket.${props.buttonLabelKey}`),
      previousSearchTerm: '',
      hasSearched: false,
      hasContextualSearched: false,
      searchFailed: false,
      articleViewActive: false,
      activeArticle: {},
      searchTracked: false,
      searchResultClicked: false,
      searchFieldFocused: false,
      resultsPerPage: minimumSearchResults,
      showViewMore: true,
      viewMoreActive: false
    };
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

  interactiveSearchSuccessFn(res, query) {
    this.setState(
      this.searchCompleteState({
        hasContextualSearched: false,
        previousSearchTerm: this.state.searchTerm
      })
    );

    this.props.onSearch({searchTerm: query.query, searchLocale: query.locale});
    this.updateResults(res);

    if (!this.props.fullscreen) {
      this.refs.rootComponent.focusField();
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
      }
    };

    _.extend(query, {
      locale: i18n.getLocale(),
      per_page: this.state.resultsPerPage,
      origin: null
    });

    this.performSearch(query, successFn, { isContextual: true });
  }

  manualSearch(e) {
    /* eslint camelcase:0 */
    e.preventDefault();

    const searchField = this.refs.rootComponent.refs.searchField;
    const searchTerm = searchField.getValue();
    console.log('here', searchTerm, searchField)

    if (_.isEmpty(searchTerm)) {
      return;
    }

    const query = {
      locale: i18n.getLocale(),
      query: searchTerm,
      per_page: this.state.resultsPerPage,
      origin: 'web_widget'
    };

    this.setState(
      this.searchStartState({
        searchTerm: searchTerm,
        searchTracked: true
      })
    );

    this.performSearch(query, this.interactiveSearchSuccessFn, { localeFallback: true });

    if (this.state.fullscreen) {
      setTimeout(() => {
        searchField.blur();
      }, 1);
    }
  }

  autoSearch(e) {
    e.preventDefault();

    const searchTerm = this.refs.rootComponent.refs.searchField.getValue();

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

    this.performSearch(query, this.interactiveSearchSuccessFn, { localeFallback: true });
  }

  updateResults(res) {
    const json = res.body;
    const articles = json.results;

    this.setState({
      articles: articles,
      resultsCount: json.count,
      articleViewActive: false,
      resultsPerPage: minimumSearchResults,
      showViewMore: !this.state.viewMoreActive,
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

    if (!this.props.fullscreen) {
      this.refs.rootComponent.focusField();
    }
  }

  performSearch(query, successFn, options = {}) {
    const isContextual = !!options.isContextual;
    const searchFn = isContextual
                   ? search.contextualSender
                   : search.sender;
    const doneFn = (res) => {
      if (res.ok) {
        if ((query.locale && res.body.count > 0) || !options.localeFallback) {
          successFn(res, query);
        } else if (options.localeFallback && query.locale) {
          this.performSearch(_.omit(query, 'locale'), successFn, { isContextual: isContextual });
        }
      } else {
        this.searchFail();
      }
    };
    const failFn = () => this.searchFail();

    searchFn(query, doneFn, failFn);
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

  handleViewMoreClick(e) {
    e.preventDefault();

    this.setState({
      resultsPerPage: maximumSearchResults,
      viewMoreActive: true
    });

    setTimeout(() => this.manualSearch(), 0);
  }

  handleNextClick(ev) {
    ev.preventDefault();
    this.props.onNextClick();
  }

  onChangeValueHandler(value) {
    this.setState({ searchFieldValue: value });
  }

  trackSearch() {
    /* eslint camelcase:0 */
    search.sender({
      query: this.state.searchTerm,
      per_page: 0,
      origin: 'web_widget'
    });

    this.setState({
      searchTracked: true
    });
  }

  handleNextClick(ev) {
    ev.preventDefault();
    this.props.onNextClick();
  }

  /**
   * Instrument the last auto-search, if it's still pending to be instrumented
   */
  backtrackSearch() {
    if (!this.state.searchTracked && this.state.searchTerm && !this.state.hasContextualSearched) {
      this.trackSearch();
    }
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

  updateImages(img) {
    this.setState({
      images: _.extend({}, this.state.images, img)
    });
  }

  render() {
    const articleClasses = classNames({
      'u-isHidden': !this.state.articleViewActive
    });
    const formClasses = classNames({
      'u-isHidden': this.state.articleViewActive
    });
    const resultsClasses = classNames({
      'u-isHidden': !(this.state.hasSearched || this.state.hasContextualSearched) || this.state.articleViewActive
    });

    const chatButtonLabel = i18n.t('embeddable_framework.helpCenter.submitButton.label.chat');
    const mobileHideLogoState = this.state.fullscreen && this.state.hasSearched;
    const hideZendeskLogo = this.props.hideZendeskLogo || mobileHideLogoState;

    let linkLabel, linkContext;

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(), 0);
    }

    const updateState = (state = {}) => {
      this.setState(state);
    };

    const articles = (
      <div className={articleClasses}>
        <HelpCenterArticle
          activeArticle={this.state.activeArticle}
          zendeskHost={this.props.zendeskHost}
          storedImages={this.state.images}
          imagesSender={this.props.imagesSender}
          updateStoredImages={this.updateImages}
          updateFrameSize={this.props.updateFrameSize}
          fullscreen={this.state.fullscreen} />
      </div>
    );
    const showViewMore = this.state.showViewMore && this.state.resultsCount > minimumSearchResults;
    const results = (
      <div className={resultsClasses}>
        <HelpCenterResults
          fullscreen={this.state.fullscreen}
          articles={this.state.articles}
          showViewMore={showViewMore}
          searchFailed={this.state.searchFailed}
          previousSearchTerm={this.state.previousSearchTerm}
          handleArticleClick={this.handleArticleClick}
          handleViewMoreClick={this.handleViewMoreClick}
          hasContextualSearched={this.state.hasContextualSearched} />
      </div>
    );

    const helpCenter = (!isMobileBrowser())
                     ? (<HelpCenterDesktop
                          ref='rootComponent'
                          parentState={this.state}
                          onChangeValueHandler={this.onChangeValueHandler}
                          handleArticleClick={this.handleArticleClick}
                          handleNextClick={this.handleNextClick}
                          autoSearch={this.autoSearch}
                          manualSearch={this.manualSearch}
                          hideZendeskLogo={this.props.hideZendeskLogo}
                          onSearch={this.props.onSearch}
                          formTitleKey={this.props.formTitleKey}
                          searchSender={this.props.searchSender}
                          contextualSearchSender={this.props.contextualSearchSender}
                          updateFrameSize={this.props.updateFrameSize}>
                          {results}
                          {articles}
                        </HelpCenterDesktop>)
                     : (<HelpCenterMobile
                          ref='rootComponent'
                          parentState={this.state}
                          onChangeValueHandler={this.onChangeValueHandler}
                          handleArticleClick={this.handleArticleClick}
                          handleNextClick={this.handleNextClick}
                          autoSearch={this.autoSearch}
                          manualSearch={this.manualSearch}
                          hideZendeskLogo={this.props.hideZendeskLogo}
                          onSearch={this.props.onSearch}
                          buttonLabelKey={this.props.buttonLabelKey}
                          formTitleKey={this.props.formTitleKey}>
                          {results}
                          {articles}
                        </HelpCenterMobile>)

    return (
      <Container
        style={this.props.style}
        fullscreen={isMobileBrowser()}>
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
  buttonLabelKey: PropTypes.string,
  onSearch: PropTypes.func,
  showBackButton: PropTypes.func,
  onNextClick: PropTypes.func,
  onArticleClick: PropTypes.func,
  hideZendeskLogo: PropTypes.bool,
  updateFrameSize: PropTypes.any,
  style: PropTypes.object,
  formTitleKey: PropTypes.string,
  disableAutoSearch: PropTypes.bool
};

HelpCenter.defaultProps = {
  buttonLabelKey: 'message',
  onSearch: () => {},
  showBackButton: () => {},
  onNextClick: () => {},
  onArticleClick: () => {},
  hideZendeskLogo: false,
  updateFrameSize: false,
  style: null,
  formTitleKey: 'help',
  disableAutoSearch: false
};
