import {
  UPDATE_ACTIVE_EMBED,
  UPDATE_EMBED,
  UPDATE_ZOPIM_ONLINE,
  UPDATE_BACK_BUTTON_VISIBILITY
} from './base-action-types';

export const updateActiveEmbed = (embedName) => {
  return {
    type: UPDATE_ACTIVE_EMBED,
    payload: embedName
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

export const updateBackButtonVisibility = (visible) => {
  return {
    type: UPDATE_BACK_BUTTON_VISIBILITY,
    payload: visible
  };
};
