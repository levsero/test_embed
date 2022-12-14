import { updateMenuVisibility } from 'classicSrc/embeds/chat/actions/actions'
import {
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility,
} from 'classicSrc/redux/modules/chat'
import { CHAT_FILE_REQUEST_SUCCESS } from 'classicSrc/redux/modules/chat/chat-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import reducer from '../is-menu-visible'

describe('isMenuVisible reducer', () => {
  testReducer(reducer, [
    {
      extraDesc: 'initial state',
      initialState: undefined,
      action: { type: 'some action' },
      expected: false,
    },
    {
      initialState: true,
      action: updateMenuVisibility(false),
      expected: false,
    },
    {
      initialState: false,
      action: updateMenuVisibility(true),
      expected: true,
    },
    {
      initialState: true,
      action: updateContactDetailsVisibility(true),
      expected: false,
    },
    {
      initialState: true,
      action: updateEmailTranscriptVisibility(true),
      expected: false,
    },
    {
      initialState: true,
      action: { type: CHAT_FILE_REQUEST_SUCCESS },
      expected: false,
    },
  ])
})
