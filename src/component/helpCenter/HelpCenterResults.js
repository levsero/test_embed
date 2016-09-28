import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import { ButtonPill } from 'component/button/ButtonPill';
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
      'u-paddingBM': !this.props.fullscreen,
      'u-marginBS List--fullscreen': this.props.fullscreen
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
      'List--noResults': !this.props.fullscreen,
      'u-borderBottom': this.props.showBottomBorder
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
      <div className={noResultsClasses}>
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
    const buttonClasses = classNames({
      'u-pullRight': i18n.isRTL()
    });

    return (
      <div className='u-cf'>
        <div className={buttonClasses}>
          <ButtonPill
            fullscreen={this.props.fullscreen}
            showIcon={false}
            onClick={this.props.handleViewMoreClick}
            label={i18n.t('embeddable_framework.helpCenter.results.viewMoreLinkText', { fallback: 'View more' })} />
        </div>
      </div>
    );
  }

  renderLegend() {
    const legendClasses = classNames({
      'Legend u-paddingTT u-textSizeNml Arrange Arrange--middle u-textBody u-textBold': true,
      'u-textSizeBaseMobile': this.props.fullscreen
    });
    const resultsLegend = this.props.hasContextualSearched
                        ? i18n.t('embeddable_framework.helpCenter.label.topSuggestions')
                        : i18n.t('embeddable_framework.helpCenter.label.results');

    return (
      <div className={legendClasses}>
        <span className='Arrange-sizeFill'>
          {resultsLegend}
        </span>
      </div>
    );
  }

  render() {
    const initialSearchResults = this.props.articles.length > 0 &&
                                 this.props.articles.length < 4;
    const showBottomBorder = this.props.showBottomBorder && initialSearchResults;
    // TODO: apply the bottom padding for the view more button once we begin rendering it.
    // (i.e string has been translated).
    const applyPadding = // this.props.showViewMore ||
                         (!this.props.showNextButton &&
                          initialSearchResults &&
                          !this.props.hideZendeskLogo);
    const resultsClasses = classNames({
      'u-borderBottom': showBottomBorder,
      'u-paddingBL': applyPadding
    });
    const legend = !(this.props.searchFailed || this.props.articles.length === 0)
                 ? this.renderLegend()
                 : null;
    const results = this.props.articles.length > 0
                  ? this.renderResults()
                  : this.renderNoResults();
    /* eslint no-unused-vars:0 */
    const viewMoreButton = this.props.showViewMore ? this.renderViewMoreButton() : null;

    // TODO add {viewMoreButton} beneath {results} once the "View more" string has been translated
    return (
      <div className={resultsClasses}>
        {legend}
        {results}
      </div>
    );
  }
}

HelpCenterResults.propTypes = {
  articles: PropTypes.array,
  fullscreen: PropTypes.bool,
  showViewMore: PropTypes.bool,
  showNextButton: PropTypes.bool,
  hideZendeskLogo: PropTypes.bool,
  showBottomBorder: PropTypes.bool,
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
  showNextButton: true,
  hideZendeskLogo: false,
  showBottomBorder: true,
  searchFailed: false,
  previousSearchTerm: '',
  hasContextualSearched: false,
  handleArticleClick: () => {},
  handleViewMoreClick: () => {}
};
