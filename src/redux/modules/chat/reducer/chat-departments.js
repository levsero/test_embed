import { SDK_DEPARTMENT_UPDATE } from '../chat-action-types';

const initialState = [];

const departments = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SDK_DEPARTMENT_UPDATE:
      return {
        ...state,
        [payload.detail.id]: {
          ...state[payload.detail.id],
          ...payload.detail
        }
      };
    default:
      return state;
  }
};

export default departments;
