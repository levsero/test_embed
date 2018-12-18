import _ from 'lodash';
import { SDK_VISITOR_DEFAULT_DEPARTMENT_UPDATE } from 'src/redux/modules/chat/chat-action-types';

let initialState = { id: null };

const chatDefaultDepartment = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SDK_VISITOR_DEFAULT_DEPARTMENT_UPDATE:
      return {
        id: _.get(payload, 'detail.id', state.id)
      };
    default:
      return state;
  }
};

export default chatDefaultDepartment;
