import { UPDATE_TALK_EMBEDDABLE_CONFIG } from '../talk-action-types';
import {
  CALLBACK_ONLY,
  PHONE_ONLY,
  CALLBACK_AND_PHONE } from '../talk-capability-types';

const capabilityMap = {
  '0': CALLBACK_ONLY,
  '1': PHONE_ONLY,
  '2': CALLBACK_AND_PHONE
};
const initialState = {
  averageWaitTimeSetting: null,
  capability: CALLBACK_ONLY,
  enabled: false,
  groupName: '',
  keywords: '',
  phoneNumber: '',
  supportedCountries: []
};

const embeddableConfig = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TALK_EMBEDDABLE_CONFIG:
      const { payload } = action;

      return {
        ...payload,
        capability: capabilityMap[payload.capability],
        enabled: payload.enabled === true
      };
    default:
      return state;
  }
};

export default embeddableConfig;
