import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import { HelpCenterArticle } from 'component/HelpCenterArticle';
import { SearchField,
         SearchFieldButton } from 'component/FormField';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { ScrollContainer } from 'component/ScrollContainer';
import { isMobileBrowser } from 'utility/devices';
import { i18n } from 'service/i18n';
import { Button,
         ButtonGroup } from 'component/Button';
import { beacon } from 'service/beacon';
import { bindMethods } from 'utility/utils';

export class HelpCenterMobile extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, HelpCenterMobile.prototype);

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

  resetSearchFieldState() {
    // if the user closes and reopens, we need to
    // re-render the search field
    this.setState({
      virtualKeyboardKiller: false
    });
  }

  hideVirtualKeyboard() {
    // in order for the virtual keyboard to hide in iOS 7,
    // we need to remove the element from the DOM. It has been fixed
    // in iOS 8.
    this.setState({
      virtualKeyboardKiller: true
    });
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

    this.performSearch(query, successFn, { isContextual: true });
  }

  manualSearch(e) {
    /* eslint camelcase:0 */
    e.preventDefault();

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

    this.performSearch(query, this.interactiveSearchSuccessFn, { localeFallback: true });

    setTimeout(() => {
      searchField.blur();
    }, 1);
  }

  autoSearch(e) {
    e.preventDefault();

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

    this.performSearch(query, this.interactiveSearchSuccessFn, { localeFallback: true });
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
      'List u-borderNone u-marginBS List--fullscreen': true,
      'u-isHidden': !this.state.articles.length || this.state.articleViewActive
    });
    const listItemClasses = classNames({
      'List-item u-textSizeBaseMobile': true
    });
    const formLegendClasses = classNames({
      'u-paddingTT u-textSizeNml Arrange Arrange--middle u-textBody u-textSizeBaseMobile': true,
      'u-isHidden': !this.state.articles.length || this.state.articleViewActive
    });
    const searchTitleClasses = classNames({
      'u-textSizeBaseMobile u-marginTM u-textCenter': true,
      'Container--fullscreen-center-vert': true,
      'u-isHidden': !this.state.showIntroScreen
    });
    const linkClasses = classNames({
      'u-textSizeBaseMobile u-textCenter u-marginTL': true,
      'u-isHidden': !this.state.showIntroScreen
    });
    const articleClasses = classNames({
      'u-isHidden': !this.state.articleViewActive
    });
    const formClasses = classNames({
      'u-isHidden': this.state.articleViewActive || !this.state.showIntroScreen
    });
    const buttonContainerClasses = classNames({
      'u-marginTA': true,
      'u-marginVM': this.props.hideZendeskLogo,
      'u-isHidden': this.state.showIntroScreen || this.state.searchFieldFocused
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

        if (!this.state.hasSearched && !this.state.isLoading) {
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
    const mobileHideLogoState = this.state.hasSearched;
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
        'u-textSizeBaseMobile': true
      });
      const noResultsParagraphClasses = classNames({
        'u-textSecondary': true
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
                      ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={true} />
                      : null;

    const searchField = (!this.state.virtualKeyboardKiller)
                      ? <SearchField
                          ref='searchField'
                          fullscreen={true}
                          onFocus={onFocusHandler}
                          onBlur={onBlurHandler}
                          onChangeValue={onChangeValueHandler}
                          hasSearched={this.state.hasSearched}
                          onSearchIconClick={this.manualSearch}
                          isLoading={this.state.isLoading} />
                      : null;

    const searchFieldButton = this.state.showIntroScreen
                            ? <SearchFieldButton
                                ref='searchFieldButton'
                                onClick={this.searchBoxClickHandler}
                                onTouch={this.searchBoxClickHandler}
                                searchTerm={this.state.searchFieldValue} />
                             : null;

    const noResults = (!this.state.showIntroScreen && !this.state.resultsCount && this.state.hasSearched)
                    ? noResultsTemplate()
                    : null;

    const resultsLegend = this.state.hasContextualSearched
                        ? i18n.t('embeddable_framework.helpCenter.label.topSuggestions')
                        : i18n.t('embeddable_framework.helpCenter.label.results');

   const hcform = (
      <form
        ref='helpCenterForm'
        className='Form u-cf'
        onChange={this.autoSearch}
        onSubmit={this.manualSearch}>
        <h1 className={searchTitleClasses}>
          {i18n.t('embeddable_framework.helpCenter.label.searchHelpCenter')}
        </h1>

        {searchFieldButton || searchField}
      </form>
    );

   const headerContent = (!this.state.articleViewActive && !this.state.showIntroScreen)
                       ? hcform
                       : null;

   const footerContent = (
      <div className={buttonContainerClasses}>
        <ButtonGroup rtl={i18n.isRTL()}>
          <Button
            fullscreen={true}
            label={this.state.buttonLabel}
            onClick={this.handleNextClick} />
        </ButtonGroup>
      </div>);

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          hideZendeskLogo={hideZendeskLogo}
          title={i18n.t(`embeddable_framework.launcher.label.${this.props.formTitleKey}`)}
          headerContent={headerContent}
          footerContent={footerContent}
          fullscreen={true}
          isVirtualKeyboardOpen={this.state.searchFieldFocused}>

          <div className={formClasses}>
            {hcform}
            <div className={linkClasses}>
              <p className='u-marginBN'>{linkContext}</p>
              <a className='u-userTextColor' onClick={this.handleNextClick}>
                {linkLabel}
              </a>
            </div>
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

          <div className={articleClasses}>
            <HelpCenterArticle
              activeArticle={this.state.activeArticle}
              fullscreen={true} />
          </div>
        </ScrollContainer>

        {zendeskLogo}
      </div>
    );
  }
}

HelpCenterMobile.propTypes = {
  searchSender: PropTypes.func.isRequired,
  contextualSearchSender: PropTypes.func.isRequired,
  buttonLabelKey: PropTypes.string,
  onSearch: PropTypes.func,
  showBackButton: PropTypes.func,
  onNextClick: PropTypes.func,
  hideZendeskLogo: PropTypes.bool,
  updateFrameSize: PropTypes.any,
  style: PropTypes.object,
  formTitleKey: PropTypes.string
};

HelpCenterMobile.defaultProps = {
  buttonLabelKey: 'message',
  onSearch: () => {},
  showBackButton: () => {},
  onNextClick: () => {},
  hideZendeskLogo: false,
  updateFrameSize: false,
  style: null,
  formTitleKey: 'help'
};
