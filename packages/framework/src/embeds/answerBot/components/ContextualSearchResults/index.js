import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getSearchedArticles } from 'embeds/helpCenter/selectors'
import { screenChanged, contextualArticleShown } from 'src/embeds/answerBot/actions/root'
import Results from 'src/embeds/answerBot/components/Results'
import { ARTICLE_SCREEN } from 'src/embeds/answerBot/constants'

class ContextualSearchResults extends Component {
  static propTypes = {
    articles: PropTypes.array.isRequired,
    actions: PropTypes.shape({
      screenChanged: PropTypes.func.isRequired,
      articleShown: PropTypes.func.isRequired,
    }),
  }

  articleClicked = (article) => {
    const {
      actions: { screenChanged, articleShown },
    } = this.props

    articleShown(article.id)

    screenChanged(ARTICLE_SCREEN)

    return
  }

  render() {
    const { articles } = this.props

    return <Results articles={articles} onArticleClick={this.articleClicked} />
  }
}

const mapStateToProps = (state) => ({
  articles: getSearchedArticles(state),
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      screenChanged: screenChanged,
      articleShown: contextualArticleShown,
    },
    dispatch
  ),
})

const connectedComponent = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
  ContextualSearchResults
)

export { connectedComponent as default, ContextualSearchResults as Component }
