import Map from 'core-js/library/es6/map';
import _ from 'lodash';

import {
  QUESTION_SUBMITTED_FULFILLED,
  QUESTION_SUBMITTED_PENDING,
  QUESTION_SUBMITTED_REJECTED
} from '../../conversation/action-types';

import {
  SESSION_STARTED,
  SESSION_RESOLVED_PENDING,
  SESSION_FALLBACK,
  SESSION_AUTO_SCROLL
} from '../action-types';

import {
  ARTICLE_DISMISSED_PENDING
} from '../../article/action-types';

const initialState = new Map();

function copyMap(map, sessionID, value) {
  const copy = new Map(map);

  return copy.set(sessionID, value);
}

function setSession(state, { sessionID }, val) {
  const session = state.get(sessionID);

  return copyMap(state, sessionID, { ...session, ...val });
}

function normalize(articles) {
  articles = _.isArray(articles) ? _.take(articles, 3) : [];
  return articles.map(article => ({
    ...article,
    id: article.article_id,
    body: article.html_body || article.body
  }));
}

const sessions = (state = initialState, action) => {
  switch (action.type) {
    case SESSION_STARTED:
      return copyMap(state, action.payload.sessionID, action.payload.sessionData);
    case QUESTION_SUBMITTED_PENDING:
      return setSession(state, action.payload, { query: action.payload.message, requestStatus: 'PENDING' });
    case QUESTION_SUBMITTED_FULFILLED:
      const { message, deflection, interaction_access_token } = action.payload; // eslint-disable-line camelcase

      return setSession(state, action.payload,
        {
          requestStatus: 'COMPLETED',
          articles: normalize(message),
          deflection,
          interactionToken: interaction_access_token // eslint-disable-line camelcase
        }
      );
    case QUESTION_SUBMITTED_REJECTED:
      return setSession(state, action.payload, { requestStatus: 'REJECTED' });

    case SESSION_RESOLVED_PENDING:
      return setSession(state, action.payload, { resolved: true });

    case SESSION_FALLBACK:
      return setSession(state, action.payload, { fallbackSuggested: true });

    case SESSION_AUTO_SCROLL:
      return setSession(state, action.payload, { autoScrolled: Date.now() });

    case ARTICLE_DISMISSED_PENDING:
      const { sessionID, articleID } = action.payload;
      const session = state.get(sessionID);
      const articles = session.articles.map(a => {
        if (a.id === articleID) {
          return { ...a, markedAsIrrelevant: true } ;
        } else {
          return a;
        }
      });

      return setSession(state, action.payload, { articles });
    default:
      return state;
  }
};

export default sessions;
