import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

import { HelpCenterForm } from 'component/HelpCenterForm';
import { HelpCenterArticle } from 'component/HelpCenterArticle';
import { SearchField,
         SearchFieldButton } from 'component/FormField';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { Container } from 'component/Container';
import { ScrollContainer } from 'component/ScrollContainer';
import { isMobileBrowser } from 'utility/devices';
import { i18n } from 'service/i18n';
import { Button,
         ButtonGroup } from 'component/Button';
import { beacon } from 'service/beacon';
import { bindMethods } from 'utility/utils';

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
      showIntroScreen: isMobileBrowser(),
      virtualKeyboardKiller: false,
      searchTracked: false,
      searchResultClicked: false,
      searchFieldFocused: false
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

    this.refs.scrollContainer.setScrollShadowVisible(this.state.articleViewActive);
  }

  focusField() {
    if (!this.state.fullscreen && !this.state.articleViewActive) {
      const searchFieldInputNode = ReactDOM.findDOMNode(this.refs.searchField.refs.searchFieldInput);
      const strLength = searchFieldInputNode.value.length;

      this.refs.searchField.focus();
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
    const hasSearchKey = (options.hasOwnProperty('search')
                          && options.search);
    const hasLabelsKey = (options.hasOwnProperty('labels')
                          && Array.isArray(options.labels)
                          && options.labels.length > 0);
    const query = {};

    let searchTerm;

    if (hasSearchKey) {
      searchTerm = query.query = options.search;
    } else if (hasLabelsKey) {
      searchTerm = query.label_names = options.labels.join(',');
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
      per_page: 3,
      origin: null
    });

    this.performSearch(query, successFn, false, true);
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
      per_page: 3,
      origin: 'web_widget'
    };

    this.setState(
      this.searchStartState({
        searchTerm: searchTerm,
        searchTracked: true
      })
    );

    this.performSearch(query, this.interactiveSearchSuccessFn, true);

    if (this.state.fullscreen) {
      setTimeout(() => {
        searchField.blur();
      }, 1);
    }
  }

  autoSearch() {
    const searchTerm = this.refs.searchField.getValue();

    if (_.isEmpty(searchTerm) ||
        !(searchTerm.length >= 5 && _.last(searchTerm) === ' ')) {
      return;
    }

    const query = {
      locale: i18n.getLocale(),
      query: searchTerm,
      per_page: 3,
      origin: null
    };

    this.setState(
      this.searchStartState({
        searchTerm: searchTerm,
        searchTracked: false
      })
    );

    this.performSearch(query, this.interactiveSearchSuccessFn, true);
  }

  updateResults(res) {
    const json = res.body;
    const articles = json.results;

    this.setState({
      articles: articles,
      resultsCount: json.count
    });
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

  performSearch(query, successFn, localeFallback, isContextual) {
    const searchFn = isContextual
                   ? this.props.performContextualSearchRequest
                   : this.props.performRegularSearchRequest;
    const doneFn = (res) => {
      if (res.ok) {
        if ((query.locale && res.body.count > 0) || !localeFallback) {
          successFn(res, query);
        } else if (localeFallback && query.locale) {
          this.performSearch(_.omit(query, 'locale'), successFn);
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

  handleNextClick(ev) {
    ev.preventDefault();
    this.props.onNextClick();
  }

  trackSearch() {
    /* eslint camelcase:0 */
    this.props.performRegularSearchRequest({
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

    beacon.track('helpCenter', 'click', 'helpCenterForm', trackPayload);

    this.setState({
      searchResultClicked: true
    });
  }

  searchBoxClickHandler() {
    this.setState({
      showIntroScreen: false
    });
  }

  render() {
    const listClasses = classNames({
      'List': true,
      'u-isHidden': !this.state.articles.length,
      'u-borderNone u-marginBS List--fullscreen': this.state.fullscreen
    });
    const listItemClasses = classNames({
      'List-item': true,
      'u-textSizeBaseMobile': this.state.fullscreen
    });
    const formLegendClasses = classNames({
      'u-paddingTT u-textSizeNml Arrange Arrange--middle u-textBody': true,
      'u-textSizeBaseMobile': this.state.fullscreen,
      'u-isHidden': !this.state.articles.length
    });
    const searchTitleClasses = classNames({
      'u-textSizeBaseMobile u-marginTM u-textCenter': true,
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

    const articleTemplate = function(article, index) {
      return (
        <li key={_.uniqueId('article_')} className={listItemClasses}>
          <a className='u-userTextColor'
            href={article.html_url}
            target='_blank'
            onClick={this.handleArticleClick.bind(this, index)}>
              {article.title || article.name}
          </a>
        </li>
      );
    };

    const onFocusHandler = () => {
      this.setState({ searchFieldFocused: true });
    };
    const onBlurHandler = () => {
      // defer event to allow onClick events to fire first
      setTimeout(() => {
        this.setState({
          searchFieldFocused: false
        });

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

    const noResultsTemplate = () => {
      const noResultsClasses = classNames({
        'u-marginTM u-textCenter u-textSizeMed': true,
        'u-textSizeBaseMobile': this.state.fullscreen,
        'u-borderBottom List--noResults': !this.state.fullscreen
      });
      const noResultsParagraphClasses = classNames({
        'u-textSecondary': true,
        'u-marginBL': !this.state.fullscreen
      });
      /* eslint indent:0 */
      const title = (this.state.searchFailed)
                  ? i18n.t('embeddable_framework.helpCenter.search.error.title')
                  : i18n.t('embeddable_framework.helpCenter.search.noResults.title', {
                      searchTerm: this.state.previousSearchTerm
                    });
      const body = (this.state.searchFailed)
                 ? i18n.t('embeddable_framework.helpCenter.search.error.body')
                 : i18n.t('embeddable_framework.helpCenter.search.noResults.body');

      return (
        <div className={noResultsClasses} id='noResults'>
          <p className='u-marginBN u-marginTL'>
            {title}
          </p>
          <p className={noResultsParagraphClasses}>
            {body}
          </p>
        </div>
      );
    };

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

    const noResults = (!this.state.showIntroScreen
                       && !this.state.resultsCount
                       && this.state.hasSearched)
                    ? noResultsTemplate()
                    : null;

    const resultsLegend = this.state.hasContextualSearched
                        ? i18n.t(
                            'embeddable_framework.helpCenter.label.topSuggestions',
                            { fallback: 'Top Suggestions' }
                          )
                        : i18n.t('embeddable_framework.helpCenter.label.results');

    return (
      <Container
        style={this.props.style}
        fullscreen={this.state.fullscreen}>
        <ScrollContainer
          ref='scrollContainer'
          hideZendeskLogo={hideZendeskLogo}
          title={i18n.t(`embeddable_framework.launcher.label.${this.props.formTitleKey}`)}
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
              <h1 className={searchTitleClasses}>
                {i18n.t('embeddable_framework.helpCenter.label.searchHelpCenter')}
              </h1>

              {searchFieldButton || introSearchField}

              <div className={linkClasses}>
                <p className='u-marginBN'>{linkContext}</p>
                <a className='u-userTextColor' onClick={this.handleNextClick}>
                  {linkLabel}
                </a>
              </div>

              <h1 className={formLegendClasses}>
                <span className='Arrange-sizeFill'>
                  {resultsLegend}
                </span>
              </h1>

              {noResults}
              <ul className={listClasses}>
                {_.chain(this.state.articles).take(3).map(articleTemplate.bind(this)).value()}
              </ul>
            </HelpCenterForm>
          </div>

          <div className={articleClasses}>
            <HelpCenterArticle
              activeArticle={this.state.activeArticle}
              fullscreen={this.state.fullscreen} />
          </div>
        </ScrollContainer>

        {zendeskLogo}
      </Container>
    );
  }
}

HelpCenter.propTypes = {
  performRegularSearchRequest: PropTypes.func.isRequired,
  performContextualSearchRequest: PropTypes.func.isRequired,
  buttonLabelKey: PropTypes.string,
  onSearch: PropTypes.func,
  showBackButton: PropTypes.func,
  onNextClick: PropTypes.func,
  hideZendeskLogo: PropTypes.bool,
  updateFrameSize: PropTypes.any,
  style: PropTypes.object,
  formTitleKey: PropTypes.string
};

HelpCenter.defaultProps = {
  buttonLabelKey: 'message',
  onSearch: () => {},
  showBackButton: () => {},
  onNextClick: () => {},
  hideZendeskLogo: false,
  updateFrameSize: false,
  style: null,
  formTitleKey: 'help'
};
