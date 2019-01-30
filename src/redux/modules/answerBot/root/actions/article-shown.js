import { ARTICLE_SHOWN } from '../action-types';

export const articleShown = (sessionID, articleID) => {
  return {
    type: ARTICLE_SHOWN,
    payload: {
      sessionID,
      articleID
    }
  };
};
