import { WIDGET_INITIALISED } from '../base-action-types';

const initialState = false;
const widgetInitialised = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case WIDGET_INITIALISED:
      return true;
    default:
      return state;
  }
};

export default widgetInitialised;
