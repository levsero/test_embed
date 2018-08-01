import { UPDATE_WIDGET_SHOWN } from '../base-action-types';

const initialState = false;
const hasWidgetShown = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_WIDGET_SHOWN:
      if (payload) {
        return true;
      }
      return state;
    default:
      return state;
  }
};

export default hasWidgetShown;
