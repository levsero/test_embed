import _ from 'lodash';
import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from '../../chat-action-types';

const initialState = {
  enabled: false,
  layout: 'image_only',
  image: '',
  text: 'Chat with us'
};

const banner = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      const bannerInfo = action.payload.banner;

      return {
        enabled: _.get(bannerInfo, 'enabled', state.enabled),
        layout: _.get(bannerInfo, 'layout', state.layout),
        text: _.get(bannerInfo, 'text', state.text),
        image: _.get(bannerInfo, 'image_path', state.image)
      };
    default:
      return state;
  }
};

export default banner;
