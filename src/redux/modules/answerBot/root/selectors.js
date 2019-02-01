import _ from 'lodash';

import { createSelector } from 'reselect';
import { getSessions } from '../sessions/selectors';

const getState = state => state.answerBot;

export const getCurrentSessionID = createSelector(
  [getState],
  state => state.currentSessionID
);

export const getCurrentRequestStatus = createSelector(
  [getCurrentSessionID, getSessions],
  (sessionID, sessions) => {
    const session = sessions && sessions.get(sessionID);

    return session ? session.requestStatus : null;
  }
);

export const getCurrentDeflection = createSelector(
  [getCurrentSessionID, getSessions],
  (sessionID, sessions) => {
    const session = sessions && sessions.get(sessionID);

    return session ? session.deflection : null;
  }
);

export const getCurrentInteractionToken = createSelector(
  [getCurrentSessionID, getSessions],
  (sessionID, sessions) => {
    const session = sessions && sessions.get(sessionID);

    return session ? session.interactionToken : null;
  }
);

export const getCurrentQuery = createSelector(
  [getCurrentSessionID, getSessions],
  (sessionID, sessions) => {
    const session = sessions && sessions.get(sessionID);

    return session ? session.query : null;
  }
);

export const isCurrentSessionResolved = createSelector(
  [getCurrentSessionID, getSessions],
  (sessionID, sessions) => {
    const session = sessions && sessions.get(sessionID);

    return !!(session && session.resolved);
  }
);

export const getCurrentArticleID = createSelector(
  [getState],
  state => _.get(state, 'currentArticle.articleID', null)
);

export const getCurrentArticleSessionID = createSelector(
  [getState],
  state => state.currentArticle ? state.currentArticle.sessionID : null
);

export const getCurrentArticle = createSelector(
  [getCurrentArticleID, getCurrentArticleSessionID, getSessions],
  (articleID, sessionID, sessions) => {
    const session = sessions && sessions.get(sessionID);
    const articles = (session && session.articles) || [];

    return _.find(articles, { id: articleID });
  }
);

export const isFeedbackRequired = createSelector(
  [getCurrentArticle, getCurrentArticleSessionID, getCurrentSessionID, isCurrentSessionResolved],
  (article, sessionID, currentSessionID, currentSessionResolved) => {
    return sessionID === currentSessionID
      && !currentSessionResolved
      && !(article && article.markedAsIrrelevant);
  }
);

export const isInputDisabled = createSelector(
  [getState],
  state => !!state.inputDisabled
);

export const getCurrentScreen = createSelector(
  [getState],
  state => state.currentScreen
);

export const getCurrentMessage = createSelector(
  [getState],
  state => state.currentMessage
);

export const getGreeted = createSelector(
  [getState],
  state => !!state.greeted
);

export const getInitialFallbackSuggested = createSelector(
  [getState],
  state => !!state.initialFallbackSuggested
);
