import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';

import { i18n } from 'service/i18n';

import { locals as styles } from './HelpCenterResults.scss';

export class HelpCenterResults extends Component {
  static propTypes = {
    applyPadding: PropTypes.bool,
    articles: PropTypes.array,
    fullscreen: PropTypes.bool,
    locale: PropTypes.string,
    handleArticleClick: PropTypes.func,
    hasContextualSearched: PropTypes.bool.isRequired,
    isContextualSearchComplete: PropTypes.bool.isRequired,
    previousSearchTerm: PropTypes.string,
    searchFailed: PropTypes.bool,
    showContactButton: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
    contextualHelpRequestNeeded: PropTypes.bool,
    hasSearched: PropTypes.bool
  };

  static defaultProps = {
    applyPadding: false,
    articles: [],
    fullscreen: false,
    handleArticleClick: () => {},
    previousSearchTerm: '',
    searchFailed: false,
    showContactButton: true,
    hideZendeskLogo: false,
    contextualHelpRequestNeeded: false,
    hasSearched: false
  };

  constructor() {
    super();
    this.firstArticleRef = null;
  }

  focusField() {
    if (this.firstArticleRef) {
      this.firstArticleRef.focus();
      this.firstArticleRef = null;
    }
  }

  hasInitialSearchResults = () => {
    const { articles } = this.props;

    return articles.length > 0;
  }

  renderResultRow = (article, index) => {
    const mobileClasses = this.props.isMobile ? styles.itemMobile : '';
    const ref = index === 0 ? (ref) => { this.firstArticleRef = ref; } : null;

    return (
      <li key={_.uniqueId('article_')} className={`${styles.item} ${mobileClasses}`}>
        <a className='u-userTextColor'
          ref={ref}
          href={article.html_url}
          target='_blank'
          onClick={this.props.handleArticleClick.bind(this, index)}>
            {article.title || article.name}
        </a>
      </li>
    );
  }

  renderResults = () => {
    let paddingClasses = '';
    const {
      isMobile,
      articles,
      locale,
      showContactButton,
      hideZendeskLogo
} = this.props;
    const noPaddingClasses = !showContactButton && !hideZendeskLogo && this.hasInitialSearchResults();

    if (!noPaddingClasses) {
      paddingClasses = styles.listBottom;
    }

    const mobileClasses = isMobile ? styles.listMobile : '';
    const articleLinks = _.map(articles, this.renderResultRow);

    return (
      <ol lang={locale} className={`${styles.list} ${paddingClasses} ${mobileClasses}`}>
        {articleLinks}
      </ol>
    );
  }

  renderContextualNoResults() {
    const useSearchBarStyles = (this.props.isMobile) ? styles.useSearchBarTextMobile : styles.useSearchBarTextDesktop;
    const containerStyles = classNames(styles.contextualNoResults, {
      [styles.contextualNoResultsMobile]: this.props.isMobile
    });

    return (
      <div className={containerStyles}>
        <p className={useSearchBarStyles}>
          {i18n.t('embeddable_framework.helpCenter.content.useSearchBar')}
        </p>
      </div>
    );
  }

  renderDefaultNoResults() {
    const noResultsClasses = this.props.isMobile
                           ? styles.noResultsMobile
                           : styles.noResultsDesktop;
    const paragraphClasses = !this.props.isMobile ? styles.noResultsParagraphDesktop : '';

    /* eslint indent:0 */
    const title = this.props.searchFailed
                ? i18n.t('embeddable_framework.helpCenter.search.error.title')
                : i18n.t('embeddable_framework.helpCenter.search.noResults.title', {
                    searchTerm: this.props.previousSearchTerm
                  });
    const body = this.props.searchFailed && this.props.showContactButton
               ? i18n.t('embeddable_framework.helpCenter.search.error.body')
               : i18n.t('embeddable_framework.helpCenter.search.noResults.body');

    return (
      <div className={`${styles.noResults} ${noResultsClasses}`}>
        <p className='u-marginBN u-marginTL'>
          {title}
        </p>
        <p className={`${styles.noResultsParagraph} ${paragraphClasses}`}>
          {body}
        </p>
      </div>
    );
  }

  renderNoResults = () => {
    const { hasContextualSearched, isContextualSearchComplete, contextualHelpRequestNeeded, hasSearched } = this.props;

    return ((hasContextualSearched && isContextualSearchComplete) || (contextualHelpRequestNeeded && !hasSearched))
      ? this.renderContextualNoResults()
      : this.renderDefaultNoResults();
  }

  renderLegend = () => {
    const mobileClasses = this.props.fullscreen ? styles.legendMobile : '';
    const resultsLegend = this.props.hasContextualSearched
                        ? i18n.t('embeddable_framework.helpCenter.label.topSuggestions')
                        : i18n.t('embeddable_framework.helpCenter.label.results');

    return (
      <div className={`${styles.legend} ${mobileClasses}`}>
        <h2 className={styles.legendContent}>
          {resultsLegend}
        </h2>
      </div>
    );
  }

  render = () => {
    const hasInitialSearchResults = this.hasInitialSearchResults();
    const applyPadding = this.props.applyPadding && hasInitialSearchResults;
    const paddingClasses = applyPadding ? styles.resultsPadding : '';
    const legend = !(this.props.searchFailed || this.props.articles.length === 0)
                 ? this.renderLegend()
                 : null;
    const results = hasInitialSearchResults
                  ? this.renderResults()
                  : this.renderNoResults();

    return (
      <div className={paddingClasses}>
        {legend}
        {results}
      </div>
    );
  }
}
