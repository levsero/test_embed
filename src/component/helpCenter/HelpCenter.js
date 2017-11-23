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
         updateActiveArticle,
         performSearch,
         performContextualSearch,
         performImageSearch } from 'src/redux/modules/helpCenter';
import { getSearchLoading,
         getArticleClicked } from 'src/redux/modules/helpCenter/selectors';

const minimumSearchResults = 3;
const maximumSearchResults = 9;

const mapStateToProps = (state) => {
  return {
    searchLoading: getSearchLoading(state),
    articleClicked: getArticleClicked(state)
  };
};

class HelpCenter extends Component {
  static propTypes = {
    buttonLabelKey: PropTypes.string,
    channelChoice: PropTypes.bool,
    chatOnline: PropTypes.bool,
    formTitleKey: PropTypes.string,
    fullscreen: PropTypes.bool.isRequired,
    getFrameDimensions: PropTypes.func.isRequired,
    hideZendeskLogo: PropTypes.bool,
    localeFallbacks: PropTypes.array,
    onArticleClick: PropTypes.func,
    onViewOriginalArticleClick: PropTypes.func,
    onNextClick: PropTypes.func,
    newDesign: PropTypes.bool,
    onSearch: PropTypes.func,
    originalArticleButton: PropTypes.bool,
    performContextualSearch: PropTypes.func.isRequired,
    performSearch: PropTypes.func.isRequired,
    performImageSearch: PropTypes.func.isRequired,
    showBackButton: PropTypes.func,
    showNextButton: PropTypes.bool,
    searchLoading: PropTypes.bool.isRequired,
    style: PropTypes.object,
    articleClicked: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool,
    updateFrameSize: PropTypes.func,
    hideChatNotification: PropTypes.func,
    updateChatScreen: PropTypes.func,
    updateSearchTerm: PropTypes.func.isRequired,
    updateActiveArticle: PropTypes.func.isRequired,
    viewMoreEnabled: PropTypes.bool,
    zendeskHost: PropTypes.string.isRequired,
    notification: PropTypes.object.isRequired
  };

  static defaultProps = {
    buttonLabelKey: 'message',
    channelChoice: false,
    chatOnline: false,
    formTitleKey: 'help',
    hideZendeskLogo: false,
    getFrameDimensions: () => {},
    localeFallbacks: [],
    onArticleClick: () => {},
    onViewOriginalArticleClick: () => {},
    onNextClick: () => {},
    onSearch: () => {},
    newDesign: false,
    originalArticleButton: true,
    showBackButton: () => {},
    showNextButton: true,
    style: null,
    talkAvailable: false,
    updateFrameSize: () => {},
    hideChatNotification: () => {},
    updateChatScreen: () => {},
    updateActiveArticle: () => {},
    viewMoreEnabled: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      activeArticle: {},
      articles: [],
      articleViewActive: false,
      hasContextualSearched: false,
      hasSearched: false,
      previousSearchTerm: '',
      resultsCount: 0,
      resultsPerPage: minimumSearchResults,
      searchFailed: false,
      searchTerm: '',
      searchTracked: false,
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

  searchCompleteState = (state) => {
    return _.extend({
      hasSearched: true,
      searchFailed: false
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
      per_page: this.state.resultsPerPage
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

    this.setState({
      searchTerm: searchTerm,
      searchTracked: true
    });

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
          this.props.performSearch(_.pickBy(query), doneFn, this.searchFail);
        }
      } else {
        this.searchFail();
      }
    };

    this.props.performSearch(query, doneFn, this.searchFail);
  }

  performContextualSearch = (query, successFn) => {
    const doneFn = (res) => {
      if (res.ok) {
        successFn(res, query);
      } else {
        this.searchFail();
      }
    };

    this.props.performContextualSearch(query, doneFn, this.searchFail);
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
    e.preventDefault();

    if (this.props.channelChoice && this.props.chatOnline) {
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
    this.props.performSearch({
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

  handleArticleClick = (articleIndex, e) => {
    e.preventDefault();

    // TODO: Use updateActiveArticle action to update this state.
    // move from trackArticleView to here.
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
    this.props.updateActiveArticle();
  }

  getTrackPayload = () => {
    return {
      query: this.state.searchTerm,
      resultsCount: (this.state.resultsCount > 3) ? 3 : this.state.resultsCount,
      uniqueSearchResultClick: !this.props.articleClicked,
      articleId: this.state.activeArticle.id,
      locale: i18n.getLocale()
    };
  }

  handleOriginalArticleClick = () => {
    this.props.onViewOriginalArticleClick(this.getTrackPayload());
  }

  onContainerClick = () => {
    if (this.state.channelChoiceShown) {
      this.setChannelChoiceShown(false);
    }
  }

  updateImages = (img) => {
    this.setState({
      images: _.extend({}, this.state.images, img)
    });
  }

  renderResults = () => {
    const { showNextButton } = this.props;
    const hasSearched = this.state.hasSearched || this.state.hasContextualSearched;

    if (this.state.articleViewActive || !hasSearched) {
      return null;
    }

    const showViewMore = this.props.viewMoreEnabled &&
                         this.state.showViewMore &&
                         this.state.resultsCount > minimumSearchResults;
    const showBottomBorder = !this.props.fullscreen &&
                             !(!showNextButton && this.props.hideZendeskLogo);
    const applyPadding = !showNextButton && !this.props.hideZendeskLogo;

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
        showContactButton={showNextButton} />
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
        imagesSender={this.props.performImageSearch}
        updateStoredImages={this.updateImages}
        updateFrameSize={this.props.updateFrameSize}
        fullscreen={this.props.fullscreen} />
    );
  }

  renderHelpCenterDesktop = (buttonLabel) => {
    const shadowVisible = this.state.articleViewActive ||
                          this.state.articles.length > minimumSearchResults;

    return (
      <HelpCenterDesktop
        ref='helpCenterDesktop'
        notification={this.props.notification}
        chatOnline={this.props.chatOnline}
        getFrameDimensions={this.props.getFrameDimensions}
        handleOnChangeValue={this.handleOnChangeValue}
        handleNextClick={this.handleNextClick}
        search={this.search}
        showNextButton={this.props.showNextButton}
        hideZendeskLogo={this.props.hideZendeskLogo}
        isLoading={this.props.searchLoading}
        onNextClick={this.props.onNextClick}
        newDesign={this.props.newDesign}
        channelChoice={this.state.channelChoiceShown}
        talkAvailable={this.props.talkAvailable}
        articleViewActive={this.state.articleViewActive}
        hasSearched={this.state.hasSearched}
        buttonLabel={buttonLabel}
        formTitleKey={this.props.formTitleKey}
        searchFieldValue={this.state.searchFieldValue}
        shadowVisible={shadowVisible}
        updateFrameSize={this.props.updateFrameSize}
        hideChatNotification={this.props.hideChatNotification}
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
        handleOnChangeValue={this.handleOnChangeValue}
        handleNextClick={this.handleNextClick}
        search={this.search}
        isLoading={this.state.searchLoading}
        onNextClick={this.props.onNextClick}
        newDesign={this.props.newDesign}
        showNextButton={this.props.showNextButton}
        chatOnline={this.props.chatOnline}
        channelChoice={this.state.channelChoiceShown}
        talkAvailable={this.props.talkAvailable}
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
    } else if (this.props.chatOnline) {
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

const actionCreators = {
  updateActiveArticle,
  updateSearchTerm,
  performSearch,
  performImageSearch,
  performContextualSearch
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(HelpCenter);
