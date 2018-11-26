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
        ...state,
        enabled: bannerInfo.enabled,
        layout: bannerInfo.layout,
        text: bannerInfo.text,
        image: bannerInfo.image_path
      };
    default:
      return state;
  }
};

export default banner;
