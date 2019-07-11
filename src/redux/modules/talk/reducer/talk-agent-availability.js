import _ from 'lodash'
import {
  TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
  TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
  TALK_DISCONNECT_SOCKET_EVENT
} from '../talk-action-types'

const initialState = false

const agentAvailability = (state = initialState, action) => {
  switch (action.type) {
    case TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT:
    case TALK_AGENT_AVAILABILITY_SOCKET_EVENT:
      return _.get(action.payload, 'agentAvailability', state)
    case TALK_DISCONNECT_SOCKET_EVENT:
      return false
    default:
      return state
  }
}

export default agentAvailability
