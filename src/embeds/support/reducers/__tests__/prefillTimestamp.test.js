import { testReducer } from 'src/util/testHelpers'
import { handlePrefillReceived } from 'src/redux/modules/base'
import prefillTimestamp from '../prefillTimestamp'

const mockDateNow = 1479427200000
const mockDateSpy = jest.spyOn(Date, 'now').mockImplementation(() => mockDateNow)

const initialState = null

testReducer(prefillTimestamp, [
  {
    action: { type: undefined },
    expected: initialState,
    initialState: undefined
  },
  {
    action: handlePrefillReceived({
      email: {
        value: 'email@example.com'
      }
    }),
    expected: mockDateNow,
    initialState
  }
])

mockDateSpy.mockRestore()
