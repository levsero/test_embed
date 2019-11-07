import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Results from './index'

import { screenChanged, contextualArticleShown } from 'src/redux/modules/answerBot/root/actions/'
import { getSearchedArticles } from 'embeds/helpCenter/selectors'

import { ARTICLE_SCREEN } from 'src/constants/answerBot'

class ContextualSearchResults extends Component {
  static propTypes = {
    articles: PropTypes.array.isRequired,
    actions: PropTypes.shape({
      screenChanged: PropTypes.func.isRequired,
      articleShown: PropTypes.func.isRequired
    })
  }

  articleClicked = article => {
    const {
      actions: { screenChanged, articleShown }
    } = this.props

    articleShown(article.id)
    screenChanged(ARTICLE_SCREEN)
  }

  render() {
    const { articles } = this.props

    return <Results articles={articles} onArticleClick={this.articleClicked} />
  }
}

const mapStateToProps = state => ({
  articles: getSearchedArticles(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      screenChanged: screenChanged,
      articleShown: contextualArticleShown
    },
    dispatch
  )
})

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(ContextualSearchResults)

export { connectedComponent as default, ContextualSearchResults as Component }
