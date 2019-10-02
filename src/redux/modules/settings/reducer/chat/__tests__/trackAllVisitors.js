import trackAllVisitors from '../trackAllVisitors'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import { testReducer } from 'src/util/testHelpers'

const initialState = false
const badPayload = {
  foo: 'bar'
}
const goodPayload = {
  webWidget: {
    chat: {
      trackAllVisitors: true
    }
  }
}

testReducer(trackAllVisitors, [
  {
    action: { type: undefined },
    expected: initialState
  },
  {
    action: { type: 'DERP DERP' },
    expected: initialState
  },
  {
    action: {
      type: UPDATE_SETTINGS,
      payload: badPayload
    },
    expected: initialState
  },
  {
    action: {
      type: UPDATE_SETTINGS,
      payload: goodPayload
    },
    expected: true
  }
])
