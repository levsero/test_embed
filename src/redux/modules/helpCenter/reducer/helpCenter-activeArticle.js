import {
  ARTICLE_CLICKED,
  ARTICLE_CLOSED,
  GET_ARTICLE_REQUEST_SUCCESS
} from '../helpCenter-action-types';

const initialState = null;

const activeArticle = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ARTICLE_CLICKED:
    case GET_ARTICLE_REQUEST_SUCCESS:
      return payload;
    case ARTICLE_CLOSED:
      return null;
    default:
      return state;
  }
};

export default activeArticle;
