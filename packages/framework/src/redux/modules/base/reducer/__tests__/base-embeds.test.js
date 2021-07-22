import { testReducer } from 'src/util/testHelpers'
import { UPDATE_EMBED } from '../../base-action-types'
import embeds from '../base-embeds'

testReducer(embeds, [
  {
    action: { type: undefined },
    expected: {},
  },
  {
    action: {
      type: UPDATE_EMBED,
      payload: {
        name: 'chat',
        params: { accessible: true },
      },
    },
    expected: {
      chat: {
        accessible: true,
      },
    },
  },
  {
    action: {
      type: UPDATE_EMBED,
      payload: {
        name: 'helpCenterForm',
        params: {},
      },
    },
    expected: {
      helpCenterForm: {
        accessible: false,
      },
    },
  },
])
