import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import chatLabel from '../chatLabel'

testReducer(chatLabel, [
  {
    initialState: null,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: { launcher: { chatLabel: 'boop' } },
      },
    },
    expected: 'boop',
  },
  {
    initialState: 'boop',
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: { launcher: { somethingElse: 'hello there' } },
      },
    },
    expected: 'boop',
  },
  {
    initialState: 'boop',
    action: {
      type: 'not a real action',
      payload: {
        webWidget: { launcher: { chatLabel: 'probably a real name' } },
      },
    },
    expected: 'boop',
  },
])
