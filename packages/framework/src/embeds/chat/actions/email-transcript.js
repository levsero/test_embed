import { zChatWithTimeout } from 'src/redux/modules/chat/helpers/zChatWithTimeout'
import * as actions from './action-types'

export function sendEmailTranscript(email) {
  return (dispatch, getState) => {
    return new Promise((res, rej) => {
      dispatch({
        type: actions.EMAIL_TRANSCRIPT_REQUEST_SENT,
        payload: email,
      })

      zChatWithTimeout(getState, 'sendEmailTranscript')(email, (err) => {
        if (!err) {
          dispatch({
            type: actions.EMAIL_TRANSCRIPT_SUCCESS,
            payload: email,
          })
          res()
        } else {
          dispatch({
            type: actions.EMAIL_TRANSCRIPT_FAILURE,
            payload: email,
          })
          rej()
        }
      })
    })
  }
}
