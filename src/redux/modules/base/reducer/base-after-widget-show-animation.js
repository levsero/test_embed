import { ADD_TO_AFTER_SHOW_ANIMATE, WIDGET_SHOW_ANIMATION_COMPLETE } from '../base-action-types';

const initialState = [];

const activeEmbed = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_TO_AFTER_SHOW_ANIMATE:
      return [ ...state, payload ];
    case WIDGET_SHOW_ANIMATION_COMPLETE:
      return initialState;
    default:
      return state;
  }
};

export default activeEmbed;
