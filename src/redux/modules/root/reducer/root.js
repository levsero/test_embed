import { BACK_CLICK } from '../root-action-types';

const rootReducer = (state = {}, action) => {
  switch (action.type) {
    case BACK_CLICK: {
      console.log(state);

      return state;
    }
    default: {
      return state;
    }
  }
};

export default rootReducer;
