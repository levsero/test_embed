import connectOnPageLoad from '../connectOnPageLoad'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import { testReducer } from 'src/util/testHelpers'

const initialState = true
const badPayload = {
  foo: 'bar',
}
const goodPayload = (connectOnPageLoad) => ({
  webWidget: {
    chat: {
      connectOnPageLoad,
    },
  },
})

testReducer(connectOnPageLoad, [
  {
    action: { type: undefined },
    expected: initialState,
  },
  {
    action: { type: 'DERP DERP' },
    expected: initialState,
  },
  {
    action: {
      type: UPDATE_SETTINGS,
      payload: badPayload,
    },
    expected: initialState,
  },
  {
    action: {
      type: UPDATE_SETTINGS,
      payload: goodPayload(false),
    },
    expected: false,
  },
  {
    action: {
      type: UPDATE_SETTINGS,
      payload: goodPayload(1),
    },
    expected: true,
  },
])
