import { UPDATE_EMBEDDABLE_CONFIG } from 'src/redux/modules/base/base-action-types'

import _ from 'lodash'

const initialState = {
  maxFileCount: 5,
  maxFileSize: 5 * 1024 * 1024
}

const config = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_EMBEDDABLE_CONFIG:
      return {
        ...state,
        ..._.get(payload, 'embeds.ticketSubmissionForm.props', {})
      }
    default:
      return state
  }
}

export default config
