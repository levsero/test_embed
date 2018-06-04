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

export function trackAnalytics({ getState }) {
  return (next) => (action) => {
    const { type, payload } = action;
    const prevState = getState();
    // To avoid resending events during the replay when the page is refreshed.
    const isAfterLoadTime = _.get(payload, 'detail.timestamp') > loadtime;

    switch (type) {
      case UPDATE_ACTIVE_EMBED:
        const isChatting = getIsChatting(prevState);

        if (!isChatting && payload === 'chat') {
          GA.track('Chat Opened');
        }
        break;
      case SDK_CHAT_MEMBER_JOIN:
        if (isAgent(payload.detail.nick) && isAfterLoadTime) {
          GA.track('Chat Served by Operator', payload.detail.display_name);
        }
        break;
      case OFFLINE_FORM_REQUEST_SUCCESS:
        GA.track('Chat Offline Message Sent', payload.department);
        break;
      case SDK_CHAT_RATING:
        const rating = payload.detail.new_rating;

        if (isAfterLoadTime) {
          if (rating) {
            GA.track(`Chat Rating ${_.startCase(payload.detail.new_rating)}`);
          } else {
            GA.track('Chat Rating Removed');
          }
        }
        break;
      case SDK_CHAT_COMMENT:
        if (isAfterLoadTime) {
          GA.track('Chat Comment Submitted');
        }
        break;
      case PRE_CHAT_FORM_SUBMIT:
        const deptId = parseInt(payload.department);
        const dept = getDepartments(prevState)[deptId];

        GA.track('Chat Request Form Submitted', _.get(dept, 'name'));
        break;
    }
    return next(action);
  };
}
