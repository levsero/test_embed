import {
  UPDATE_SETTINGS
} from '../../settings-action-types';

import _ from 'lodash';

const initialState = [];

const department = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      const newDepartment = _.get(payload, 'chat.departments.enabled');

      return newDepartment || state;
    default:
      return state;
  }
};

export default department;
