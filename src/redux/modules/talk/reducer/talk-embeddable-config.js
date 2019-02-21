import _ from 'lodash';

import { TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT, TALK_DISCONNECT_SOCKET_EVENT } from '../talk-action-types';
import {
  CALLBACK_ONLY,
  PHONE_ONLY,
  CALLBACK_AND_PHONE
} from '../talk-capability-types';

const capabilityMap = {
  '0': CALLBACK_ONLY,
  '1': PHONE_ONLY,
  '2': CALLBACK_AND_PHONE
};
const initialState = {
  averageWaitTimeSetting: null,
  capability: CALLBACK_ONLY,
  enabled: false,
  nickname: '',
  phoneNumber: '',
  supportedCountries: [],
  connected: false
};

const embeddableConfig = (state = initialState, action) => {
  switch (action.type) {
    case TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT:
      const { payload } = action;
      let supportedCountries = payload.supportedCountries;

      supportedCountries = supportedCountries ? supportedCountries.split(',') : [];

      return {
        ...payload,
        supportedCountries: _.pull(supportedCountries, '', null),
        capability: capabilityMap[payload.capability],
        enabled: payload.enabled === true,
        connected: true
      };
    case TALK_DISCONNECT_SOCKET_EVENT:
      return {
        ...state,
        enabled: false
      };
    default:
      return state;
  }
};

export default embeddableConfig;
