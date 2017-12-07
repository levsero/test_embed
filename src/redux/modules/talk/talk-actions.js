import {
  UPDATE_SCREEN,
  UPDATE_CALLBACK_FORM,
  TALK_CALLBACK_REQUEST,
  TALK_CALLBACK_SUCCESS,
  TALK_CALLBACK_FAILURE
} from './talk-action-types';
import { getFormState } from './talk-selectors';
import { http } from 'service/transport';
import _ from 'lodash';

export function updateTalkCallbackForm(formState) {
  return {
    type: UPDATE_CALLBACK_FORM,
    payload: formState
  };
}

export function updateTalkScreen(screen) {
  return {
    type: UPDATE_SCREEN,
    payload: screen
  };
}

export function submitTalkCallbackForm(formState, subdomain, serviceUrl, keyword) {
  return (dispatch, getState) => {
    const formState = getFormState(getState());
    const additionalInfo = _.pickBy({
      email: formState.email,
      name: formState.name,
      description: formState.description
    }, _.identify);
    const params = {
      phoneNumber: formState.phone,
      additionalInfo,
      subdomain,
      keyword
    };
    const callbacks = {
      done: () => {
        dispatch({
          type: TALK_CALLBACK_SUCCESS,
          payload: formState
        });
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
