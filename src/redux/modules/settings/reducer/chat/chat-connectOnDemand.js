import _ from 'lodash';

import { UPDATE_SETTINGS } from '../../settings-action-types';

const initialState = false;

const connectOnDemand = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return _.get(payload, 'webWidget.chat.connectOnDemand', state);
    default:
      return state;
  }
};

export default connectOnDemand;
