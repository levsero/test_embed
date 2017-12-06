import { TALK_EMBEDDABLE_CONFIG } from '../talk-action-types';
import {
  CALLBACK_ONLY_SCREEN,
  PHONE_ONLY_SCREEN,
  CALLBACK_AND_PHONE_SCREEN } from 'src/redux/modules/talk/talk-screen-types';

const initialState = {
  averageWaitTimeSetting: null,
  capability: '0',
  enabled: 'false',
  groupName: '',
  keywords: '',
  phoneNumber: '',
  supportedCountries: []
};
const capabilityScreenMap = {
  '0': CALLBACK_ONLY_SCREEN,
  '1': PHONE_ONLY_SCREEN,
  '2': CALLBACK_AND_PHONE_SCREEN
};

const embeddableConfig = (state = initialState, action) => {
  switch (action.type) {
    case TALK_EMBEDDABLE_CONFIG:
      const { payload } = action;

      return { ...payload, capability: capabilityScreenMap[payload.capability] };
    default:
      return state;
  }
};

export default embeddableConfig;
