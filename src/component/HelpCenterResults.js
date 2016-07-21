import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import { i18n } from 'service/i18n';

export class HelpCenterResults extends Component {
  renderResultRow(article, index) {
    const listItemClasses = classNames({
      'List-item': true,
      'u-textSizeBaseMobile': this.props.fullscreen
    });

    return (
      <li key={_.uniqueId('article_')} className={listItemClasses}>
        <a className='u-userTextColor'
          href={article.html_url}
          target='_blank'
          onClick={this.props.handleArticleClick.bind(this, index)}>
            {article.title || article.name}
        </a>
      </li>
    );
  }

  renderResults() {
    const listClasses = classNames({
      'List': true,
      'u-borderNone u-marginBS List--fullscreen': this.props.fullscreen
    });
    const articleLinks = _.chain(this.props.articles)
      .take(3)
      .map(this.renderResultRow.bind(this))
      .value();

    return (
      <ul className={listClasses}>
        {articleLinks}
      </ul>
    );
  }

  renderNoResults() {
    const noResultsClasses = classNames({
      'u-marginTM u-textCenter u-textSizeMed': true,
      'u-textSizeBaseMobile': this.props.fullscreen,
      'u-borderBottom List--noResults': !this.props.fullscreen
    });
    const noResultsParagraphClasses = classNames({
      'u-textSecondary': true,
      'u-marginBL': !this.props.fullscreen
    });
    /* eslint indent:0 */
    const title = this.props.searchFailed
                ? i18n.t('embeddable_framework.helpCenter.search.error.title')
                : i18n.t('embeddable_framework.helpCenter.search.noResults.title', {
                    searchTerm: this.props.previousSearchTerm
                  });
    const body = this.props.searchFailed
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
  }

  render() {
    const legendClasses = classNames({
      'u-paddingTT u-textSizeNml Arrange Arrange--middle u-textBody u-textBold': true,
      'u-textSizeBaseMobile': this.props.fullscreen
    });
    const resultsLegend = this.props.hasContextualSearched
                        ? i18n.t(
                            'embeddable_framework.helpCenter.label.topSuggestions',
                            { fallback: 'Top Suggestions' }
                          )
                        : i18n.t('embeddable_framework.helpCenter.label.results');
    const results = this.props.articles.length > 0
                  ? this.renderResults()
                  : this.renderNoResults();

    return (
      <div>
        <div className={legendClasses}>
          <span className='Arrange-sizeFill'>
            {resultsLegend}
          </span>
        </div>

        {results}
      </div>
    );
  }
}

HelpCenterResults.propTypes = {
  articles: PropTypes.array.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  showViewMore: PropTypes.bool.isRequired,
  searchFailed: PropTypes.bool,
  previousSearchTerm: PropTypes.string,
  hasContextualSearched: PropTypes.bool.isRequired,
  handleArticleClick: PropTypes.func.isRequired,
  handleViewMoreClick: PropTypes.func
};

HelpCenterResults.defaultProps = {
  searchFailed: false,
  previousSearchTerm: '',
  handleViewMoreClick: () => {}
};
