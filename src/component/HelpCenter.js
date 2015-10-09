import React from 'react/addons';
import _     from 'lodash';

import { transport }         from 'service/transport';
import { stopWordsFilter }   from 'mixin/searchFilter';
import { HelpCenterForm }    from 'component/HelpCenterForm';
import { HelpCenterArticle } from 'component/HelpCenterArticle';
import { SearchField,
         SearchFieldButton } from 'component/FormField';
import { ZendeskLogo }       from 'component/ZendeskLogo';
import { Container }         from 'component/Container';
import { ScrollContainer }   from 'component/ScrollContainer';
import { isMobileBrowser }   from 'utility/devices';
import { i18n }              from 'service/i18n';
import { Button,
         ButtonGroup }       from 'component/Button';
import { beacon }            from 'service/beacon';

const classSet = React.addons.classSet;

export const HelpCenter = React.createClass({
  getInitialState() {
    /* jshint maxlen:false */
    // jscs:disable  maximumLineLength
    return {
      articles: [],
      resultsCount: 0,
      searchTerm: '',
      buttonLabel: i18n.t(`embeddable_framework.helpCenter.submitButton.label.submitTicket.${this.props.buttonLabelKey}`),
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
      searchResultClicked: false
    };
  },

  getDefaultProps() {
    return {
      buttonLabelKey: 'message',
      formTitleKey: 'help'
    };
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showIntroScreen === true &&
        this.state.showIntroScreen === false) {
      this.refs.searchField.focus();
    }

    if (this.refs.searchField) {
      this.refs.searchField.setState({
        searchInputVal: this.state.searchFieldValue
      });
    }

    this.refs.scrollContainer.setScrollShadowVisible(this.state.articleViewActive);
  },

  focusField() {
    if (!this.state.fullscreen && !this.state.articleViewActive) {
      const searchFieldInputNode = this.refs.searchField.refs.searchFieldInput.getDOMNode();
      const strLength = searchFieldInputNode.value.length;

      this.refs.searchField.focus();
      if (searchFieldInputNode.setSelectionRange) {
        searchFieldInputNode.setSelectionRange(strLength, strLength);
      }
    }
  },

  resetSearchFieldState() {
    // if the user closes and reopens, we need to
    // re-render the search field
    this.setState({
      virtualKeyboardKiller: false
    });
  },

  hideVirtualKeyboard() {
    if (this.state.fullscreen) {
      // in order for the virtual keyboard to hide,
      // we need to remove the element from the DOM
      this.setState({
        virtualKeyboardKiller: true
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
    const json = res.body;
    const articles = json.results;

    this.setState({
      articles: articles,
      resultsCount: json.count
    });

    this.focusField();
  },

  searchFail() {
    this.setState({
      isLoading: false,
      previousSearchTerm: this.state.searchTerm,
      hasSearched: true,
      searchFailed: true
    });

    this.focusField();
  },

  contextualSearch(options) {
    let payload = {};

    /* jshint laxbreak: true */
    /* jshint camelcase: false */
    if (options.hasOwnProperty('search') && options.search) {
      payload.query = options.search;
    } else if (options.hasOwnProperty('labels')
                && Array.isArray(options.labels)
                && options.labels.length > 0) {
      payload.label_names = options.labels.join(',');
    } else {
      return;
    }

    transport.send({
      method: 'get',
      path: '/api/v2/help_center/search.json',
      query: _.extend({
          locale: i18n.getLocale(),
          per_page: 3,
          origin: null
        },
        payload
      ),
      callbacks: {
        done: (res) => {
          if (res.ok && res.body.count > 0) {
            this.setState({
              isLoading: false,
              searchTerm: (payload.query)
                        ? payload.query
                        : payload.label_names,
              hasSearched: true,
              searchFailed: false,
              showIntroScreen: false,
              hasContextualSearched: true,
              previousSearchTerm: this.state.searchTerm,
              searchResultClicked: false
            });
            this.updateResults(res);
          }
        }
      }
    });
  },

  performSearch(searchString, forceSearch) {
    const search = (searchString, locale) => {
      transport.send({
        method: 'get',
        path: '/api/v2/help_center/search.json',
        /* jshint camelcase:false */
        query: {
          locale: locale,
          query: searchString,
          per_page: 3,
          origin: forceSearch ? 'web_widget' : null
        },
        callbacks: {
          done: (res) => {
            if (res.ok) {
              if ((locale && res.body.count > 0) || !locale) {
                this.setState({
                  isLoading: false,
                  hasSearched: true,
                  searchFailed: false,
                  hasContextualSearched: false,
                  previousSearchTerm: this.state.searchTerm
                });
                this.props.onSearch({searchString: searchString, searchLocale: locale});
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

    this.setState({
      isLoading: true,
      searchTerm: searchString,
      searchTracked: forceSearch,
      searchResultClicked: false
    });

    search(searchString, i18n.getLocale());
  },

  handleSearch(forceSearch) {
    const searchString = this.refs.searchField.getValue();

    if (_.isEmpty(searchString)) {
      return;
    }

    if (searchString.length >= 5 && _.last(searchString) === ' ' || forceSearch) {
      const filteredStr = stopWordsFilter(searchString);

      if (filteredStr !== '') {
        this.performSearch(filteredStr, forceSearch);
      }
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

    if (!this.state.searchTracked && !this.state.hasContextualSearched) {
      this.trackSearch();
    }
  },

  handleNextClick(ev) {
    ev.preventDefault();
    this.props.onNextClick();
  },

  trackSearch() {
    transport.send({
      method: 'get',
      path: '/api/v2/help_center/search.json',
      /* jshint camelcase:false */
      query: {
        query: this.state.searchTerm,
        per_page: 0,
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
    if (!this.state.searchTracked && this.state.searchTerm && !this.state.hasContextualSearched) {
      this.trackSearch();
    }
  },

  trackArticleView(articleIndex) {
    const trackPayload = {
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

  searchBoxClickHandler() {
    this.setState({
      showIntroScreen: false
    });
  },

  render() {
    /* jshint quotmark:false */
    const listClasses = classSet({
      'List': true,
      'u-isHidden': !this.state.articles.length,
      'u-borderNone u-marginBS List--fullscreen': this.state.fullscreen
    });
    const listItemClasses = classSet({
      'List-item': true,
      'u-textSizeBaseMobile': this.state.fullscreen
    });
    const formLegendClasses = classSet({
      'u-paddingTT u-textSizeNml Arrange Arrange--middle u-textBody': true,
      'u-textSizeBaseMobile': this.state.fullscreen,
      'u-isHidden': !this.state.articles.length
    });
    const searchTitleClasses = classSet({
      'u-textSizeBaseMobile u-marginTM u-textCenter': true,
      'Container--fullscreen-center-vert': true,
      'u-isHidden': !this.state.fullscreen || !this.state.showIntroScreen
    });
    const linkClasses = classSet({
      'u-textSizeBaseMobile u-textCenter u-marginTL': true,
      'u-isHidden': !this.state.showIntroScreen
    });
    const articleClasses = classSet({
      'u-isHidden': !this.state.articleViewActive
    });
    const formClasses = classSet({
      'u-isHidden': this.state.articleViewActive
    });
    const buttonContainerClasses = classSet({
      'u-marginTA': this.state.fullscreen,
      'u-marginVM': this.props.hideZendeskLogo,
      'u-isHidden': this.state.showIntroScreen ||
                    (!this.state.fullscreen && !this.state.hasSearched)
    });

    const articleTemplate = function(article, index) {
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
    };

    const onFocusHandler = () => {
      this.setState({ searchFieldFocused: true });
    };
    const onBlurHandler = () => {
      if (this.state.fullscreen && !this.state.hasSearched) {
        this.setState({
          showIntroScreen: true
        });
      }
    };
    const onChangeValueHandler = (value) => {
      this.setState({ searchFieldValue: value });
    };
    const chatButtonLabel = i18n.t('embeddable_framework.helpCenter.submitButton.label.chat');
    const mobileHideLogoState = this.state.fullscreen && this.state.hasSearched;
    const hideZendeskLogo = this.props.hideZendeskLogo || mobileHideLogoState;

    let linkLabel,
        linkContext;

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
      const noResultsClasses = classSet({
        'u-marginTM u-textCenter u-textSizeMed': true,
        'u-textSizeBaseMobile': this.state.fullscreen,
        'u-borderBottom List--noResults': !this.state.fullscreen
      });
      const noResultsParagraphClasses = classSet({
        'u-textSecondary': true,
        'u-marginBL': !this.state.fullscreen
      });
      /* jshint laxbreak: true */
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

    /* jshint laxbreak: true */
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
                          onSearchIconClick={this.handleSearch}
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
                                      onTouch={this.searchBoxClickHandler} />
                                  : null;

    const headerContent = (!this.state.articleViewActive
                           && (!this.state.fullscreen && this.state.hasSearched
                               || this.state.fullscreen && !this.state.showIntroScreen))
                        ? <HelpCenterForm
                            onSubmit={this.handleSubmit}
                            onSearch={this.handleSearch}
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
      /* jshint laxbreak: true */
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
          fullscreen={this.state.fullscreen}>
          <div className={formClasses}>
            <HelpCenterForm
              ref='helpCenterForm'
              onSearch={this.handleSearch}
              onSubmit={this.handleSubmit}>
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
});
