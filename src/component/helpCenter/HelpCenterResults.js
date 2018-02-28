import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { i18n } from 'service/i18n';

import { locals as styles } from './HelpCenterResults.scss';

export class HelpCenterResults extends Component {
  static propTypes = {
    applyPadding: PropTypes.bool,
    articles: PropTypes.array,
    fullscreen: PropTypes.bool,
    handleArticleClick: PropTypes.func,
    hasContextualSearched: PropTypes.bool,
    previousSearchTerm: PropTypes.string,
    searchFailed: PropTypes.bool,
    showContactButton: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool
  };

  static defaultProps = {
    applyPadding: false,
    articles: [],
    fullscreen: false,
    handleArticleClick: () => {},
    hasContextualSearched: false,
    previousSearchTerm: '',
    searchFailed: false,
    showContactButton: true,
    hideZendeskLogo: false
  };

  hasInitialSearchResults = () => {
    const { articles } = this.props;

    return articles.length > 0;
  }

  renderResultRow = (article, index) => {
    const mobileClasses = this.props.fullscreen ? styles.itemMobile : '';

    return (
      <li key={_.uniqueId('article_')} className={`${styles.item} ${mobileClasses}`}>
        <a className='u-userTextColor'
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
      fullscreen,
      articles,
      showContactButton,
      hideZendeskLogo } = this.props;
    const noPaddingClasses = !showContactButton && !hideZendeskLogo && this.hasInitialSearchResults();

    if (!noPaddingClasses) {
      paddingClasses = styles.listBottom;
    }

    const mobileClasses = fullscreen ? styles.listMobile : '';
    const articleLinks = _.map(articles, this.renderResultRow);

    return (
      <ul className={`${styles.list} ${paddingClasses} ${mobileClasses}`}>
        {articleLinks}
      </ul>
    );
  }

  renderNoResults = () => {
    const noResultsClasses = this.props.fullscreen
                           ? styles.noResultsMobile
                           : styles.noResultsDesktop;
    const paragraphClasses = !this.props.fullscreen ? styles.noResultsParagraphDesktop : '';

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

  renderLegend = () => {
    const mobileClasses = this.props.fullscreen ? styles.legendMobile : '';
    const resultsLegend = this.props.hasContextualSearched
                        ? i18n.t('embeddable_framework.helpCenter.label.topSuggestions')
                        : i18n.t('embeddable_framework.helpCenter.label.results');

    return (
      <div className={`${styles.legend} ${mobileClasses}`}>
        <span className={styles.legendContent}>
          {resultsLegend}
        </span>
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
