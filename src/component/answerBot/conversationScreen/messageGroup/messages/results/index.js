import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Icon } from 'component/Icon';
import { MessageBubbleChoices }  from 'component/shared/MessageBubbleChoices';
import { screenChanged, articleShown } from 'src/redux/modules/answerBot/root/actions/';
import { articleViewed } from 'src/redux/modules/answerBot/article/actions/';

import Text from '../text';
import { locals as styles } from './style.scss';

import { i18n } from 'service/i18n';

class Results extends Component {
  static propTypes = {
    articles: PropTypes.array.isRequired,
    sessionID: PropTypes.number.isRequired,
    actions: PropTypes.shape({
      screenChanged: PropTypes.func.isRequired,
      articleShown: PropTypes.func.isRequired,
      articleViewed: PropTypes.func.isRequired
    })
  };

  articleClicked = (article) => {
    const { sessionID, actions: { screenChanged, articleShown, articleViewed } } = this.props;

    articleShown(sessionID, article.id);
    screenChanged('article');
    articleViewed(sessionID, article.id);
  }

  renderLeadingMessage = (resultsLength) => {
    let messageKey;

    switch (resultsLength) {
      case 0:
        messageKey = 'embeddable_framework.answerBot.results.no_article';
        break;
      case 1:
        messageKey = 'embeddable_framework.answerBot.results.one_article';
        break;
      default:
        messageKey = 'embeddable_framework.answerBot.results.many_article';
    }

    return (<Text isVisitor={false} message={i18n.t(messageKey)} />);
  }

  renderResult = (article, index) => {
    return (
      <div key={index} className={styles.result} onClick={() => this.articleClicked(article)}>
        <div className={styles.heading}>
          <Icon className={styles.icon} type='Icon--article' />
          <div className={styles.optionText}>{_.truncate(article.title, { length: 65 })}</div>
        </div>
        <div className={`${styles.snippet}`}>
          <div>{article.snippet}</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderLeadingMessage(this.props.articles.length)}
        <MessageBubbleChoices containerStyle={styles.container}>
          {_.map(this.props.articles, this.renderResult)}
        </MessageBubbleChoices>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    screenChanged: screenChanged,
    articleShown: articleShown,
    articleViewed: articleViewed
  }, dispatch)
});

const connectedComponent = connect(null, mapDispatchToProps, null, { withRef: true })(Results);

export {
  connectedComponent as default,
  Results as PureResults
};
