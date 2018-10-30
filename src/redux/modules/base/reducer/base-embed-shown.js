import { UPDATE_WIDGET_SHOWN, API_RESET_WIDGET } from '../base-action-types';

const initialState = false;

const widgetShown = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_WIDGET_SHOWN:
      return payload;
    case API_RESET_WIDGET:
      return initialState;
    default:
      return state;
  }
};

export default widgetShown;
