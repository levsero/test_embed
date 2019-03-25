import _ from 'lodash';

import {
  BOT_MESSAGE,
  BOT_GREETED,
  BOT_INITIAL_FALLBACK,
  BOT_CHANNEL_CHOICE,
  BOT_FEEDBACK,
  BOT_FEEDBACK_REQUESTED,
  BOT_TYPING
} from '../action-types';

import {
  getCurrentSessionID
} from 'src/redux/modules/answerBot/root/selectors';

const generateBotMessage = (state, message, callback) => {
  const sessionID = getCurrentSessionID(state);

  return {
    type: BOT_MESSAGE,
    payload: {
      message,
      sessionID,
      timestamp: Date.now(),
      callback: _.isFunction(callback) ? _.once(callback) : null
    }
  };
};

export const botMessage = (message, callback) => {
  return (dispatch, getState) => {
    dispatch(generateBotMessage(getState(), message, callback));
  };
};

export const botChannelChoice = (message, fallback = false) => {
  return {
    type: BOT_CHANNEL_CHOICE,
    payload: {
      timestamp: Date.now(),
      message,
      fallback
    }
  };
};

export const botFeedbackChannelChoice = (message, fallback = false) => {
  return {
    type: BOT_CHANNEL_CHOICE,
    payload: {
      timestamp: Date.now(),
      feedbackRelated: true,
      message,
      fallback
    }
  };
};

export const botFeedback = (feedbackType = 'primary') => {
  return {
    type: BOT_FEEDBACK,
    payload: {
      feedbackType,
      timestamp: Date.now()
    }
  };
};

export const botFeedbackRequested = () => {
  return {
    type: BOT_FEEDBACK_REQUESTED
  };
};

export const botGreeted = () => {
  return {
    type: BOT_GREETED,
    payload: true
  };
};

export const botInitialFallback = () => {
  return {
    type: BOT_INITIAL_FALLBACK,
    payload: true
  };
};

export const botUserMessage = (message) => {
  return {
    type: BOT_MESSAGE,
    payload: {
      timestamp: Date.now(),
      feedbackRelated: true,
      isVisitor: true,
      message
    }
  };
};

export const botFeedbackMessage = (message, callback) => {
  return {
    type: BOT_MESSAGE,
    payload: {
      timestamp: Date.now(),
      feedbackRelated: true,
      message,
      callback: _.isFunction(callback) ? _.once(callback) : null
    }
  };
};

export const botTyping = () => {
  return {
    type: BOT_TYPING,
    payload: {
      timestamp: Date.now()
    }
  };
};
