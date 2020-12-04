import {
  TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT,
  TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT
} from '../talk-action-types'

const initialState = {
  waitTime: '0',
  enabled: false
}

const averageWaitTime = (state = initialState, action) => {
  switch (action.type) {
    case TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT:
    case TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT:
      const { averageWaitTime, averageWaitTimeSetting, averageWaitTimeEnabled } = action.payload

      return {
        waitTime: averageWaitTime || state.waitTime,
        enabled: !!averageWaitTimeSetting && averageWaitTimeEnabled
      }
    default:
      return state
  }
}

export default averageWaitTime
