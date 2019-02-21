import {
  QUESTION_SUBMITTED_PENDING,
  QUESTION_SUBMITTED_FULFILLED
} from '../action-types';

import {
  BOT_MESSAGE,
  BOT_CHANNEL_CHOICE,
  BOT_FEEDBACK,
  BOT_FEEDBACK_REQUESTED
} from '../../root/action-types';

const initialState = new Map();

let messageCount = 0;

const addMessage = (messages, message) => {
  const copy = new Map(messages);

  return copy.set(messageCount++, { ...message });
};

const messages = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case QUESTION_SUBMITTED_PENDING:
      return addMessage(state, { ...payload, isVisitor: true });
    case QUESTION_SUBMITTED_FULFILLED:
      const {
        message, // eslint-disable-line no-unused-vars
        ...rest
      } = payload;

      return addMessage(state, { ...rest, type: 'results' });
    case BOT_MESSAGE:
      return addMessage(state, payload);
    case BOT_CHANNEL_CHOICE:
      return addMessage(state, { ...payload, type: 'channelChoice' });
    case BOT_FEEDBACK:
      return addMessage(state, { ...payload, isVisitor: true, type: 'feedback' });
    case BOT_FEEDBACK_REQUESTED:
      return addMessage(state, { ...payload, type: 'feedbackRequested' });
    default:
      return state;
  }
};

export default messages;
