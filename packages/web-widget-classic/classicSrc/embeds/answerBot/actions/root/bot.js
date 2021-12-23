import { getInTouchShown } from 'classicSrc/embeds/answerBot/actions/conversation/get-in-touch-shown'
import { getCurrentSessionID } from 'classicSrc/embeds/answerBot/selectors/root'
import { getChannelAvailable } from 'classicSrc/redux/modules/selectors/selectors'
import {
  BOT_MESSAGE,
  BOT_GREETED,
  BOT_INITIAL_FALLBACK,
  BOT_CHANNEL_CHOICE,
  BOT_FEEDBACK,
  BOT_FEEDBACK_REQUESTED,
  BOT_TYPING,
  BOT_CONTEXTUAL_SEARCH_RESULTS,
} from './action-types'

const generateBotMessage = (state, key, interpolation = {}, payloadOptions = {}) => {
  const sessionID = getCurrentSessionID(state)
  const payload = {
    ...payloadOptions,
    message: { key, interpolation },
    sessionID,
    timestamp: Date.now(),
  }

  return {
    type: BOT_MESSAGE,
    payload,
  }
}

export const botMessage = (key, interpolation = {}) => {
  return (dispatch, getState) => {
    dispatch(generateBotMessage(getState(), key, interpolation))
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
        'embeddable_framework.answerBot.msg.prompt_again_no_channels_available',
        {},
        options
      )
    )
    dispatch(
      generateBotMessage(state, 'embeddable_framework.answerBot.msg.initial_fallback', {}, options)
    )
  } else {
    dispatch(
      generateBotMessage(
        state,
        'embeddable_framework.answerBot.msg.prompt_again_after_yes',
        {},
        options
      )
    )
  }

  dispatch(getInTouchShown())
}

export const botChannelChoice = (key, interpolation = {}, fallback = false) => {
  return {
    type: BOT_CHANNEL_CHOICE,
    payload: {
      timestamp: Date.now(),
      message: { key, interpolation },
      fallback,
    },
  }
}

export const botFeedback = (feedbackType = 'primary') => {
  return {
    type: BOT_FEEDBACK,
    payload: {
      feedbackType,
      timestamp: Date.now(),
    },
  }
}

export const botFeedbackRequested = () => {
  return {
    type: BOT_FEEDBACK_REQUESTED,
  }
}

export const botGreeted = () => {
  return {
    type: BOT_GREETED,
    payload: true,
  }
}

export const botInitialFallback = () => {
  return {
    type: BOT_INITIAL_FALLBACK,
    payload: true,
  }
}

export const botUserMessage = (key, interpolation = {}) => {
  return {
    type: BOT_MESSAGE,
    payload: {
      timestamp: Date.now(),
      feedbackRelated: true,
      isVisitor: true,
      message: { key, interpolation },
    },
  }
}

export const botFeedbackMessage = (key, interpolation = {}) => {
  return {
    type: BOT_MESSAGE,
    payload: {
      timestamp: Date.now(),
      feedbackRelated: true,
      message: { key, interpolation },
    },
  }
}

export const botTyping = () => {
  return {
    type: BOT_TYPING,
    payload: {
      timestamp: Date.now(),
    },
  }
}

export const botContextualSearchResults = () => {
  return {
    type: BOT_CONTEXTUAL_SEARCH_RESULTS,
    payload: {
      timestamp: Date.now(),
    },
  }
}
