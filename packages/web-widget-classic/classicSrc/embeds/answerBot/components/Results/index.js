import { TEST_IDS } from 'classicSrc/constants/shared'
import MessageBubbleChoices from 'classicSrc/embeds/answerBot/components/MessageBubbleChoices'
import Text from 'classicSrc/embeds/answerBot/components/Text'
import { MAX_TITLE_LENGTH } from 'classicSrc/embeds/answerBot/constants'
import { triggerOnEnter } from 'classicSrc/util/keyboard'
import _ from 'lodash'
import PropTypes from 'prop-types'
import sanitizeHtml from 'sanitize-html'
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
