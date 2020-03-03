import * as actions from './action-types'
import { zChatWithTimeout } from 'src/redux/modules/chat/helpers/zChatWithTimeout'

export function sendEmailTranscript(email) {
  return (dispatch, getState) => {
    dispatch({
      type: actions.EMAIL_TRANSCRIPT_REQUEST_SENT,
      payload: email
    })

    zChatWithTimeout(getState, 'sendEmailTranscript')(email, err => {
      if (!err) {
        dispatch({
          type: actions.EMAIL_TRANSCRIPT_SUCCESS,
          payload: email
        })
      } else {
        dispatch({
          type: actions.EMAIL_TRANSCRIPT_FAILURE,
          payload: email
        })
      }
    })
  }
}
