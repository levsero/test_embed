import { articleViewed } from 'classicSrc/embeds/answerBot/actions/article'
import { screenChanged, articleShown } from 'classicSrc/embeds/answerBot/actions/root'
import Results from 'classicSrc/embeds/answerBot/components/Results'
import { ARTICLE_SCREEN } from 'classicSrc/embeds/answerBot/constants'
import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

const SearchResults = ({ articles, sessionID }) => {
  const translate = useTranslate()
  const dispatch = useDispatch()

  const getLeadingMessage = (resultsLength) => {
    switch (resultsLength) {
      case 0:
        return translate('embeddable_framework.answerBot.results.no_article')
      case 1:
        return translate('embeddable_framework.answerBot.results.one_article')
      default:
        return translate('embeddable_framework.answerBot.results.many_article')
    }
  }

  const handleArticleClicked = (article, sessionID) => {
    dispatch(articleShown(sessionID, article.id))
    dispatch(screenChanged(ARTICLE_SCREEN))
    dispatch(articleViewed(sessionID, article.id))
  }

  return (
    <Results
      articles={articles}
      leadingMessage={getLeadingMessage(articles.length)}
      onArticleClick={(article) => handleArticleClicked(article, sessionID)}
    />
  )
}

SearchResults.propTypes = {
  articles: PropTypes.array.isRequired,
  sessionID: PropTypes.number.isRequired,
}

export default SearchResults
