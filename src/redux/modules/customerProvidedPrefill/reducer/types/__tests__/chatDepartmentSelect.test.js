import { testReducer } from 'utility/testHelpers'
import chatDepartmentSelect from '../chatDepartmentSelect'
import { setDefaultDepartment } from 'src/redux/modules/chat'

const initialState = {
  values: {},
  timestamp: 0
}

testReducer(chatDepartmentSelect, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState
  },
  {
    initialState: undefined,
    action: setDefaultDepartment('department id', 123),
    expected: {
      timestamp: 123,
      values: {
        departmentId: 'department id'
      }
    }
  }
])
