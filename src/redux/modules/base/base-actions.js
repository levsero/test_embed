import {
  UPDATE_ACTIVE_EMBED,
  UPDATE_EMBED,
  UPDATE_BACK_BUTTON_VISIBILITY,
  UPDATE_AUTHENTICATED,
  UPDATE_EMBED_SHOWN
} from './base-action-types';
import {
  hideChatNotification,
  resetNotificationCount } from 'src/redux/modules/chat';

export const updateActiveEmbed = (embedName) => {
  return (dispatch) => {
    if (embedName === 'chat') {
      dispatch(hideChatNotification());
      dispatch(resetNotificationCount());
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

export const updateEmbedShown = (bool) => {
  const embedShownAction = {
    type: UPDATE_EMBED_SHOWN,
    payload: bool
  };

  return (dispatch, getState) => {
    const activeEmbed = getState().base.activeEmbed;

    dispatch(embedShownAction);

    if (activeEmbed === 'chat') {
      dispatch(resetNotificationCount());
    }
  };
}
