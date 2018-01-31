import { ARTICLE_CLICKED, ARTICLE_CLOSED } from '../helpCenter-action-types';

const initialState = null;

const activeArticle = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ARTICLE_CLICKED:
      return payload;
    case ARTICLE_CLOSED:
      return null;
    default:
      return state;
  }
};

export default activeArticle;
