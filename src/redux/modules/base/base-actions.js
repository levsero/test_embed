import {
  UPDATE_ACTIVE_EMBED,
  UPDATE_ARTUROS,
  UPDATE_EMBED,
  UPDATE_BACK_BUTTON_VISIBILITY,
  UPDATE_WIDGET_SHOWN,
  IDENTIFY_RECIEVED,
  WIDGET_HIDE_ANIMATION_COMPLETE,
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAILURE,
  AUTHENTICATION_PENDING,
  AUTHENTICATION_TOKEN_REVOKED,
  AUTHENTICATION_TOKEN_NOT_REVOKED,
  AUTHENTICATION_LOGGED_OUT
} from './base-action-types';
import { settings } from 'service/settings';
import { getOAuth, getBaseIsAuthenticated } from 'src/redux/modules/base/base-selectors';
import { chatOpened } from 'src/redux/modules/chat';
import { emailValid,
  extractTokenId,
  isTokenRenewable,
  isTokenRevoked } from 'utility/utils';
import { mediator } from 'service/mediator';
import _ from 'lodash';
import { store } from 'service/persistence';
import { http } from 'service/transport';

function onAuthRequestSuccess(res, id, dispatch) {
  store.set(
    'zE_oauth',
    {
      'id': id,
      'token': res.body.oauth_token,
      'expiry': res.body.oauth_expiry,
      'createdAt': res.body.oauth_created_at
    }
  );
  mediator.channel.broadcast('authentication.onSuccess');
  dispatch({
    type: AUTHENTICATION_SUCCESS
  });
}

function onAuthRequestFailure(res, dispatch) {
  store.remove('zE_oauth');
  dispatch({
    type: AUTHENTICATION_FAILURE
  });
}

export const authenticate = (webToken) => {
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATION_PENDING
    });

    const oauth = getOAuth();
    const webTokenId = extractTokenId(webToken);
    const authenticationRequired = !getBaseIsAuthenticated() || (oauth && webTokenId !== oauth.id);

    if (authenticationRequired) {
      store.remove('zE_oauth');

      const payload = {
        method: 'POST',
        path: '/embeddable/authenticate',
        params: { body: webToken },
        timeout: 10000,
        callbacks: {
          done: (res) => onAuthRequestSuccess(res, webTokenId, dispatch),
          fail: (res) => onAuthRequestFailure(res, dispatch)
        }
      };

      http.send(payload);
    } else {
      mediator.channel.broadcast('authentication.onSuccess');
      dispatch({
        type: AUTHENTICATION_SUCCESS
      });
    }
  };
};

export const renewToken = () => {
  return (dispatch) => {
    const oauth = getOAuth();

    if (isTokenRenewable(oauth)) {
      const params = {
        body: settings.getSupportAuthSettings().jwt,
        token: {
          'oauth_token': oauth.token,
          'oauth_expiry': oauth.expiry
        }
      };
      const payload = {
        method: 'POST',
        path: '/embeddable/authenticate/renew',
        params: params,
        callbacks: {
          done: (res) => onAuthRequestSuccess(res, oauth.id, dispatch),
          fail: (res) => onAuthRequestFailure(res, dispatch)
        }
      };

      http.send(payload);
    }
  };
};

export const revokeToken = (revokedAt) => {
  const oauth = getOAuth();

  if (oauth && isTokenRevoked(oauth, revokedAt)) {
    store.remove('zE_oauth');
    return {
      type: AUTHENTICATION_TOKEN_REVOKED
    };
  }

  return {
    type: AUTHENTICATION_TOKEN_NOT_REVOKED
  };
};

export const logout = () => {
  store.remove('zE_oauth');
  return {
    type: AUTHENTICATION_LOGGED_OUT
  };
};

export const updateArturos = (payload) => {
  return {
    type: UPDATE_ARTUROS,
    payload
  };
};

export const updateActiveEmbed = (embedName) => {
  return (dispatch, getState) => {
    const widgetShown = getState().base.widgetShown;

    if (widgetShown && embedName === 'chat') {
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
