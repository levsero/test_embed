import { UPDATE_WIDGET_SHOWN, API_RESET_WIDGET, WIDGET_INITIALISED } from '../base-action-types';
import { isPopout } from 'utility/globals';
const initialState = false;

const widgetShown = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_WIDGET_SHOWN:
      return payload;
    case API_RESET_WIDGET:
      return initialState;
    case WIDGET_INITIALISED:
      return isPopout();
    default:
      return state;
  }
};

export default widgetShown;
