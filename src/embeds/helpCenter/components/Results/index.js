import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Legend from 'embeds/helpCenter/components/Legend'
import NoResultsMessage from 'embeds/helpCenter/components/NoResultsMessage'
import ContextualNoResultsMessage from 'embeds/helpCenter/components/ContextualNoResultsMessage'
import List from 'embeds/helpCenter/components/List'

export default class Results extends Component {
  static propTypes = {
    articles: PropTypes.array,
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
  }

  static defaultProps = {
    articles: [],
    handleArticleClick: () => {},
    previousSearchTerm: '',
    searchFailed: false,
    showContactButton: true,
    hideZendeskLogo: false,
    contextualHelpRequestNeeded: false,
    hasSearched: false
  }

  hasInitialSearchResults = () => {
    const { articles } = this.props

    return articles.length > 0
  }

  renderResults = () => {
    return (
      <List
        isMobile={this.props.isMobile}
        articles={this.props.articles}
        showContactButton={this.props.showContactButton}
        hideZendeskLogo={this.props.hideZendeskLogo}
        locale={this.props.locale}
        onItemClick={this.props.handleArticleClick}
      />
    )
  }

  renderContextualNoResults() {
    return <ContextualNoResultsMessage locale={this.props.locale} isMobile={this.props.isMobile} />
  }

  renderDefaultNoResults() {
    return (
      <NoResultsMessage
        isMobile={this.props.isMobile}
        searchFailed={this.props.searchFailed}
        previousSearchTerm={this.props.previousSearchTerm}
        showContactButton={this.props.showContactButton}
        locale={this.props.locale}
      />
    )
  }

  renderNoResults = () => {
    const {
      hasContextualSearched,
      isContextualSearchComplete,
      contextualHelpRequestNeeded,
      hasSearched
    } = this.props

    return (hasContextualSearched && isContextualSearchComplete) ||
      (contextualHelpRequestNeeded && !hasSearched)
      ? this.renderContextualNoResults()
      : this.renderDefaultNoResults()
  }

  renderLegend = () => {
    return (
      <Legend
        fullscreen={this.props.isMobile}
        hasContextuallySearched={this.props.hasContextualSearched}
        locale={this.props.locale}
      />
    )
  }

  render = () => {
    const hasInitialSearchResults = this.hasInitialSearchResults()
    const legend = !(this.props.searchFailed || this.props.articles.length === 0)
      ? this.renderLegend()
      : null
    const results = hasInitialSearchResults ? this.renderResults() : this.renderNoResults()

    return (
      <div>
        {legend}
        {results}
      </div>
    )
  }
}
