import { testReducer } from 'src/util/testHelpers'
import { formPrefilled } from 'embeds/support/actions'
import lastFormPrefillId from '../lastFormPrefillId'

const initialState = {}

testReducer(lastFormPrefillId, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState
  },
  {
    initialState,
    action: formPrefilled(123, 456),
    expected: {
      123: 456
    }
  }
])
