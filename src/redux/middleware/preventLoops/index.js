import _ from 'lodash';
import { logging } from 'service/logging';
import { beacon } from 'service/beacon';
import { SDK_CHAT_MSG, CHAT_BOX_CHANGED, SDK_HISTORY_CHAT_MSG } from 'src/redux/modules/chat/chat-action-types';

const actionsToSkip = [SDK_HISTORY_CHAT_MSG, SDK_CHAT_MSG, CHAT_BOX_CHANGED];
let a = [];
let prevAction = null;

export default (_store) => next => action => {
  if (_.includes(actionsToSkip,action.type)) return next(action);
  const now = Date.now();

  a.push(now);
  a = a.slice(-100);

  if (a.length === 100 && now - a[0] < 2000){
    logging.error(new Error('infiniteLoopDetected'), { action: action.type, prevAction: prevAction.type });
    beacon.trackUserAction('infiniteLoopDetected', 'warning', {
      label: action.type,
      value: prevAction.type
    });
    // console.error('Possible infinite loop detected! Please contact zendesk support with code snippet used on this site.');
    // return;
  }
  prevAction = action;
  return next(action);
};
