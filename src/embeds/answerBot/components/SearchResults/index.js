import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import useTranslate from 'src/hooks/useTranslate'

import { screenChanged, articleShown } from 'src/embeds/answerBot/actions/root'
import { articleViewed } from 'src/embeds/answerBot/actions/article'
import { ARTICLE_SCREEN } from 'src/embeds/answerBot/constants'

import Results from 'src/component/answerBot/conversationScreen/messageGroup/messages/results'

const SearchResults = ({ articles, sessionID }) => {
  const translate = useTranslate()
  const dispatch = useDispatch()

  const getLeadingMessage = resultsLength => {
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
      onArticleClick={article => handleArticleClicked(article, sessionID)}
    />
  )
}

SearchResults.propTypes = {
  articles: PropTypes.array.isRequired,
  sessionID: PropTypes.number.isRequired
}

export default SearchResults
