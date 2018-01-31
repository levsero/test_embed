import {
  SEARCH_REQUEST_SENT,
  ARTICLE_CLICKED,
  ARTICLE_CLOSED
} from '../helpCenter-action-types';

const initialState = false;

const articleClicked = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case ARTICLE_CLOSED:
    case SEARCH_REQUEST_SENT:
      return false;
    case ARTICLE_CLICKED:
      return true;
    default:
      return state;
  }
};

export default articleClicked;
