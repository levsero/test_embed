import _ from 'lodash';
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types';

const initialState = null;

const contactFormLabel = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return _.get(payload, 'contactFormLabel', state);
    default:
      return state;
  }
};

export default contactFormLabel;
