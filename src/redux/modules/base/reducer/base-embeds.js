import _ from 'lodash';

import { UPDATE_EMBED } from '../base-action-types';

const initialState = [];

const embeds = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_EMBED:
      const detailName = (_.has(payload, 'detail.name'))
        ? { [payload.detail.name]: { ...state[payload.detail.name], ...payload.detail } }
        : null;
      const embedData = (_.has(payload, 'name'))
        ? { [payload.name]: { name: payload.name, accessible: payload.accessible } }
        : null;

      return _.assign({}, state, embedData, detailName);
    default:
      return state;
  }
};

export default embeds;
