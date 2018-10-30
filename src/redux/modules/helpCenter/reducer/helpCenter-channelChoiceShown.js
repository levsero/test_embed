import { CHANNEL_CHOICE_SCREEN_CHANGE_INTENT_SHOWN } from '../helpCenter-action-types';
import { API_CLEAR_HC_SEARCHES } from '../../base/base-action-types';

const initialState = false;

const channelChoiceShown = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CHANNEL_CHOICE_SCREEN_CHANGE_INTENT_SHOWN:
      return payload;
    case API_CLEAR_HC_SEARCHES:
      return initialState;
    default:
      return state;
  }
};

export default channelChoiceShown;
