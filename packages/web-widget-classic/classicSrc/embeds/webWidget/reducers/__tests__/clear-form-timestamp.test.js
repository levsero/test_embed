import clearFormTimestamp from 'classicSrc/embeds/webWidget/reducers/clear-form-timestamp'
import { API_CLEAR_FORM } from 'classicSrc/redux/modules/base/base-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'

const initialState = 0

const timestamp = Date.now()

testReducer(clearFormTimestamp, [
  {
    initialState: undefined,
    action: { type: 'some action' },
    expected: initialState,
  },
  {
    initialState,
    action: { type: API_CLEAR_FORM, payload: { timestamp } },
    expected: timestamp,
  },
  {
    initialState: timestamp,
    action: { type: 'some action' },
    expected: timestamp,
  },
])
