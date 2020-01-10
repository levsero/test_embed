import React from 'react'
import PropTypes from 'prop-types'

import sanitizeHtml from 'sanitize-html'
import _ from 'lodash'

import { triggerOnEnter } from 'utility/keyboard'
import { MessageBubbleChoices } from 'component/shared/MessageBubbleChoices'
import { Icon } from 'component/Icon'
import Text from '../text'
import { ICONS, TEST_IDS } from 'src/constants/shared'
import { MAX_TITLE_LENGTH } from 'src/constants/answerBot'

import { locals as styles } from './style.scss'

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

const renderLeadingMessage = message =>
  message ? <Text isVisitor={false} message={message} /> : null

const cleanHtml = body => {
  return {
    __html: _.truncate(
      sanitizeHtml(body, { allowedTags: [] })
        .replace(/\s+/g, ' ')
        .trim(),
      { length: 100 }
    )
  }
}

const renderResult = (article, index, onClick) => {
  return (
    <div
      onKeyPress={triggerOnEnter(() => onClick(article))}
      role="button"
      tabIndex="0"
      key={index}
      className={styles.result}
      onClick={() => onClick(article)}
    >
      <div className={styles.heading}>
        <Icon className={styles.icon} type={ICONS.ARTICLE} />
        <div className={styles.optionText} data-testid={TEST_IDS.HC_ARTICLE_TITLE}>
          {_.truncate(article.title, { length: MAX_TITLE_LENGTH })}
        </div>
      </div>
      <div className={`${styles.snippet}`}>
        <div dangerouslySetInnerHTML={cleanHtml(article.snippet || article.body)} />
      </div>
    </div>
  )
}

Results.propTypes = {
  articles: PropTypes.array.isRequired,
  onArticleClick: PropTypes.func.isRequired,
  leadingMessage: PropTypes.string
}

export default Results
