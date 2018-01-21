import { UPDATE_RESULTS, UPDATE_ARTICLE_VIEW_ACTIVE } from '../helpCenter-action-types';

const initialState = false;

const articleViewActive = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_RESULTS:
      return payload.articleViewActive;
    case UPDATE_ARTICLE_VIEW_ACTIVE:
      return payload;
    default:
      return state;
  }
};

export default articleViewActive;
