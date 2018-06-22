import _ from 'lodash';
import { GA } from 'service/analytics/googleAnalytics';
import { UPDATE_ACTIVE_EMBED } from 'src/redux/modules/base/base-action-types';
import { SDK_CHAT_MEMBER_JOIN,
  OFFLINE_FORM_REQUEST_SUCCESS,
  SDK_CHAT_RATING,
  SDK_CHAT_COMMENT,
  PRE_CHAT_FORM_SUBMIT } from 'src/redux/modules/chat/chat-action-types';
import { getIsChatting,
  getDepartments } from 'src/redux/modules/chat/chat-selectors';
import { isAgent } from 'src/util/chat';

const loadtime = Date.now();

const getDepartmentName = (payload, prevState) => {
  const deptId = parseInt(payload.department);

  return _.get(getDepartments(prevState)[deptId], 'name');
};

const trackChatOpened = (payload, prevState) => {
  const isChatting = getIsChatting(prevState);

  if (!isChatting && payload === 'chat') {
    GA.track('Chat Opened');
  }
};

const trackChatServedByOperator = (payload, isAfterLoadTime) => {
  if (isAgent(payload.detail.nick) && isAfterLoadTime) {
    GA.track('Chat Served by Operator', payload.detail.display_name);
  }
};

const trackChatRating = (payload, isAfterLoadTime) => {
  const rating = payload.detail.new_rating;

  if (isAfterLoadTime) {
    if (rating) {
      GA.track(`Chat Rating ${_.startCase(payload.detail.new_rating)}`);
    } else {
      GA.track('Chat Rating Removed');
    }
  }
};

const trackChatComment = (isAfterLoadTime) => {
  if (isAfterLoadTime) {
    GA.track('Chat Comment Submitted');
  }
};

const trackChatRequestFormSubmitted = (payload, prevState) => {
  GA.track('Chat Request Form Submitted', getDepartmentName(payload, prevState));
};

const trackOfflineMessageSent = (payload, prevState) => {
  GA.track('Chat Offline Message Sent', getDepartmentName(payload, prevState));
};

export function trackAnalytics({ getState }) {
  return (next) => (action) => {
    const { type, payload } = action;
    const prevState = getState();
    // To avoid resending events during the replay when the page is refreshed.
    const isAfterLoadTime = _.get(payload, 'detail.timestamp') > loadtime;

    switch (type) {
      case UPDATE_ACTIVE_EMBED:
        trackChatOpened(payload, prevState);
        break;
      case SDK_CHAT_MEMBER_JOIN:
        trackChatServedByOperator(payload, isAfterLoadTime);
        break;
      case OFFLINE_FORM_REQUEST_SUCCESS:
        trackOfflineMessageSent(payload, prevState);
        break;
      case SDK_CHAT_RATING:
        trackChatRating(payload, isAfterLoadTime);
        break;
      case SDK_CHAT_COMMENT:
        trackChatComment(isAfterLoadTime);
        break;
      case PRE_CHAT_FORM_SUBMIT:
        trackChatRequestFormSubmitted(payload, prevState);
        break;
    }
    return next(action);
  };
}
