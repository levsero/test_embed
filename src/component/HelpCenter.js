import React from 'react/addons';
import _     from 'lodash';

import { transport }         from 'service/transport';
import { stopWordsFilter }   from 'mixin/searchFilter';
import { HelpCenterForm }    from 'component/HelpCenterForm';
import { HelpCenterArticle } from 'component/HelpCenterArticle';
import { SearchField }       from 'component/FormField';
import { ZendeskLogo }       from 'component/ZendeskLogo';
import { Container }         from 'component/Container';
import { ScrollContainer }   from 'component/ScrollContainer';
import { isMobileBrowser }   from 'utility/devices';
import { i18n }              from 'service/i18n';
import { Button,
         ButtonGroup }       from 'component/Button';
import { beacon }            from 'service/beacon';

var classSet = React.addons.classSet;

export var HelpCenter = React.createClass({
  getInitialState() {
    return {
      articles: [],
      resultsCount: 0,
      searchTerm: '',
      buttonLabel: i18n.t('embeddable_framework.helpCenter.submitButton.label.submitTicket'),
      fullscreen: isMobileBrowser(),
      previousSearchTerm: '',
      hasSearched: false,
      searchFailed: false,
      articleViewActive: false,
      activeArticle: {},
      removeSearchField: false,
      searchTracked: false,
      searchResultClicked: false
    };
  },

  componentDidUpdate() {
    if (this.refs.searchField) {
      this.refs.searchField.setState({
        searchInputVal: this.state.searchFieldValue
      });
    }
  },

  focusField() {
    if (!isMobileBrowser()) {
      this.refs.searchField.focus();
    }
  },

  resetSearchFieldState() {
    // if the user closes and reopens, we need to
    // re-render the search field
    this.setState({
      removeSearchField: false
    });
  },

  hideVirtualKeyboard() {
    if (isMobileBrowser()) {
      // in order for the virtual keyboard to hide,
      // we need to remove the element from the DOM
      this.setState({
        removeSearchField: true
      });
    }
  },

  getViewAllUrl() {
    return `https://${this.props.zendeskHost}/hc/search?query=${this.state.searchTerm}`;
  },

  handleSubmit(e) {
    e.preventDefault();
    this.handleSearch(true);
  },

  updateResults(res) {
    var json = res.body,
        articles = json.results;

    this.setState({
      articles: articles,
      resultsCount: json.count,
      isLoading: false,
      previousSearchTerm: this.state.searchTerm,
      hasSearched: true,
      searchFailed: false
    });
  },

  searchFail() {
    this.setState({
      isLoading: false,
      previousSearchTerm: this.state.searchTerm,
      hasSearched: true,
      searchFailed: true
    });
  },

  performSearch(searchString, forceSearch) {
    var search = (searchString, locale) => {
          transport.send({
            method: 'get',
            path: '/api/v2/help_center/search.json',
            query: {
              locale: locale,
              query: searchString,
              origin: forceSearch ? 'web_widget' : null
            },
            callbacks: {
              done: (res) => {
                if (res.ok) {
                  if ((locale && res.body.count > 0) || !locale) {
                    this.updateResults(res);
                  } else {
                    search(searchString);
                  }
                } else {
                  this.searchFail();
                }
              },
              fail: () => this.searchFail()
            }
          });
        };

    this.props.onSearch(searchString);
    this.setState({
      isLoading: true,
      searchTerm: searchString,
      searchTracked: forceSearch,
      searchResultClicked: false
    });

    search(searchString, i18n.getLocale());
  },

  handleSearch(forceSearch) {
    var filteredStr,
        searchString = this.refs.searchField.getValue();

    if (_.isEmpty(searchString)) {
      return;
    }

    if (searchString.length >= 5 && _.last(searchString) === ' ' || forceSearch) {
      filteredStr = stopWordsFilter(searchString);

      if (filteredStr !== '') {
        this.performSearch(filteredStr, forceSearch);
      }
    }
  },

  searchNoResultsTitle() {
    if (this.state.searchFailed) {
      return i18n.t('embeddable_framework.helpCenter.search.error.title', {
        fallback: 'Sorry, no results available at the moment'
      });
    } else {
      return i18n.t('embeddable_framework.helpCenter.search.noResults.title', {
        searchTerm: this.state.previousSearchTerm,
        fallback: `Uh oh, there are no results for "${this.state.previousSearchTerm}"`
      });
    }
  },

  searchNoResultsBody() {
    if (this.state.searchFailed) {
      return i18n.t('embeddable_framework.helpCenter.search.error.body', {
        fallback: 'Use the button below to send us a message'
      });
    } else {
      return i18n.t('embeddable_framework.helpCenter.search.noResults.body', {
        fallback: 'Try searching for something else'
      });
    }
  },

  handleArticleClick(articleIndex, e) {
    e.preventDefault();

    this.setState({
      activeArticle: this.state.articles[articleIndex],
      articleViewActive: true
    });

    this.trackArticleView(articleIndex);

    this.props.showBackButton();

    if (!this.state.searchTracked) {
      this.trackSearch();
    }
  },

  trackSearch() {
    transport.send({
      method: 'get',
      path: '/api/v2/help_center/search.json',
      query: {
        query: this.state.searchTerm,
        origin: 'web_widget'
      }
    });

    this.setState({
      searchTracked: true
    });
  },

  /**
   * Instrument the last auto-search, if it's still pending to be instrumented
   */
  backtrackSearch() {
    if (!this.state.searchTracked && this.state.searchTerm) {
      this.trackSearch();
    }
  },

  trackArticleView(articleIndex) {
    var trackPayload = {
      query: this.state.searchTerm,
      resultsCount: this.state.resultsCount > 3 ? 3 : this.state.resultsCount,
      uniqueSearchResultClick: !this.state.searchResultClicked,
      articleId: this.state.articles[articleIndex].id,
      locale: i18n.getLocale()
    };

    beacon.track('helpCenter', 'click', 'helpCenterForm', trackPayload);

    this.setState({
      searchResultClicked: true
    });
  },

  render() {
    /* jshint quotmark:false */
    var articleTemplate = function(article, index) {
        return (
            /* jshint camelcase:false */
            <li key={_.uniqueId('article_')} className={listItemClasses}>
              <a className='u-userTextColor'
                 href={article.html_url}
                 target='_blank'
                 onClick={this.handleArticleClick.bind(this, index)}>
                  {article.title || article.name}
              </a>
            </li>
            );
        },
        listClasses = classSet({
          'List': true,
          'u-isHidden': !this.state.articles.length,
          'u-borderNone u-marginBS List--fullscreen': this.state.fullscreen
        }),
        listItemClasses = classSet({
          'List-item': true,
          'u-textSizeMed': !this.state.fullscreen,
          'u-textSizeBaseMobile': this.state.fullscreen
        }),
        formLegendClasses = classSet({
          'u-paddingTT u-textSizeMed Arrange Arrange--middle u-textBody': true,
          'u-textSizeBaseMobile': this.state.fullscreen,
          'u-isHidden': !this.state.articles.length
        }),
        noResultsClasses = classSet({
          'u-marginTM u-textCenter u-textSizeMed': true,
          'u-isHidden': this.state.resultsCount || !this.state.hasSearched,
          'u-textSizeBaseMobile': this.state.fullscreen,
          'u-borderBottom List--noResults': !this.state.fullscreen
        }),
        linkClasses = classSet({
          'u-textSizeBaseMobile u-textCenter u-marginTL': true,
          'u-isHidden': !this.state.fullscreen || this.state.hasSearched
        }),
        noResultsParagraphClasses = classSet({
          'u-textSecondary': true,
          'u-marginBL': !this.state.fullscreen
        }),
        articleClasses = classSet({
          'u-isHidden': !this.state.articleViewActive
        }),
        formClasses = classSet({
          'u-isHidden': this.state.articleViewActive
        }),
        buttonContainerClasses = classSet({
          //'u-borderTop u-paddingTM': this.state.articleViewActive,
          'u-marginTA': this.state.fullscreen,
          'u-isHidden': !this.state.hasSearched
        }),
        linkLabel,
        linkContext,
        onFocusHandler = function() {
          this.setState({searchFieldFocused: true});
        }.bind(this),
        onUpdateHandler = (value) => {
          this.setState({
            searchFieldValue: value
          });
        },
        chatButtonLabel = i18n.t('embeddable_framework.helpCenter.submitButton.label.chat'),
        mobileArticleViewActive = this.state.fullscreen && this.state.articleViewActive,
        hideZendeskLogo = this.props.hideZendeskLogo || mobileArticleViewActive,
        zendeskLogo,
        searchField;

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(), 0);
    }

    if (this.state.buttonLabel === chatButtonLabel) {
      linkContext = i18n.t('embeddable_framework.helpCenter.label.linkContext.chat');
      linkLabel = i18n.t('embeddable_framework.helpCenter.label.link.chat');
    } else {
      linkContext = i18n.t('embeddable_framework.helpCenter.label.linkContext.submitTicket');
      linkLabel = i18n.t('embeddable_framework.helpCenter.submitButton.label.submitTicket');
    }

    /* jshint laxbreak: true */
    zendeskLogo = hideZendeskLogo
                ? null
                : <ZendeskLogo rtl={i18n.isRTL()} fullscreen={this.state.fullscreen} />;

    searchField = this.state.removeSearchField
                ? null
                : <SearchField
                    ref='searchField'
                    fullscreen={this.state.fullscreen}
                    onFocus={onFocusHandler}
                    onUpdate={onUpdateHandler}
                    hasSearched={this.state.hasSearched}
                    onSearchIconClick={this.handleSearch}
                    isLoading={this.state.isLoading} />;

    return (
      /* jshint laxbreak: true */
      <Container
        fullscreen={this.state.fullscreen}>
        <ScrollContainer
          header={i18n.t('embeddable_framework.launcher.label.help')}
          headerContent={
            this.state.hasSearched &&
            !this.state.articleViewActive &&
            searchField
          }
          footer={
            <div className={buttonContainerClasses}>
              <ButtonGroup rtl={i18n.isRTL()}>
                <Button
                  fullscreen={this.state.fullscreen}
                  label={this.state.buttonLabel}
                  handleClick={this.props.onButtonClick} />
              </ButtonGroup>
            </div>
          }
          fullscreen={this.state.fullscreen}
        >
          <div className={formClasses}>
            <HelpCenterForm
              ref='helpCenterForm'
              onSearch={this.handleSearch}
              onSubmit={this.handleSubmit}>
              {!this.state.hasSearched && searchField}
              <div className={linkClasses}>
                <p className='u-marginBN'>{linkContext}</p>
                <a className='u-userTextColor' onClick={this.props.onButtonClick}>
                  {linkLabel}
                </a>
              </div>
              <h1 className={formLegendClasses}>
                <span className='Arrange-sizeFill'>
                  {i18n.t('embeddable_framework.helpCenter.label.results')}
                </span>
              </h1>
              <div className={noResultsClasses} id='noResults'>
                <p className='u-marginBN u-marginTL'>
                  {this.searchNoResultsTitle()}
                </p>
                <p className={noResultsParagraphClasses}>
                  {this.searchNoResultsBody()}
                </p>
              </div>
              <ul className={listClasses}>
                {_.chain(this.state.articles).first(3).map(articleTemplate.bind(this)).value()}
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
});
