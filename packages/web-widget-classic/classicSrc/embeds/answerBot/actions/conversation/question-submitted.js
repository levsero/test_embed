import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { botTyping } from 'classicSrc/embeds/answerBot/actions/root/bot'
import { sessionStarted } from 'classicSrc/embeds/answerBot/actions/sessions'
import { WEB_WIDGET_SUID } from 'classicSrc/embeds/answerBot/constants'
import {
  getCurrentSessionID,
  getCurrentRequestStatus,
  getQuestionValueChangedTime,
} from 'classicSrc/embeds/answerBot/selectors/root'
import { isInitialSession } from 'classicSrc/embeds/answerBot/selectors/sessions'
import { getAuthToken } from 'classicSrc/redux/modules/base/base-selectors'
import { getAnswerBotSearchLabels } from 'classicSrc/redux/modules/settings/settings-selectors'
import { settings } from 'classicSrc/service/settings'
import { http } from 'classicSrc/service/transport'
import _ from 'lodash'
import { identity, isOnHostMappedDomain } from '@zendesk/widget-shared-services'
import {
  QUESTION_VALUE_SUBMITTED,
  QUESTION_SUBMITTED_PENDING,
  QUESTION_SUBMITTED_FULFILLED,
  QUESTION_SUBMITTED_REJECTED,
} from './action-types'

const BOT_THINKING_DELAY = 3000

function messagePayload(message, sessionID) {
  return {
    message,
    sessionID,
    timestamp: Date.now(),
  }
}

function questionSubmittedPending(message, sessionID) {
  return {
    type: QUESTION_SUBMITTED_PENDING,
    payload: messagePayload(message, sessionID),
  }
}

function questionValueSubmitted(message) {
  return {
    type: QUESTION_VALUE_SUBMITTED,
    payload: messagePayload(message),
  }
}

function questionSubmittedFulfilled(data, sessionID) {
  // eslint-disable-next-line babel/camelcase
  const { deflection_articles, deflection, interaction_access_token } = data

  return {
    type: QUESTION_SUBMITTED_FULFILLED,
    payload: {
      ...messagePayload(deflection_articles, sessionID),
      deflection,
      interaction_access_token,
    },
  }
}

function questionSubmittedRejected(error, sessionID) {
  return {
    type: QUESTION_SUBMITTED_REJECTED,
    payload: {
      error,
      sessionID,
    },
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
  const { getSuid } = identity
  const token = getAuthToken()

  const callbacks = {
    done: (res) => {
      if (res.body.deflection_articles.length || !locale) {
        dispatch(questionSubmittedFulfilled(res.body, sessionID))
      } else if (locale) {
        sendQuery(enquiry, labels, null, dispatch, sessionID)
      }
    },
    fail: (err) => {
      dispatch(questionSubmittedRejected(err, sessionID))
    },
  }

  http.send({
    timeout: 10000,
    callbacks,
    method: 'post',
    path: '/api/v2/answer_bot/interaction?include=html_body',
    useHostMappingIfAvailable: isOnHostMappedDomain(),
    params: {
      via_id: settings.get('viaIdAnswerBot'),
      deflection_channel_id: settings.get('viaIdAnswerBot'),
      interaction_reference: getSuid().id || null,
      interaction_reference_type: WEB_WIDGET_SUID,
      locale,
      enquiry,
      labels,
    },
    authorization: token ? `Bearer ${token}` : '',
  })
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
    setTimeout(function () {
      const timeSinceValueChange = Date.now() - getQuestionValueChangedTime(getState())

      if (timeSinceValueChange < BOT_THINKING_DELAY) return submitMessageLoop()

      submitQuestion(dispatch, getState)
      resetSubmittingMessagesState()
    }, 1000)
  })()
}

export const questionSubmitted = (message) => {
  return (dispatch, getState) => {
    dispatch(questionValueSubmitted(message))
    dispatch(botTyping())

    messages.push(message)
    submitMessagesOnTypingCompleted(dispatch, getState)
  }
}
