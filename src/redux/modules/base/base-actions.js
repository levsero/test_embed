import {
  UPDATE_ACTIVE_EMBED,
  UPDATE_EMBED,
  UPDATE_BACK_BUTTON_VISIBILITY,
  UPDATE_AUTHENTICATED,
  UPDATE_WIDGET_SHOWN
} from './base-action-types';
import {
  hideChatNotification,
  chatOpened } from 'src/redux/modules/chat';

export const updateActiveEmbed = (embedName) => {
  return (dispatch) => {
    if (embedName === 'chat') {
      dispatch(hideChatNotification());
      dispatch(chatOpened());
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

export const updateWidgetShown = (bool) => {
  const updateWidgetShownAction = {
    type: UPDATE_WIDGET_SHOWN,
    payload: bool
  };

  return (dispatch, getState) => {
    const activeEmbed = getState().base.activeEmbed;

    dispatch(updateWidgetShownAction);

    if (activeEmbed === 'chat') {
      dispatch(chatOpened());
    }
  };
};
