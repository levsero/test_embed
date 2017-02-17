import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { ButtonPill } from 'component/button/ButtonPill';
import { i18n } from 'service/i18n';

import { locals as styles } from './HelpCenterResults.sass';

export class HelpCenterResults extends Component {
  static propTypes = {
    applyPadding: PropTypes.bool,
    articles: PropTypes.array,
    fullscreen: PropTypes.bool,
    handleArticleClick: PropTypes.func,
    handleViewMoreClick: PropTypes.func,
    hasContextualSearched: PropTypes.bool,
    previousSearchTerm: PropTypes.string,
    searchFailed: PropTypes.bool,
    showBottomBorder: PropTypes.bool,
    showContactButton: PropTypes.bool,
    showViewMore: PropTypes.bool
  };

  static defaultProps = {
    applyPadding: false,
    articles: [],
    fullscreen: false,
    handleArticleClick: () => {},
    handleViewMoreClick: () => {},
    hasContextualSearched: false,
    previousSearchTerm: '',
    searchFailed: false,
    showBottomBorder: true,
    showContactButton: true,
    showViewMore: false
  };

  hasInitialSearchResults = () => {
    const { articles } = this.props;

    return articles.length > 0 && articles.length < 4;
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
      showViewMore,
      showBottomBorder,
      showContactButton } = this.props;
    const noPaddingClasses = !showContactButton && this.hasInitialSearchResults() && showBottomBorder;

    if (showViewMore) {
      paddingClasses = styles.listBottomViewMore;
    } else if (!noPaddingClasses) {
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
    const borderClasses = this.props.showBottomBorder ? styles.noResultsBorder : '';
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
      <div className={`${styles.noResults} ${noResultsClasses} ${borderClasses}`}>
        <p className='u-marginBN u-marginTL'>
          {title}
        </p>
        <p className={`${styles.noResultsParagraph} ${paragraphClasses}`}>
          {body}
        </p>
      </div>
    );
  }

  renderViewMoreButton = () => {
    const RTLClasses = i18n.isRTL() ? styles.viewMoreRTL : '';

    return (
      <div className={styles.viewMore}>
        <div className={RTLClasses}>
          <ButtonPill
            fullscreen={this.props.fullscreen}
            showIcon={false}
            onClick={this.props.handleViewMoreClick}
            label={i18n.t('embeddable_framework.helpCenter.results.viewMoreLinkText')} />
        </div>
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
    const showBottomBorder = this.props.showBottomBorder && hasInitialSearchResults;
    const applyPadding = this.props.showViewMore ||
                         (this.props.applyPadding && hasInitialSearchResults);
    const borderClasses = showBottomBorder ? styles.resultsBorder : '';
    const paddingClasses = applyPadding ? styles.resultsPadding : '';
    const legend = !(this.props.searchFailed || this.props.articles.length === 0)
                 ? this.renderLegend()
                 : null;
    const results = this.props.articles.length > 0
                  ? this.renderResults()
                  : this.renderNoResults();
    const viewMoreButton = this.props.showViewMore ? this.renderViewMoreButton() : null;

    return (
      <div className={`${borderClasses} ${paddingClasses}`}>
        {legend}
        {results}
        {viewMoreButton}
      </div>
    );
  }
}
