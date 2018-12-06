import _ from 'lodash';
import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from '../../chat-action-types';

const initialState = {
  hide_branding: false
};

const branding = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      return {
        hide_branding: _.get(action.payload, 'branding.hide_branding', state.hide_branding)
      };
    default:
      return state;
  }
};

export default branding;
