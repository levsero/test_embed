import {
  VISITOR_DEFAULT_DEPARTMENT_SELECTED,
  SDK_VISITOR_DEFAULT_DEPARTMENT_UPDATE
} from 'src/redux/modules/chat/chat-action-types'

const initialState = {
  timestamp: 0,
  values: {}
}

const chatDepartmentSelect = (state = initialState, action) => {
  switch (action.type) {
    case SDK_VISITOR_DEFAULT_DEPARTMENT_UPDATE:
      return {
        timestamp: action.payload.timestamp,
        values: {
          departmentId: action.payload.detail.id
        }
      }
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
