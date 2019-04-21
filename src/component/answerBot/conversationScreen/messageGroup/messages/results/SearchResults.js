import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Results from './index';

import { screenChanged, articleShown } from 'src/redux/modules/answerBot/root/actions/';
import { articleViewed } from 'src/redux/modules/answerBot/article/actions/';

import { ARTICLE_SCREEN } from 'src/constants/answerBot';

import { i18n } from 'service/i18n';

class SearchResults extends Component {
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
    screenChanged(ARTICLE_SCREEN);
    articleViewed(sessionID, article.id);
  }

  leadingMessage = (resultsLength) => {
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

    return i18n.t(messageKey);
  };

  render() {
    const { articles } = this.props;

    return (<Results
      articles={articles}
      leadingMessage={this.leadingMessage(articles.length)}
      onArticleClick={this.articleClicked}
    />);
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    screenChanged: screenChanged,
    articleShown: articleShown,
    articleViewed: articleViewed
  }, dispatch)
});

const connectedComponent = connect(null, mapDispatchToProps, null, { withRef: true })(SearchResults);

export {
  connectedComponent as default,
  SearchResults as Component
};
