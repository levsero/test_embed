import { SNAPCALL_CALL_STARTED, SNAPCALL_CALL_ENDED } from 'src/embeds/talk/actions/action-types'

const initialState = null

const snapcallCallStatus = (state = initialState, action) => {
  switch (action.type) {
    case SNAPCALL_CALL_STARTED:
      return 'active'
    case SNAPCALL_CALL_ENDED:
      return null
    default:
      return state
  }
}

export default snapcallCallStatus
