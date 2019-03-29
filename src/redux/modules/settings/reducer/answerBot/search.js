import {
  UPDATE_SETTINGS
} from '../../settings-action-types';

import _ from 'lodash';

const initialState = {
  labels: []
};

const search = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        labels: _.get(payload, 'webWidget.answerBot.search.labels', state.labels)
      };
    default:
      return state;
  }
};

export default search;
