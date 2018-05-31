import { GA } from 'service/analytics/googleAnalytics';
import { UPDATE_ACTIVE_EMBED } from 'src/redux/modules/base/base-action-types';
import { getIsChatting } from 'src/redux/modules/chat/chat-selectors';

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
    }
    return next(action);
  };
}
