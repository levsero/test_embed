import { handleSoundIconClick } from 'embeds/chat/actions/actions'
import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from 'src/redux/modules/chat/chat-action-types'
import { testReducer } from 'utility/testHelpers'
import reducer from '../sound-enabled'

describe('soundEnabled reducer', () => {
  testReducer(reducer, [
    {
      extraDesc: 'initial state',
      initialState: undefined,
      action: { type: 'some action' },
      expected: true,
    },
    {
      initialState: true,
      action: handleSoundIconClick({ sound: false }),
      expected: false,
    },
    {
      initialState: false,
      action: handleSoundIconClick({ sound: true }),
      expected: true,
    },
    {
      initialState: false,
      action: {
        type: GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
        payload: {
          sound: {
            disabled: false,
          },
        },
      },
      expected: true,
    },
    {
      initialState: true,
      action: {
        type: GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
        payload: {
          sound: {
            disabled: true,
          },
        },
      },
      expected: false,
    },
    {
      initialState: true,
      action: {
        type: GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
        payload: {
          sound: {},
        },
      },
      expected: true,
    },
  ])
})
