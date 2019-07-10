import {
  BOT_MESSAGE,
  BOT_GREETED,
  BOT_INITIAL_FALLBACK,
  BOT_CHANNEL_CHOICE,
  BOT_FEEDBACK,
  BOT_FEEDBACK_REQUESTED,
  BOT_TYPING,
  BOT_CONTEXTUAL_SEARCH_RESULTS
} from '../action-types'
import { getChannelAvailable } from 'src/redux/modules/selectors/selectors'
import { getInTouchShown } from 'src/redux/modules/answerBot/conversation/actions/get-in-touch-shown'
import { i18n } from 'service/i18n'

import { getCurrentSessionID } from 'src/redux/modules/answerBot/root/selectors'

const generateBotMessage = (state, message, payloadOptions = {}) => {
  const sessionID = getCurrentSessionID(state)
  const payload = {
    ...payloadOptions,
    message,
    sessionID,
    timestamp: Date.now()
  }

  return {
    type: BOT_MESSAGE,
    payload
  }
}

export const botMessage = message => {
  return (dispatch, getState) => {
    dispatch(generateBotMessage(getState(), message))
  }
}

export const botFallbackMessage = (feedbackRelated = false) => (dispatch, getState) => {
  const state = getState()
  const channelAvailable = getChannelAvailable(state)
  const options = feedbackRelated ? { feedbackRelated } : {}

  if (channelAvailable) {
    dispatch(
      generateBotMessage(
        state,
        i18n.t('embeddable_framework.answerBot.msg.prompt_again_no_channels_available'),
        options
      )
    )
    dispatch(
      generateBotMessage(
        state,
        i18n.t('embeddable_framework.answerBot.msg.initial_fallback'),
        options
      )
    )
  } else {
    dispatch(
      generateBotMessage(
        state,
        i18n.t('embeddable_framework.answerBot.msg.prompt_again_after_yes'),
        options
      )
    )
  }

  dispatch(getInTouchShown())
}

export const botChannelChoice = (message, fallback = false) => {
  return {
    type: BOT_CHANNEL_CHOICE,
    payload: {
      timestamp: Date.now(),
      message,
      fallback
    }
  }
}

export const botFeedback = (feedbackType = 'primary') => {
  return {
    type: BOT_FEEDBACK,
    payload: {
      feedbackType,
      timestamp: Date.now()
    }
  }
}

export const botFeedbackRequested = () => {
  return {
    type: BOT_FEEDBACK_REQUESTED
  }
}

export const botGreeted = () => {
  return {
    type: BOT_GREETED,
    payload: true
  }
}

export const botInitialFallback = () => {
  return {
    type: BOT_INITIAL_FALLBACK,
    payload: true
  }
}

export const botUserMessage = message => {
  return {
    type: BOT_MESSAGE,
    payload: {
      timestamp: Date.now(),
      feedbackRelated: true,
      isVisitor: true,
      message
    }
  }
}

export const botFeedbackMessage = message => {
  return {
    type: BOT_MESSAGE,
    payload: {
      timestamp: Date.now(),
      feedbackRelated: true,
      message
    }
  }
}

export const botTyping = () => {
  return {
    type: BOT_TYPING,
    payload: {
      timestamp: Date.now()
    }
  }
}

export const botContextualSearchResults = () => {
  return {
    type: BOT_CONTEXTUAL_SEARCH_RESULTS,
    payload: {
      timestamp: Date.now()
    }
  }
}
