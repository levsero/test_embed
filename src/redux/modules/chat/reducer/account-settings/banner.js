import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from '../../chat-action-types';

const initialState = {
  layout: 'image_only',
  img: '',
  text: 'hello'
};

const banner = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      const bannerInfo = action.payload.banner;

      return {
        ...state,
        layout: bannerInfo.layout,
        text: bannerInfo.text,
        img: bannerInfo.image_path
      };
    default:
      return state;
  }
};

export default banner;
