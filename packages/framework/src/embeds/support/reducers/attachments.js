import {
  ATTACHMENT_UPLOAD_REQUESTED,
  ATTACHMENT_UPLOAD_SUCCEEDED,
  ATTACHMENT_UPLOAD_FAILED,
  ATTACHMENT_UPLOAD_UPDATED,
  ATTACHMENT_REMOVED,
  ATTACHMENTS_CLEARED
} from 'src/embeds/support/actions/action-types'

const initialState = []

const attachments = (state = initialState, action) => {
  const { type, payload } = action
  const updateAttachment = payload =>
    state.reduce((newState, attachment) => {
      if (attachment.id === payload.id) {
        newState.push({ ...attachment, ...payload })
      } else {
        newState.push(attachment)
      }

      return newState
    }, [])

  switch (type) {
    case ATTACHMENT_UPLOAD_REQUESTED:
      return [...state, payload]
    case ATTACHMENT_UPLOAD_SUCCEEDED:
    case ATTACHMENT_UPLOAD_FAILED:
    case ATTACHMENT_UPLOAD_UPDATED:
      return updateAttachment(payload)
    case ATTACHMENT_REMOVED:
      return state.filter(attachment => attachment.id !== payload.id)
    case ATTACHMENTS_CLEARED:
      return initialState
    default:
      return state
  }
}

export default attachments
