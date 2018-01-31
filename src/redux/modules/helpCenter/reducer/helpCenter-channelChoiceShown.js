import { NEXT_BUTTON_CLICKED } from '../helpCenter-action-types';

const initialState = false;

const channelChoiceShown = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case NEXT_BUTTON_CLICKED:
      return payload;
    default:
      return state;
  }
};

export default channelChoiceShown;
