import { TALK_EMBEDDABLE_CONFIG } from '../talk-action-types';

const initialState = {
  averageWaitTimeSetting: null,
  capability: '0',
  enabled: 'false',
  groupName: '',
  keywords: '',
  phoneNumber: ''
};

const embeddableConfig = (state = initialState, action) => {
  switch (action.type) {
    case TALK_EMBEDDABLE_CONFIG:
      return action.payload;
    default:
      return state;
  }
};

export default embeddableConfig;
