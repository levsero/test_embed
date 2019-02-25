import activeArticle from '../helpCenter-activeArticle';
import * as actionTypes from 'src/redux/modules/helpCenter/helpCenter-action-types';
import { API_CLEAR_HC_SEARCHES } from '../../../base/base-action-types';
import { testReducer } from 'src/util/testHelpers';

const mockArticle = {
  id: 123,
  body: 'bogan ipsum'
};

testReducer(activeArticle, [
  {
    action: { type: undefined },
    expected: null
  },
  {
    action: { type: 'DERP DERP' },
    initialState: mockArticle,
    expected: mockArticle
  },
  {
    action: { type: actionTypes.ARTICLE_CLICKED, payload: mockArticle },
    expected: mockArticle
  },
  {
    action: { type: actionTypes.GET_ARTICLE_REQUEST_SUCCESS, payload: mockArticle },
    expected: mockArticle
  },
  {
    action: { type: actionTypes.ARTICLE_CLOSED },
    initialState: mockArticle,
    expected: null
  },
  {
    action: { type: API_CLEAR_HC_SEARCHES },
    initialState: mockArticle,
    expected: null
  }
]);
