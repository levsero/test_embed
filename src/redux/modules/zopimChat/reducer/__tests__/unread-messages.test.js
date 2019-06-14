import unreadMessages from '../unread-messages';
import { ZOPIM_CHAT_ON_UNREAD_MESSAGES_UPDATE } from '../../zopimChat-action-types';
import { testReducer } from 'src/util/testHelpers';

testReducer(unreadMessages, [
  {
    action: { type: undefined },
    expected: 0
  },
  {
    action: { type: 'DERP DERP' },
    initialState: 4,
    expected: 4
  },
  {
    action: { type: ZOPIM_CHAT_ON_UNREAD_MESSAGES_UPDATE, payload: 3 },
    expected: 3
  }
]);
