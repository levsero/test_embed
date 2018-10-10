import _ from 'lodash';
import {
  UPDATE_ACTIVE_EMBED,
  UPDATE_ARTUROS,
  UPDATE_EMBED,
  UPDATE_BACK_BUTTON_VISIBILITY,
  UPDATE_WIDGET_SHOWN,
  PREFILL_RECEIVED,
  API_ON_RECEIVED,
  WIDGET_HIDE_ANIMATION_COMPLETE,
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAILURE,
  AUTHENTICATION_PENDING,
  AUTHENTICATION_TOKEN_REVOKED,
  AUTHENTICATION_TOKEN_NOT_REVOKED,
  AUTHENTICATION_LOGGED_OUT,
  CLOSE_BUTTON_CLICKED,
  UPDATE_EMBEDDABLE_CONFIG,
  UPDATE_QUEUE,
  REMOVE_FROM_QUEUE,
  API_CLEAR_FORM,
  LAUNCHER_CLICKED
} from './base-action-types';
import { settings } from 'service/settings';
import { getOAuth,
  getBaseIsAuthenticated,
  getActiveEmbed } from 'src/redux/modules/base/base-selectors';
import { getHasContextuallySearched } from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { contextualSearch } from 'src/redux/modules/helpCenter';
import { chatOpened } from 'src/redux/modules/chat';
import { extractTokenId,
  isTokenRenewable } from 'src/redux/modules/base/helpers/auth';
import { emailValid } from 'src/util/utils';
import { mediator } from 'service/mediator';
import { store } from 'service/persistence';
import { http } from 'service/transport';
import { PHONE_PATTERN } from 'src/constants/shared';

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

  if (oauth && oauth.createdAt <= revokedAt) {
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

export const updateEmbeddableConfig = (rawEmbeddableConfig) => {
  return {
    type: UPDATE_EMBEDDABLE_CONFIG,
    payload: rawEmbeddableConfig
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
    const state = getState();
    const activeEmbed = getActiveEmbed(state);

    dispatch(updateWidgetShownAction);

    if (activeEmbed === 'chat' && show) {
      dispatch(chatOpened());
    }

    if (!getHasContextuallySearched(state) && show) {
      dispatch(contextualSearch());
    }
  };
};

export const handlePrefillReceived = (payload) => {
  const { name = {}, email = {}, phone = {} } = payload;
  const prefillValues = {
    name: _.toString(name.value),
    email: '',
    phone: ''
  };
  const isReadOnly = {
    name: Boolean(name.readOnly),
    email: Boolean(email.readOnly),
    phone: Boolean(phone.readOnly)
  };

  if (emailValid(email.value)) {
    prefillValues.email = email.value;
  }

  if (PHONE_PATTERN.test(phone.value)) {
    prefillValues.phone = phone.value;
  }

  return {
    type: PREFILL_RECEIVED,
    payload: { prefillValues, isReadOnly }
  };
};

export const updateQueue = (payload) => {
  return {
    type: UPDATE_QUEUE,
    payload
  };
};

export const removeFromQueue = (methodName) => {
  return {
    type: REMOVE_FROM_QUEUE,
    payload: methodName
  };
};

export const widgetHideAnimationComplete = () => {
  return {
    type: WIDGET_HIDE_ANIMATION_COMPLETE
  };
};

export const handleCloseButtonClicked = () => {
  return {
    type: CLOSE_BUTTON_CLICKED
  };
};

export const handleOnApiCalled = (actionType, selectors=[], callback) => {
  return {
    type: API_ON_RECEIVED,
    payload: { actionType, selectors, callback }
  };
};

export const apiClearForm = () => {
  return {
    type: API_CLEAR_FORM
  };
};

export const launcherClicked = () => {
  return {
    type: LAUNCHER_CLICKED
  };
};
