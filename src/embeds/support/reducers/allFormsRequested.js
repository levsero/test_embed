import { ALL_FORMS_REQUESTED } from 'src/redux/modules/settings/settings-action-types'

const initialState = false

const allFormsRequested = (state = initialState, action) => {
  switch (action.type) {
    case ALL_FORMS_REQUESTED: {
      return action.payload
    }
    default:
      return state
  }
}

export default allFormsRequested
