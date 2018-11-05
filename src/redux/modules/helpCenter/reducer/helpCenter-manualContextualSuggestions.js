import {
  CONTEXTUAL_SUGGESTIONS_MANUALLY_SET
} from '../helpCenter-action-types';
import _ from 'lodash';
import { API_CLEAR_HC_SEARCHES } from '../../base/base-action-types';

// The reducer must have at most 1 non-falsy value.
// This ensures that we only use one property for a contextual request and respect the
// priority of each argument (query, labels then url).
const initialState = {
  query: '',
  labels: [],
  url: false
};

const manualContextualSuggestions = (state = initialState, action) => {
  const { type, payload: options } = action;

  switch (type) {
    case CONTEXTUAL_SUGGESTIONS_MANUALLY_SET:
      // This `isString` check is needed in the case that a user passes in only a
      // string to `zE.setHelpCenterSuggestions`. It avoids options.search evaluating
      // to true in that case because it equals the string function `String.prototype.search`.
      if (_.isString(options.search) && options.search.length > 0) {
        return {
          ...initialState,
          query: options.search
        };
      } else if (_.isArray(options.labels) && options.labels.length > 0) {
        return {
          ...initialState,
          labels: options.labels
        };
      } else if ('url' in options) {
        return {
          ...initialState,
          url: options.url
        };
      }
      return state;
    case API_CLEAR_HC_SEARCHES:
      return initialState;
    default:
      return state;
  }
};

export default manualContextualSuggestions;
