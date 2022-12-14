import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import connectOnPageLoad from '../connectOnPageLoad'

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
