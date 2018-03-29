import {
  UPDATE_ACTIVE_EMBED,
  UPDATE_EMBED,
  UPDATE_BACK_BUTTON_VISIBILITY,
  UPDATE_AUTHENTICATED,
  UPDATE_WIDGET_SHOWN,
  IDENTIFY_RECIEVED,
  WIDGET_HIDE_ANIMATION_COMPLETE
} from './base-action-types';
import { chatOpened } from 'src/redux/modules/chat';
import { emailValid } from 'utility/utils';
import _ from 'lodash';

export const updateActiveEmbed = (embedName) => {
  return (dispatch) => {
    if (embedName === 'chat') {
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

export const updateWidgetShown = (show) => {
  const updateWidgetShownAction = {
    type: UPDATE_WIDGET_SHOWN,
    payload: show
  };

  return (dispatch, getState) => {
    const activeEmbed = getState().base.activeEmbed;

    dispatch(updateWidgetShownAction);

    if (activeEmbed === 'chat' && show) {
      dispatch(chatOpened());
    }
  };
};

export const handleIdentifyRecieved = (payload) => {
  let userDetails = payload;

  if (!emailValid(payload.email)) {
    userDetails = _.omit(userDetails, 'email');
  }

  return {
    type: IDENTIFY_RECIEVED,
    payload: userDetails
  };
};

export const widgetHideAnimationComplete = () => {
  return {
    type: WIDGET_HIDE_ANIMATION_COMPLETE
  };
};
