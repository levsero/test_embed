import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { Button,
         ButtonGroup } from 'component/Button';
import { SearchFieldButton } from 'component/button/SearchFieldButton';
import { Container } from 'component/Container';
import { SearchField } from 'component/field/SearchField';
import { HelpCenterArticle } from 'component/HelpCenterArticle';
import { HelpCenterForm } from 'component/HelpCenterForm';
import { HelpCenterResults } from 'component/HelpCenterResults';
import { ScrollContainer } from 'component/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
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
      fullscreen: isMobileBrowser(),
      previousSearchTerm: '',
      hasSearched: false,
      hasContextualSearched: false,
      searchFailed: false,
      articleViewActive: false,
      activeArticle: {},
      images: {},
      showIntroScreen: isMobileBrowser(),
      virtualKeyboardKiller: false,
      searchTracked: false,
      searchResultClicked: false,
      searchFieldFocused: false,
      resultsPerPage: minimumSearchResults,
      showViewMore: true,
      viewMoreActive: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showIntroScreen === true &&
        this.state.showIntroScreen === false &&
        this.state.hasContextualSearched === false) {
      this.refs.searchField.focus();
    }

    if (this.refs.searchField) {
      this.refs.searchField.setState({
        searchInputVal: this.state.searchFieldValue
      });
    }

    const shadowVisible = this.state.articleViewActive || this.state.articles.length > minimumSearchResults;

    this.refs.scrollContainer.setScrollShadowVisible(shadowVisible);
  }

  focusField() {
    if (!this.state.fullscreen && !this.state.articleViewActive) {
      const searchField = this.refs.searchField;
      const searchFieldInputNode = searchField.getSearchField();
      const strLength = searchFieldInputNode.value.length;

      searchField.focus();
      if (searchFieldInputNode.setSelectionRange) {
        searchFieldInputNode.setSelectionRange(strLength, strLength);
      }
    }
  }

  resetSearchFieldState() {
    // if the user closes and reopens, we need to
    // re-render the search field
    this.setState({
      virtualKeyboardKiller: false
    });
  }

  hideVirtualKeyboard() {
    if (this.state.fullscreen) {
      // in order for the virtual keyboard to hide in iOS 7,
      // we need to remove the element from the DOM. It has been fixed
      // in iOS 8.
      this.setState({
        virtualKeyboardKiller: true
      });
    }
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
    this.focusField();
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
            showIntroScreen: false,
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

  manualSearch() {
    /* eslint camelcase:0 */
    const searchField = this.refs.searchField;
    const searchTerm = searchField.getValue();

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

  autoSearch() {
    const searchTerm = this.refs.searchField.getValue();

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

  performSearch(query, successFn, options = {}) {
    const isContextual = !!options.isContextual;
    const searchFn = isContextual
                   ? this.props.contextualSearchSender
                   : this.props.searchSender;
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
    if (!this.state.searchTracked && this.state.searchTerm && !this.state.hasContextualSearched) {
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

  searchBoxClickHandler() {
    this.setState({
      showIntroScreen: false
    });
  }

  updateImages(img) {
    this.setState({
      images: _.extend({}, this.state.images, img)
    });
  }

  render() {
    const searchTitleClasses = classNames({
      'u-textSizeBaseMobile u-marginTM u-textCenter u-textBold': true,
      'Container--fullscreen-center-vert': true,
      'u-isHidden': !this.state.fullscreen || !this.state.showIntroScreen
    });
    const linkClasses = classNames({
      'u-textSizeBaseMobile u-textCenter u-marginTL': true,
      'u-isHidden': !this.state.showIntroScreen
    });
    const articleClasses = classNames({
      'u-isHidden': !this.state.articleViewActive
    });
    const formClasses = classNames({
      'u-isHidden': this.state.articleViewActive
    });
    const buttonContainerClasses = classNames({
      'u-marginTA': this.state.fullscreen,
      'u-marginVM': this.props.hideZendeskLogo,
      'u-isHidden': this.state.showIntroScreen ||
                    (this.state.fullscreen && this.state.searchFieldFocused) ||
                    (!this.state.fullscreen && !this.state.hasSearched)
    });

    const onFocusHandler = () => {
      this.setState({ searchFieldFocused: true });
    };
    const onBlurHandler = () => {
      // defer event to allow onClick events to fire first
      setTimeout(() => {
        if (this.state.fullscreen) {
          this.setState({
            searchFieldFocused: false
          });
        }

        if (this.state.fullscreen && !this.state.hasSearched && !this.state.isLoading) {
          this.setState({
            showIntroScreen: true
          });
        }
      }, 1);
    };
    const onChangeValueHandler = (value) => {
      this.setState({ searchFieldValue: value });
    };
    const chatButtonLabel = i18n.t('embeddable_framework.helpCenter.submitButton.label.chat');
    const mobileHideLogoState = this.state.fullscreen && this.state.hasSearched;
    const hideZendeskLogo = this.props.hideZendeskLogo || mobileHideLogoState;

    let linkLabel, linkContext;

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(), 0);
    }

    if (this.state.buttonLabel === chatButtonLabel) {
      linkContext = i18n.t('embeddable_framework.helpCenter.label.linkContext.chat');
      linkLabel = i18n.t('embeddable_framework.helpCenter.label.link.chat');
    } else {
      linkContext = i18n.t('embeddable_framework.helpCenter.label.linkContext.submitTicket');
      linkLabel = i18n.t(
        `embeddable_framework.helpCenter.submitButton.label.submitTicket.${
          this.props.buttonLabelKey
        }`
      );
    }

    const zendeskLogo = !hideZendeskLogo
                      ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={this.state.fullscreen} />
                      : null;

    const searchField = (!this.state.virtualKeyboardKiller)
                      ? <SearchField
                          ref='searchField'
                          fullscreen={this.state.fullscreen}
                          onFocus={onFocusHandler}
                          onBlur={onBlurHandler}
                          onChangeValue={onChangeValueHandler}
                          hasSearched={this.state.hasSearched}
                          onSearchIconClick={this.manualSearch}
                          disableAutoSearch={this.props.disableAutoSearch}
                          isLoading={this.state.isLoading} />
                      : null;

    // intro search field on DESKTOP
    const introSearchField = (!this.state.fullscreen && !this.state.hasSearched)
                           ? searchField
                           : null;

    // intro search field *button* on MOBILE
    const searchFieldButton = (this.state.fullscreen && this.state.showIntroScreen)
                                  ? <SearchFieldButton
                                      ref='searchFieldButton'
                                      disableAutoSearch={this.props.disableAutoSearch}
                                      onClick={this.searchBoxClickHandler}
                                      onTouch={this.searchBoxClickHandler}
                                      searchTerm={this.state.searchFieldValue} />
                                  : null;

    const headerContent = (!this.state.articleViewActive
                           && (!this.state.fullscreen && this.state.hasSearched
                               || this.state.fullscreen && !this.state.showIntroScreen))
                        ? <HelpCenterForm
                            onSubmit={this.manualSearch}
                            onChange={this.autoSearch}
                            children={searchField} />
                        : null;

    const showViewMore = this.state.showViewMore && this.state.resultsCount > minimumSearchResults;

    const results = this.state.hasSearched || this.state.hasContextualSearched
                  ? <HelpCenterResults
                      fullscreen={this.state.fullscreen}
                      articles={this.state.articles}
                      showViewMore={showViewMore}
                      searchFailed={this.state.searchFailed}
                      previousSearchTerm={this.state.previousSearchTerm}
                      handleArticleClick={this.handleArticleClick}
                      handleViewMoreClick={this.handleViewMoreClick}
                      hasContextualSearched={this.state.hasContextualSearched} />
                  : null;

    return (
      <Container
        style={this.props.style}
        fullscreen={this.state.fullscreen}>
        <ScrollContainer
          ref='scrollContainer'
          hideZendeskLogo={hideZendeskLogo}
          title={i18n.t(`embeddable_framework.helpCenter.form.title.${this.props.formTitleKey}`)}
          headerContent={headerContent}
          footerContent={
            <div className={buttonContainerClasses}>
              <ButtonGroup rtl={i18n.isRTL()}>
                <Button
                  fullscreen={this.state.fullscreen}
                  label={this.state.buttonLabel}
                  onClick={this.handleNextClick} />
              </ButtonGroup>
            </div>
          }
          fullscreen={this.state.fullscreen}
          isVirtualKeyboardOpen={this.state.searchFieldFocused}>
          <div className={formClasses}>
            <HelpCenterForm
              ref='helpCenterForm'
              onChange={this.autoSearch}
              onSubmit={this.manualSearch}>
              <div className={searchTitleClasses}>
                {i18n.t('embeddable_framework.helpCenter.label.searchHelpCenter')}
              </div>

              {searchFieldButton || introSearchField}

              <div className={linkClasses}>
                <p className='u-marginBN'>{linkContext}</p>
                <a className='u-userTextColor' onClick={this.handleNextClick}>
                  {linkLabel}
                </a>
              </div>

              {results}

            </HelpCenterForm>
          </div>

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
        </ScrollContainer>

        {zendeskLogo}
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
