import { GA } from 'service/analytics/googleAnalytics';
import { UPDATE_ACTIVE_EMBED } from 'src/redux/modules/base/base-action-types';
import { SDK_CHAT_MEMBER_JOIN } from 'src/redux/modules/chat/chat-action-types';
import { getIsChatting } from 'src/redux/modules/chat/chat-selectors';

const isAgent = (nick) => nick.indexOf('agent:') > -1;
const loadtime = Date.now();

export function trackAnalytics({ getState }) {
  return (next) => (action) => {
    const { type, payload } = action;
    const prevState = getState();

    switch (type) {
      case UPDATE_ACTIVE_EMBED:
        const isChatting = getIsChatting(prevState);

        if (!isChatting && payload === 'chat') {
          GA.track('Chat Opened');
        }
        break;
      case SDK_CHAT_MEMBER_JOIN:
        if (isAgent(payload.detail.nick) && payload.detail.timestamp > loadtime) {
          GA.track('Chat Served by Operator', payload.detail.display_name);
        }
        break;
    }
    return next(action);
  };
}
