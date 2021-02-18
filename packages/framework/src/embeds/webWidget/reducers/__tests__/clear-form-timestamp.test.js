import { testReducer } from 'utility/testHelpers'
import clearFormTimestamp from 'embeds/webWidget/reducers/clear-form-timestamp'
import { API_CLEAR_FORM } from 'src/redux/modules/base/base-action-types'

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
