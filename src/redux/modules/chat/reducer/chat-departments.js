import { SDK_DEPARTMENT_UPDATE } from '../chat-action-types';

const initialState = [];

const departments = (state = initialState, action) => {
  switch (action.type) {
    case SDK_DEPARTMENT_UPDATE:
      return {
        ...state,
        departments: action.payload.detail
      };
    default:
      return state;
  }
}

export default departments;
