import {
  GET_ARTICLE_REQUEST_SUCCESS
} from '../helpCenter-action-types';

const initialState = false;

const articleDisplayed = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case GET_ARTICLE_REQUEST_SUCCESS:
      return true;
    default:
      return state;
  }
};

export default articleDisplayed;
