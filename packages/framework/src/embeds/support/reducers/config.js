import _ from 'lodash'
import { UPDATE_EMBEDDABLE_CONFIG } from 'src/redux/modules/base/base-action-types'

const initialState = {
  maxFileCount: 5,
  maxFileSize: 50 * 1024 * 1024,
}

const config = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_EMBEDDABLE_CONFIG:
      return {
        ...state,
        ..._.get(payload, 'embeds.ticketSubmissionForm.props', {}),
      }
    default:
      return state
  }
}

export default config
