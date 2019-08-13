import hidden from '../base-hidden'
import {
  ACTIVATE_RECEIVED,
  LEGACY_SHOW_RECEIVED,
  SHOW_RECEIVED,
  HIDE_RECEIVED
} from '../../base-action-types'
import { NEW_AGENT_MESSAGE_RECEIVED } from 'src/redux/modules/chat/chat-action-types'
import { testReducer } from 'src/util/testHelpers'

const state = (hideApi, activateApi) => ({ hideApi, activateApi })

testReducer(hidden, [
  {
    action: { type: undefined },
    expected: state(false, false)
  },
  {
    action: { type: 'DERP DERP' },
    initialState: state(true, false),
    expected: state(true, false)
  },
  {
    action: { type: HIDE_RECEIVED },
    expected: state(true, true)
  },
  {
    action: { type: NEW_AGENT_MESSAGE_RECEIVED },
    initialState: state(true, true),
    expected: state(false, false)
  },
  {
    action: { type: LEGACY_SHOW_RECEIVED },
    initialState: state(true, true),
    expected: state(false, false)
  },
  {
    action: { type: SHOW_RECEIVED },
    initialState: state(true, true),
    expected: state(false, false)
  },
  {
    action: { type: ACTIVATE_RECEIVED, payload: { hideOnClose: false } },
    initialState: state(true, true),
    expected: state(false, true)
  },
  {
    action: { type: ACTIVATE_RECEIVED, payload: { hideOnClose: true } },
    initialState: state(true, false),
    expected: state(false, true)
  }
])
