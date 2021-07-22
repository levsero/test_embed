import { RECEIVE_DEFERRED_CHAT_STATUS } from 'embeds/chat/actions/action-types'
import { updatePreviewerScreen } from 'src/redux/modules/chat'
import { SDK_ACCOUNT_STATUS } from 'src/redux/modules/chat/chat-action-types'
import { testReducer } from 'src/util/testHelpers'
import reducer from '../chat-account-status'

testReducer(reducer, [
  {
    desc: 'initial state',
    action: { type: 'SOME ACTION' },
    initialState: undefined,
    expected: '',
  },
  {
    desc: 'updates from chat sdk',
    action: { type: SDK_ACCOUNT_STATUS, payload: { detail: 'some status' } },
    initialState: undefined,
    expected: 'some status',
  },
  {
    desc: 'updates from polling deferred chat end point',
    action: { type: RECEIVE_DEFERRED_CHAT_STATUS, payload: { status: 'some status' } },
    initialState: undefined,
    expected: 'some status',
  },
  {
    desc: 'update previewer status',
    action: updatePreviewerScreen({ status: 'some status' }),
    initialState: undefined,
    expected: 'some status',
  },
  {
    desc: 'some other action',
    action: { type: 'SOME ACTION' },
    initialState: 'online',
    expected: 'online',
  },
])
