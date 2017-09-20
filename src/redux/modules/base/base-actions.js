import {
  UPDATE_ACTIVE_EMBED,
  UPDATE_EMBED,
  UPDATE_ZOPIM_ONLINE,
  UPDATE_BACK_BUTTON_VISIBILITY,
  UPDATE_AUTHENTICATED
} from './base-action-types';
import { hideChatNotification } from 'src/redux/modules/chat';

export const updateActiveEmbed = (embedName) => {
  return (dispatch) => {
    if (embedName === 'chat') {
      dispatch(hideChatNotification());
    }

    dispatch({
      type: UPDATE_ACTIVE_EMBED,
      payload: embedName
    });
  };
};

export const updateEmbedAccessible = (name, accessible) => {
  return {
    type: UPDATE_EMBED,
    payload: {
      name,
      params: { accessible }
    }
  };
};

export const updateZopimOnline = (online) => {
  return {
    type: UPDATE_ZOPIM_ONLINE,
    payload: online
  };
};

export const updateBackButtonVisibility = (visible = true) => {
  return {
    type: UPDATE_BACK_BUTTON_VISIBILITY,
    payload: visible
  };
};

export const updateAuthenticated = (bool) => {
  return {
    type: UPDATE_AUTHENTICATED,
    payload: bool
  };
};
