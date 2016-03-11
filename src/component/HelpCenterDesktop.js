import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

import { HelpCenterArticle } from 'component/HelpCenterArticle';
import { SearchField } from 'component/FormField';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { ScrollContainer } from 'component/ScrollContainer';
import { isMobileBrowser } from 'utility/devices';
import { i18n } from 'service/i18n';
import { Button,
         ButtonGroup } from 'component/Button';
import { beacon } from 'service/beacon';
import { bindMethods } from 'utility/utils';

export class HelpCenterDesktop extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, HelpCenterDesktop.prototype);

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

    if (this.state.fullscreen) {
      setTimeout(() => {
        searchField.blur();
      }, 1);
    }
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

  render() {
    const listClasses = classNames({
      'List': true,
      'u-isHidden': !this.state.articles.length || this.state.articleViewActive
    });
    const formLegendClasses = classNames({
      'u-paddingTT u-textSizeNml Arrange Arrange--middle u-textBody': true,
      'u-isHidden': !this.state.articles.length || this.state.articleViewActive
    });
    const articleClasses = classNames({
      'u-isHidden': !this.state.articleViewActive
    });
    const formClasses = classNames({
      'u-isHidden': this.state.articleViewActive || this.state.hasSearched
    });
    const buttonContainerClasses = classNames({
      'u-marginVM': this.props.hideZendeskLogo,
      'u-isHidden': !this.state.hasSearched
    });

    const articleTemplate = function(article, index) {
      return (
        <li key={_.uniqueId('article_')} className='List-item'>
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
    const onChangeValueHandler = (value) => {
      this.setState({ searchFieldValue: value });
    };
    const hideZendeskLogo = this.props.hideZendeskLogo;

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(), 0);
    }

    const noResultsTemplate = () => {
      const noResultsClasses = classNames({
        'u-marginTM u-textCenter u-textSizeMed': true,
        'u-borderBottom List--noResults': true
      });
      const noResultsParagraphClasses = classNames({
        'u-textSecondary u-marginBL': true
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
                      ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />
                      : null;

    const noResults = (!this.state.resultsCount && this.state.hasSearched)
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

        <SearchField
          ref='searchField'
          fullscreen={false}
          onFocus={onFocusHandler}
          onChangeValue={onChangeValueHandler}
          hasSearched={this.state.hasSearched}
          onSearchIconClick={this.manualSearch}
          isLoading={this.state.isLoading} />
      </form>
   );

   const headerContent = (!this.state.articleViewActive && this.state.hasSearched)
                       ? hcform
                       : null;

   const footerContent = (
     <div className={buttonContainerClasses}>
       <ButtonGroup rtl={i18n.isRTL()}>
         <Button
           fullscreen={this.state.fullscreen}
           label={this.state.buttonLabel}
           onClick={this.handleNextClick} />
       </ButtonGroup>
     </div>)

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          hideZendeskLogo={hideZendeskLogo}
          title={i18n.t(`embeddable_framework.launcher.label.${this.props.formTitleKey}`)}
          headerContent={headerContent}
          footerContent={footerContent}>

          <div className={formClasses}>
            {hcform}
          </div>

          <h1 className={formLegendClasses}>
            <span className='Arrange-sizeFill'>
              {resultsLegend}
            </span>
          </h1>
          <ul className={listClasses}>
            {_.chain(this.state.articles).take(3).map(articleTemplate.bind(this)).value()}
          </ul>

          {noResults}

          <div className={articleClasses}>
            <HelpCenterArticle
              activeArticle={this.state.activeArticle}
              fullscreen={this.state.fullscreen} />
          </div>
        </ScrollContainer>

        {zendeskLogo}
      </div>
    );
  }
}

HelpCenterDesktop.propTypes = {
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

HelpCenterDesktop.defaultProps = {
  buttonLabelKey: 'message',
  onSearch: () => {},
  showBackButton: () => {},
  onNextClick: () => {},
  hideZendeskLogo: false,
  updateFrameSize: false,
  style: null,
  formTitleKey: 'help'
};
