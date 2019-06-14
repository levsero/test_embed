import status from '../zopimChat-status';
import { ZOPIM_CHAT_ON_STATUS_UPDATE } from '../../zopimChat-action-types';
import { testReducer } from 'src/util/testHelpers';

testReducer(status, [
  {
    action: { type: undefined },
    expected: ''
  },
  {
    action: { type: 'DERP DERP' },
    initialState: 'blah',
    expected: 'blah'
  },
  {
    action: { type: ZOPIM_CHAT_ON_STATUS_UPDATE, payload: 'online' },
    expected: 'online'
  },
  {
    action: { type: ZOPIM_CHAT_ON_STATUS_UPDATE },
    initialState: 'offline',
    expected: 'offline'
  },
]);
