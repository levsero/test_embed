import { UPDATE_ACTIVE_ARTICLE, RESET_ACTIVE_ARTICLE } from '../helpCenter-action-types';

const initialState = null;

const activeArticle = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_ACTIVE_ARTICLE:
      return payload;
    case RESET_ACTIVE_ARTICLE:
      return null;
    default:
      return state;
  }
};

export default activeArticle;
