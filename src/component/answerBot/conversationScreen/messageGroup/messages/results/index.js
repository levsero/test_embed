import React from 'react';
import PropTypes from 'prop-types';

import sanitizeHtml from 'sanitize-html';
import _ from 'lodash';

import { MessageBubbleChoices }  from 'component/shared/MessageBubbleChoices';
import { Icon } from 'component/Icon';
import Text from '../text';

import { locals as styles } from './style.scss';

const Results = (props) => {
  const { articles, onArticleClick, leadingMessage } = props;

  return (
    <div>
      {renderLeadingMessage(leadingMessage)}
      <MessageBubbleChoices containerStyle={styles.container}>
        {articles.map((article, index) => renderResult(article, index, onArticleClick))}
      </MessageBubbleChoices>
    </div>
  );
};

const renderLeadingMessage = (message) => (
  message ? <Text isVisitor={false} message={message} /> : null
);

const cleanHtml = (body) => {
  return sanitizeHtml(body, { allowedTags: [] }).replace(/\s+/g,' ').trim();
};

const renderResult = (article, index, onClick) => {
  return (
    <div key={index} className={styles.result} onClick={() => onClick(article)}>
      <div className={styles.heading}>
        <Icon className={styles.icon} type='Icon--article' />
        <div className={styles.optionText}>{_.truncate(article.title, { length: 65 })}</div>
      </div>
      <div className={`${styles.snippet}`}>
        <div>{cleanHtml(article.snippet || article.body)}</div>
      </div>
    </div>
  );
};

Results.propTypes = {
  articles: PropTypes.array.isRequired,
  onArticleClick: PropTypes.func.isRequired,
  leadingMessage: PropTypes.string
};

export default Results;
