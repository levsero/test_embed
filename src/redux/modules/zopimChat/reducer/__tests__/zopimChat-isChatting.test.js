import isChatting from '../zopimChat-isChatting'
import { ZOPIM_IS_CHATTING, ZOPIM_END_CHAT } from '../../zopimChat-action-types'
import { testReducer } from 'src/util/testHelpers'

testReducer(isChatting, [
  {
    action: { type: undefined },
    expected: false
  },
  {
    action: { type: 'DERP DERP' },
    initialState: true,
    expected: true
  },
  {
    action: { type: ZOPIM_IS_CHATTING },
    expected: true
  },
  {
    action: { type: ZOPIM_END_CHAT },
    initialState: true,
    expected: false
  }
])
