import _ from 'lodash'
import { UPDATE_EMBEDDABLE_CONFIG } from 'src/redux/modules/base/base-action-types'

const initialState = {
  defaultToChatWidgetLite: false,
}

const config = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_EMBEDDABLE_CONFIG:
      return {
        ...state,
        ..._.get(payload, 'embeds.chat.props', {}),
      }
    default:
      return state
  }
}

export default config
