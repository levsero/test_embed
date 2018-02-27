import { UPDATE_ACTIVE_EMBED } from '../base-action-types';
import { GET_ARTICLE_REQUEST_SUCCESS } from 'src/redux/modules/helpCenter/helpCenter-action-types';

const initialState = '';

const activeEmbed = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_ACTIVE_EMBED:
      return payload;
    case GET_ARTICLE_REQUEST_SUCCESS:
      return 'helpCenterForm';
    default:
      return state;
  }
};

export default activeEmbed;
