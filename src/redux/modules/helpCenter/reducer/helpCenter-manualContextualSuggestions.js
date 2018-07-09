import {
  CONTEXTUAL_SUGGESTIONS_MANUALLY_SET
} from '../helpCenter-action-types';
import _ from 'lodash';

const initialState = {
  query: '',
  labels: []
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
          ...state,
          query: options.search
        };
      } else if (_.isArray(options.labels) && options.labels.length > 0) {
        return {
          ...state,
          labels: options.labels
        };
      }
      return state;
    default:
      return state;
  }
};

export default manualContextualSuggestions;
