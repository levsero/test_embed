import { testReducer } from 'src/util/testHelpers';
import { CHAT_BANNED } from 'src/redux/modules/chat/chat-action-types';
import chatBanned from '../chat-banned';

testReducer(chatBanned, [
  {
    action: {
      type: 'initial state'
    },
    expected: false
  },
  {
    action: {
      type: CHAT_BANNED,
    },
    expected: true
  },
]);