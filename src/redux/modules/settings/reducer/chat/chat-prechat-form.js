import { UPDATE_SETTINGS } from '../../settings-action-types';
import _ from 'lodash';

const initialState = {
  departmentLabel: null,
  greeting: null
};

const prechatForm = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        departmentLabel: _.get(payload, 'webWidget.chat.prechatForm.departmentLabel', state.departmentLabel),
        greeting: _.get(payload, 'webWidget.chat.prechatForm.greeting', state.greeting)
      };
    default:
      return state;
  }
};

export default prechatForm;
