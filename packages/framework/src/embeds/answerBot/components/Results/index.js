import React from 'react'
import PropTypes from 'prop-types'

import sanitizeHtml from 'sanitize-html'
import _ from 'lodash'

import { triggerOnEnter } from 'utility/keyboard'
import MessageBubbleChoices from 'src/embeds/answerBot/components/MessageBubbleChoices'
import Text from 'src/embeds/answerBot/components/Text'
import { TEST_IDS } from 'src/constants/shared'
import { MAX_TITLE_LENGTH } from 'src/embeds/answerBot/constants'

import { Header, Snippet, Title, Container, ArticleIcon } from './styles'

const Results = ({ articles, onArticleClick, leadingMessage }) => {
  return (
    <div>
      {renderLeadingMessage(leadingMessage)}
      <MessageBubbleChoices>
        {articles.map((article, index) => renderResult(article, index, onArticleClick))}
      </MessageBubbleChoices>
    </div>
  )
}

const renderLeadingMessage = (message) =>
  message ? <Text isVisitor={false} message={message} /> : null

const cleanHtml = (body) => {
  return {
    __html: _.truncate(sanitizeHtml(body, { allowedTags: [] }).replace(/\s+/g, ' ').trim(), {
      length: 100,
    }),
  }
}

const renderResult = (article, index, onClick) => {
  return (
    <Container
      onKeyPress={triggerOnEnter(() => onClick(article))}
      role="button"
      tabIndex="0"
      key={index}
      onClick={() => onClick(article)}
    >
      <Header>
        <ArticleIcon />
        <Title data-testid={TEST_IDS.HC_ARTICLE_TITLE}>
          {_.truncate(article.title, { length: MAX_TITLE_LENGTH })}
        </Title>
      </Header>
      <Snippet>
        <div dangerouslySetInnerHTML={cleanHtml(article.snippet || article.body)} />
      </Snippet>
    </Container>
  )
}

Results.propTypes = {
  articles: PropTypes.array.isRequired,
  onArticleClick: PropTypes.func.isRequired,
  leadingMessage: PropTypes.string,
}

export default Results
