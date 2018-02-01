import { UPDATE_WIDGET_SHOWN } from '../base-action-types';

const initialState = false;

const widgetShown = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_WIDGET_SHOWN:
      return payload;
    default:
      return state;
  }
};

export default widgetShown;
