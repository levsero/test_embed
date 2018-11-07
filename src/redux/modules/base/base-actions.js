import _ from 'lodash';
import * as actions from './base-action-types';
import { settings } from 'service/settings';
import { getOAuth,
  getBaseIsAuthenticated,
  getActiveEmbed } from 'src/redux/modules/base/base-selectors';
import { getHasContextuallySearched } from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { contextualSearch } from 'src/redux/modules/helpCenter';
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
    type: actions.AUTHENTICATION_SUCCESS
  });
}

function onAuthRequestFailure(res, dispatch) {
  store.remove('zE_oauth');
  dispatch({
    type: actions.AUTHENTICATION_FAILURE
  });
}

export const authenticate = (webToken) => {
  return (dispatch) => {
    dispatch({
      type: actions.AUTHENTICATION_PENDING
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
        type: actions.AUTHENTICATION_SUCCESS
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
      type: actions.AUTHENTICATION_TOKEN_REVOKED
    };
  }

  return {
    type: actions.AUTHENTICATION_TOKEN_NOT_REVOKED
  };
};

export const logout = () => {
  store.remove('zE_oauth');
  return {
    type: actions.AUTHENTICATION_LOGGED_OUT
  };
};

export const updateEmbeddableConfig = (rawEmbeddableConfig) => {
  return {
    type: actions.UPDATE_EMBEDDABLE_CONFIG,
    payload: rawEmbeddableConfig
  };
};

export const updateArturos = (payload) => {
  return {
    type: actions.UPDATE_ARTUROS,
    payload
  };
};

export const updateActiveEmbed = (embedName) => {
  return (dispatch) => {
    dispatch({
      type: actions.UPDATE_ACTIVE_EMBED,
      payload: embedName
    });
  };
};

export const updateEmbedAccessible = (name, accessible) => {
  return {
    type: actions.UPDATE_EMBED,
    payload: {
      name,
      params: { accessible }
    }
  };
};

export const updateBackButtonVisibility = (visible = true) => {
  return {
    type: actions.UPDATE_BACK_BUTTON_VISIBILITY,
    payload: visible
  };
};

export const updateWidgetShown = (show) => {
  const updateWidgetShownAction = {
    type: actions.UPDATE_WIDGET_SHOWN,
    payload: show
  };

  return (dispatch, getState) => {
    const state = getState();

    dispatch(updateWidgetShownAction);

    if (!getHasContextuallySearched(state) && show) {
      dispatch(contextualSearch());
    }
  };
};

export const handlePrefillReceived = (payload) => {
  const { name = {}, email = {}, phone = {} } = payload;
  let prefillValues = {};
  let isReadOnly = {};

  if (typeof name.readOnly === 'boolean') {
    isReadOnly.name = name.readOnly;
  }

  if (typeof email.readOnly === 'boolean') {
    isReadOnly.email = email.readOnly;
  }

  if (typeof phone.readOnly === 'boolean') {
    isReadOnly.phone = phone.readOnly;
  }

  if (_.isString(name.value)) {
    prefillValues.name = name.value;
  }

  if (emailValid(email.value)) {
    prefillValues.email = email.value;
  }

  if (PHONE_PATTERN.test(phone.value)) {
    prefillValues.phone = phone.value;
  }

  return {
    type: actions.PREFILL_RECEIVED,
    payload: { prefillValues, isReadOnly }
  };
};

export const updateQueue = (payload) => {
  return {
    type: actions.UPDATE_QUEUE,
    payload
  };
};

export const removeFromQueue = (methodName) => {
  return {
    type: actions.REMOVE_FROM_QUEUE,
    payload: methodName
  };
};

export const widgetHideAnimationComplete = () => {
  return {
    type: actions.WIDGET_HIDE_ANIMATION_COMPLETE
  };
};

export const executeApiOnCloseCallback = () => {
  return {
    type: actions.EXECUTE_API_ON_CLOSE_CALLBACK
  };
};

export const handleCloseButtonClicked = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLOSE_BUTTON_CLICKED
    });

    dispatch(executeApiOnCloseCallback());
  };
};

export const handleOnApiCalled = (actionType, selectors=[], callback) => {
  return {
    type: actions.API_ON_RECEIVED,
    payload: { actionType, selectors, callback }
  };
};

export const apiClearForm = () => {
  mediator.channel.broadcast('.clear');

  return {
    type: actions.API_CLEAR_FORM
  };
};

export const apiClearHcSearches = () => {
  return {
    type: actions.API_CLEAR_HC_SEARCHES
  };
};

export const apiResetWidget = () => {
  return (dispatch) => {
    dispatch(apiClearForm());
    dispatch(apiClearHcSearches());
    dispatch({
      type: actions.API_RESET_WIDGET
    });
  };
};

export const executeApiOnOpenCallback = () => {
  return {
    type: actions.EXECUTE_API_ON_OPEN_CALLBACK
  };
};

export const launcherClicked = () => {
  return (dispatch, getState) => {
    const state = getState();

    if (getActiveEmbed(state) === 'zopimChat') {
      mediator.channel.broadcast('zopimChat.show');
    } else {
      dispatch({ type: actions.LAUNCHER_CLICKED });
    }
    dispatch(executeApiOnOpenCallback());
  };
};

export const widgetInitialised = () => {
  return (dispatch) => {
    dispatch({
      type: actions.WIDGET_INITIALISED
    });

    setTimeout(() => dispatch({ type: actions.BOOT_UP_TIMER_COMPLETE }), 5000);
  };
};

export const activateRecieved = (options = {}) => {
  return (dispatch, getState) => {
    const state = getState();

    if (getActiveEmbed(state) === 'zopimChat') {
      mediator.channel.broadcast('zopimChat.show');
    }

    dispatch({
      type: actions.ACTIVATE_RECEIVED,
      payload: options
    });
  };
};

export const hideRecieved = () => {
  return (dispatch, getState) => {
    const state = getState();

    // Handle zopim chat standalone.
    mediator.channel.broadcast('.hide');

    // Handle with other embeds.
    if (getActiveEmbed(state) === 'zopimChat') {
      mediator.channel.broadcast('zopimChat.hide');
    }

    dispatch({
      type: actions.HIDE_RECEIVED
    });
  };
};

export const showRecieved = () => {
  return {
    type: actions.SHOW_RECEIVED
  };
};

export const legacyShowReceived = () => {
  mediator.channel.broadcast('.show');

  return {
    type: actions.LEGACY_SHOW_RECEIVED
  };
};

export const openReceived = () => {
  return {
    type: actions.OPEN_RECEIVED
  };
};

export const closeReceived = () => {
  return {
    type: actions.CLOSE_RECEIVED
  };
};
export const toggleReceived = () => {
  return {
    type: actions.TOGGLE_RECEIVED
  };
};

export const nextButtonClicked = () => {
  return {
    type: actions.NEXT_BUTTON_CLICKED
  };
};

export const cancelButtonClicked = () => {
  return {
    type: actions.CANCEL_BUTTON_CLICKED
  };
};
