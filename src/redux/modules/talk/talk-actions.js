import _ from 'lodash';

import { http } from 'service/transport';
import { settings } from 'service/settings';
import { parseUrl } from 'utility/utils';
import {
  UPDATE_TALK_EMBEDDABLE_CONFIG,
  UPDATE_TALK_AGENT_AVAILABILITY,
  UPDATE_TALK_AVERAGE_WAIT_TIME,
  UPDATE_TALK_AVERAGE_WAIT_TIME_ENABLED,
  UPDATE_TALK_SCREEN,
  UPDATE_CALLBACK_FORM,
  TALK_CALLBACK_REQUEST,
  TALK_CALLBACK_SUCCESS,
  TALK_CALLBACK_FAILURE
} from './talk-action-types';
import { getFormState, getInitialScreen } from './talk-selectors';
import { updateBackButtonVisibility } from 'src/redux/modules/base';
import { getShowTalkBackButton } from 'src/redux/modules/selectors';

export function updateTalkEmbeddableConfig(config) {
  return {
    type: UPDATE_TALK_EMBEDDABLE_CONFIG,
    payload: _.omit(config, ['agentAvailability', 'averageWaitTime'])
  };
}

export function updateTalkAgentAvailability(availability) {
  return {
    type: UPDATE_TALK_AGENT_AVAILABILITY,
    payload: availability
  };
}

export function updateTalkAverageWaitTime(averageWaitTime) {
  return {
    type: UPDATE_TALK_AVERAGE_WAIT_TIME,
    payload: averageWaitTime
  };
}

export function updateTalkAverageWaitTimeEnabled(averageWaitTimeEnabled) {
  return {
    type: UPDATE_TALK_AVERAGE_WAIT_TIME_ENABLED,
    payload: averageWaitTimeEnabled
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

export function submitTalkCallbackForm(formState, serviceUrl, nickname) {
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
      keyword: settings.get('talk.nickname') || nickname
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
