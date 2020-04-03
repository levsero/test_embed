import _ from 'lodash'
import { settings } from 'service/settings'
import { identity } from 'service/identity'
import { i18n } from 'service/i18n'
import { http } from 'service/transport'

import { isOnHostMappedDomain } from 'utility/pages'

import { WEB_WIDGET_SUID } from 'src/constants/answerBot'

import {
  QUESTION_VALUE_SUBMITTED,
  QUESTION_SUBMITTED_PENDING,
  QUESTION_SUBMITTED_FULFILLED,
  QUESTION_SUBMITTED_REJECTED
} from './action-types'

import { isInitialSession } from 'src/redux/modules/answerBot/sessions/selectors'
import {
  getCurrentSessionID,
  getCurrentRequestStatus,
  getQuestionValueChangedTime
} from 'src/redux/modules/answerBot/root/selectors'
import { getAuthToken } from 'src/redux/modules/base/base-selectors'
import { getAnswerBotSearchLabels } from 'src/redux/modules/settings/settings-selectors'

import { sessionStarted } from 'src/redux/modules/answerBot/sessions/actions'
import { botTyping } from 'src/redux/modules/answerBot/root/actions/bot'

const BOT_THINKING_DELAY = 3000

function messagePayload(message, sessionID) {
  return {
    message,
    sessionID,
    timestamp: Date.now()
  }
}

function questionSubmittedPending(message, sessionID) {
  return {
    type: QUESTION_SUBMITTED_PENDING,
    payload: messagePayload(message, sessionID)
  }
}

function questionValueSubmitted(message) {
  return {
    type: QUESTION_VALUE_SUBMITTED,
    payload: messagePayload(message)
  }
}

function questionSubmittedFulfilled(data, sessionID) {
  const { deflection_articles, deflection, interaction_access_token } = data

  return {
    type: QUESTION_SUBMITTED_FULFILLED,
    payload: {
      ...messagePayload(deflection_articles, sessionID),
      deflection,
      interaction_access_token
    }
  }
}

function questionSubmittedRejected(error, sessionID) {
  return {
    type: QUESTION_SUBMITTED_REJECTED,
    payload: {
      error,
      sessionID
    }
  }
}

function getSessionID(getState, createSessionCallback) {
  const state = getState()
  const initialSession = isInitialSession(state)

  if (!initialSession || (initialSession && getCurrentRequestStatus(state) !== null)) {
    createSessionCallback()
  }

  // It's intentional to use getState() here instead of state, because
  // state might have been changed by createSessionCallback()
  return getCurrentSessionID(getState())
}

function sendQuery(enquiry, labels, locale, dispatch, sessionID) {
  const token = getAuthToken()

  const callbacks = {
    done: res => {
      if (res.body.deflection_articles.length || !locale) {
        dispatch(questionSubmittedFulfilled(res.body, sessionID))
      } else if (locale) {
        sendQuery(enquiry, labels, null, dispatch, sessionID)
      }
    },
    fail: err => {
      dispatch(questionSubmittedRejected(err, sessionID))
    }
  }

  /* eslint-disable camelcase */
  http.send({
    timeout: 10000,
    callbacks,
    method: 'post',
    path: '/api/v2/answer_bot/interaction?include=html_body',
    useHostMappingIfAvailable: isOnHostMappedDomain(),
    params: {
      via_id: settings.get('viaIdAnswerBot'),
      deflection_channel_id: settings.get('viaIdAnswerBot'),
      interaction_reference: identity.getSuid().id || null,
      interaction_reference_type: WEB_WIDGET_SUID,
      locale,
      enquiry,
      labels
    },
    authorization: token ? `Bearer ${token}` : ''
  })
  /* eslint-enable camelcase */
}

let messages = []
let waitingToSubmit = false

export const resetSubmittingMessagesState = () => {
  messages = []
  waitingToSubmit = false
}

const submitQuestion = (dispatch, getState) => {
  const sessionID = getSessionID(getState, () => {
    dispatch(sessionStarted())
  })

  const labels = getAnswerBotSearchLabels(getState())
  const message = _.join(messages, ' ')

  dispatch(questionSubmittedPending(message, sessionID))
  sendQuery(message, labels, i18n.getLocale(), dispatch, sessionID)
}

// Only submit the user request after BOT_THINKING_DELAY seconds of the user not typing
const submitMessagesOnTypingCompleted = (dispatch, getState) => {
  if (waitingToSubmit) return
  waitingToSubmit = true
  ;(function submitMessageLoop() {
    setTimeout(function() {
      const timeSinceValueChange = Date.now() - getQuestionValueChangedTime(getState())

      if (timeSinceValueChange < BOT_THINKING_DELAY) return submitMessageLoop()

      submitQuestion(dispatch, getState)
      resetSubmittingMessagesState()
    }, 1000)
  })()
}

export const questionSubmitted = message => {
  return (dispatch, getState) => {
    dispatch(questionValueSubmitted(message))
    dispatch(botTyping())

    messages.push(message)
    submitMessagesOnTypingCompleted(dispatch, getState)
  }
}
