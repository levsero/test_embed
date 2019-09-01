import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import SearchPromptPage from 'embeds/helpCenter/pages/SearchPromptPage'
import ArticlePage from 'embeds/helpCenter/pages/ArticlePage'
import SearchPage from 'embeds/helpCenter/pages/SearchPage'
import {
  getHasSearched,
  getArticleViewActive,
  getContextualHelpRequestNeeded
} from 'embeds/helpCenter/selectors'

const mapStateToProps = state => {
  return {
    hasSearched: getHasSearched(state),
    articleViewActive: getArticleViewActive(state),
    contextualHelpRequestNeeded: getContextualHelpRequestNeeded(state)
  }
}

class HelpCenter extends Component {
  static propTypes = {
    onNextClick: PropTypes.func,
    hasSearched: PropTypes.bool.isRequired,
    articleViewActive: PropTypes.bool.isRequired,
    contextualHelpRequestNeeded: PropTypes.bool.isRequired
  }

  static defaultProps = {
    onNextClick: () => {}
  }

  handleNextClick = e => {
    e.preventDefault()

    this.props.onNextClick()
  }

  render = () => {
    const { articleViewActive, hasSearched, contextualHelpRequestNeeded } = this.props

    if (articleViewActive) {
      return <ArticlePage onClick={this.handleNextClick} />
    } else if (hasSearched || contextualHelpRequestNeeded) {
      return <SearchPage onClick={this.handleNextClick} />
    } else {
      return <SearchPromptPage />
    }
  }
}

const connectedComponent = connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(HelpCenter)

export { connectedComponent as default, HelpCenter as Component }
