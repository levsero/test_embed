import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import { testReducer } from 'src/util/testHelpers'
import reducer from '../launcher-mobile-settings'

describe('mobileSettings', () => {
  const goodPayload = {
    webWidget: {
      launcher: {
        mobile: {
          labelVisible: true,
        },
      },
    },
  }

  const badPayload = {
    derp: 'derp',
  }

  testReducer(reducer, [
    {
      type: UPDATE_SETTINGS,
      payload: goodPayload,
    },
    {
      type: UPDATE_SETTINGS,
      payload: badPayload,
    },
    {
      type: 'ANY_OTHER_ACTION',
      payload: goodPayload,
    },
  ])
})
