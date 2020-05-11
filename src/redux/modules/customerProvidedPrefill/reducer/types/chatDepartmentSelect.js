import { VISITOR_DEFAULT_DEPARTMENT_SELECTED } from 'src/redux/modules/chat/chat-action-types'

const initialState = {
  timestamp: 0,
  values: {}
}

const chatDepartmentSelect = (state = initialState, action) => {
  switch (action.type) {
    case VISITOR_DEFAULT_DEPARTMENT_SELECTED:
      return {
        timestamp: action.payload.timestamp,
        values: {
          departmentId: action.payload.department
        }
      }
    default:
      return state
  }
}

export default chatDepartmentSelect
