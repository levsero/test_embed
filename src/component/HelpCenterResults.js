import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import { ButtonPill } from 'component/Button';
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

  renderViewMoreButton() {
    return (
      <ButtonPill
        fullscreen={this.props.fullscreen}
        showIcon={false}
        onClick={this.props.handleViewMoreClick}
        label={i18n.t('embeddable_framework.helpCenter.results.viewMoreLinkText', { fallback: 'View more' })} />
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
    const viewMoreButton = this.props.showViewMore ? this.renderViewMoreButton() : null;

    return (
      <div>
        <div className={legendClasses}>
          <span className='Arrange-sizeFill'>
            {resultsLegend}
          </span>
        </div>
        {results}
        {viewMoreButton}
      </div>
    );
  }
}

HelpCenterResults.propTypes = {
  articles: PropTypes.array,
  fullscreen: PropTypes.bool,
  showViewMore: PropTypes.bool,
  searchFailed: PropTypes.bool,
  previousSearchTerm: PropTypes.string,
  hasContextualSearched: PropTypes.bool,
  handleArticleClick: PropTypes.func,
  handleViewMoreClick: PropTypes.func
};

HelpCenterResults.defaultProps = {
  articles: [],
  fullscreen: false,
  showViewMore: false,
  searchFailed: false,
  previousSearchTerm: '',
  hasContextualSearched: false,
  handleArticleClick: () => {},
  handleViewMoreClick: () => {}
};
