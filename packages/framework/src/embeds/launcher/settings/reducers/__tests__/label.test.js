import { testReducer } from 'src/util/testHelpers'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import label from '../label'

testReducer(label, [
  {
    initialState: null,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: { launcher: { label: 'boop' } }
      }
    },
    expected: 'boop'
  },
  {
    initialState: 'boop',
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: { launcher: { somethingElse: 'hello there' } }
      }
    },
    expected: 'boop'
  },
  {
    initialState: 'boop',
    action: {
      type: 'not a real action',
      payload: {
        webWidget: { launcher: { label: 'probably a real name' } }
      }
    },
    expected: 'boop'
  }
])
