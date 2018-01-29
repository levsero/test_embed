import { UPDATE_CHANNELCHOICE_SHOWN } from '../helpCenter-action-types';

const initialState = false;

const channelChoiceShown = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_CHANNELCHOICE_SHOWN:
      return payload;
    default:
      return state;
  }
};

export default channelChoiceShown;
