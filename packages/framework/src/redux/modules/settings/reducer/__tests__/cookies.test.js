import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import { testReducer } from 'src/util/testHelpers'
import cookies from '../cookies'

const settingsPayload = {
  webWidget: {
    cookies: false,
  },
}

testReducer(cookies, [
  {
    type: undefined,
    payload: '',
    expected: true,
  },
  {
    type: UPDATE_SETTINGS,
    payload: settingsPayload,
    expected: false,
  },
])
