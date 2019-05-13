import _ from 'lodash';
import { logging } from 'service/logging';
import { beacon } from 'service/beacon';
import { SDK_CHAT_MSG, CHAT_BOX_CHANGED, SDK_HISTORY_CHAT_MSG } from 'src/redux/modules/chat/chat-action-types';

const actionsToSkip = [SDK_HISTORY_CHAT_MSG, SDK_CHAT_MSG, CHAT_BOX_CHANGED];
let actionTimes = [];
let prevAction = null;

const TIME_WINDOW = 2000;
const MAX_NUMBER_OF_ACTIONS = 100;

export default (_store) => next => action => {
  if (_.includes(actionsToSkip, action.type)) return next(action);
  const now = Date.now();

  actionTimes.push(now);
  actionTimes = actionTimes.slice(-MAX_NUMBER_OF_ACTIONS);

  if (actionTimes.length === MAX_NUMBER_OF_ACTIONS && now - actionTimes[0] < TIME_WINDOW){
    logging.error(new Error('infiniteLoopDetected'), { action: action.type, prevAction: prevAction.type });
    beacon.trackUserAction('infiniteLoopDetected', 'warning', {
      label: action.type,
      value: prevAction.type
    });
  }
  prevAction = action;
  return next(action);
};
