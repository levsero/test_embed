import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import talkLabel from '../talkLabel'

testReducer(talkLabel, [
  {
    initialState: null,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: { launcher: { talkLabel: 'boop' } },
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
        webWidget: { launcher: { talkLabel: 'probably a real name' } },
      },
    },
    expected: 'boop',
  },
])
