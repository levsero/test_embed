import _ from 'lodash';

import { logging } from 'service/logging';
import { http, socketio } from 'service/transport';
import { parseUrl } from 'utility/utils';
import {
  TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
  TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
  TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT,
  TALK_DISCONNECT_SOCKET_EVENT,
  UPDATE_TALK_SCREEN,
  UPDATE_CALLBACK_FORM,
  TALK_CALLBACK_REQUEST,
  TALK_CALLBACK_SUCCESS,
  TALK_CALLBACK_FAILURE,
  TALK_VENDOR_LOADED
} from './talk-action-types';
import { getFormState, getInitialScreen } from './talk-selectors';
import { updateBackButtonVisibility } from 'src/redux/modules/base';
import { getShowTalkBackButton } from 'src/redux/modules/selectors';

export function updateTalkEmbeddableConfig(config) {
  return {
    type: TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
    payload: config
  };
}

export function updateTalkAgentAvailability(availability) {
  return {
    type: TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
    payload: availability
  };
}

export function updateTalkAverageWaitTime(averageWaitTime) {
  return {
    type: TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT,
    payload: averageWaitTime
  };
}

export function talkDisconnect() {
  return {
    type: TALK_DISCONNECT_SOCKET_EVENT
  };
}

export function updateTalkScreen(screen) {
  return {
    type: UPDATE_TALK_SCREEN,
    payload: screen
  };
}

export function resetTalkScreen() {
  return (dispatch, getState) => {
    dispatch(updateTalkScreen(getInitialScreen(getState())));

    const talkBackButtonAvailable = getShowTalkBackButton(getState());

    dispatch(updateBackButtonVisibility(talkBackButtonAvailable));
  };
}

export function updateTalkCallbackForm(formState) {
  return {
    type: UPDATE_CALLBACK_FORM,
    payload: formState
  };
}

export function submitTalkCallbackForm(serviceUrl, nickname) {
  return (dispatch, getState) => {
    const formState = getFormState(getState());
    const additionalInfo = _.pickBy({
      name: formState.name,
      description: formState.description
    }, _.identify);
    const subdomain = parseUrl(serviceUrl).hostname.split('.')[0];
    const params = {
      phoneNumber: formState.phone,
      additionalInfo,
      subdomain,
      keyword: nickname
    };
    const callbacks = {
      done: () => {
        dispatch({ type: TALK_CALLBACK_SUCCESS, payload: formState });
        dispatch(updateTalkCallbackForm({}));
        dispatch(updateBackButtonVisibility(false));
      },
      fail: (err) => {
        const errorMessage = err.responseJSON ? err.responseJSON.error : JSON.parse(err.response.text).error;
        const error = {
          message: errorMessage,
          status: err.status
        };

        dispatch({
          type: TALK_CALLBACK_FAILURE,
          payload: error
        });
      }
    };

    dispatch({
      type: TALK_CALLBACK_REQUEST,
      payload: formState
    });

    http.callMeRequest(serviceUrl, {
      params,
      callbacks
    });
  };
}

export function loadTalkVendors(vendors, serviceUrl, nickname) {
  return (dispatch) => {
    const onSuccess = ([{ default: io }, libphonenumber]) => {
      dispatch(handleTalkVendorLoaded({ io, libphonenumber }));
      if (_.isEmpty(nickname)) return;

      const socket = socketio.connect(io, serviceUrl, nickname);

      socketio.mapEventsToActions(socket, { dispatch });
    };
    const onFailure = (err) => {
      logging.error(err);
    };

    return Promise
      .all(vendors)
      .then(onSuccess)
      .catch(onFailure);
  };
}

export function handleTalkVendorLoaded(vendor) {
  return {
    type: TALK_VENDOR_LOADED,
    payload: vendor
  };
}
