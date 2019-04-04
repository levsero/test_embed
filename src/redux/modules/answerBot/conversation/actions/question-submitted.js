import { settings } from 'service/settings';
import { identity } from 'service/identity';
import { http } from 'service/transport';

import { WEB_WIDGET_SUID } from 'src/constants/answerBot';

import {
  QUESTION_SUBMITTED_PENDING,
  QUESTION_SUBMITTED_FULFILLED,
  QUESTION_SUBMITTED_REJECTED
} from '../action-types';

import { isInitialSession } from 'src/redux/modules/answerBot/sessions/selectors';
import {
  getCurrentSessionID,
  getCurrentRequestStatus
} from 'src/redux/modules/answerBot/root/selectors';
import { getAuthToken } from 'src/redux/modules/base/base-selectors';
import { getAnswerBotSearchLabels } from 'src/redux/modules/settings/settings-selectors';

import { sessionStarted } from '../../sessions/actions';
import { inputDisabled } from '../../root/actions';

function messagePayload(message, sessionID) {
  return {
    message,
    sessionID,
    timestamp: Date.now()
  };
}

function questionSubmittedPending(message, sessionID) {
  return {
    type: QUESTION_SUBMITTED_PENDING,
    payload: messagePayload(message, sessionID)
  };
}

function questionSubmittedFulfilled(data, sessionID) {
  const { deflection_articles, deflection, interaction_access_token } = data; // eslint-disable-line camelcase

  return {
    type: QUESTION_SUBMITTED_FULFILLED,
    payload: {
      ...messagePayload(deflection_articles, sessionID),
      deflection,
      interaction_access_token // eslint-disable-line camelcase
    }
  };
}

function questionSubmittedRejected(error, sessionID) {
  return {
    type: QUESTION_SUBMITTED_REJECTED,
    payload: {
      error,
      sessionID
    }
  };
}

function getSessionID(getState, createSessionCallback) {
  const state = getState();
  const initialSession = isInitialSession(state);

  if (!initialSession || (initialSession && getCurrentRequestStatus(state) !== null)) {
    createSessionCallback();
  }

  // It's intentional to use getState() here instead of state, because
  // state might have been changed by createSessionCallback()
  return getCurrentSessionID(getState());
}

export const questionSubmitted = (message) => {
  return (dispatch, getState) => {
    const sessionID = getSessionID(getState, () => {
      dispatch(sessionStarted());
    });
    const labels = getAnswerBotSearchLabels(getState());

    dispatch(inputDisabled(true));
    dispatch(questionSubmittedPending(message, sessionID));

    const callbacks = {
      done: (res) => {
        dispatch(questionSubmittedFulfilled(res.body, sessionID));
      },
      fail: (err) => {
        dispatch(questionSubmittedRejected(err, sessionID));
      }
    };

    const token = getAuthToken();

    /* eslint-disable camelcase */
    http.send({
      callbacks,
      method: 'post',
      path: '/api/v2/answer_bot/interaction?include=html_body',
      params: {
        via_id: settings.get('viaIdAnswerBot'),
        deflection_channel_id: settings.get('viaIdAnswerBot'),
        interaction_reference: identity.getSuid().id || null,
        interaction_reference_type: WEB_WIDGET_SUID,
        enquiry: message,
        labels
      },
      authorization: token ? `Bearer ${token}` : '',
    });
    /* eslint-enable camelcase */
  };
};
