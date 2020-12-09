import {
  updateTalkEmbeddableConfig,
  updateTalkAgentAvailability,
  updateTalkAverageWaitTime,
  talkDisconnect
} from 'src/redux/modules/talk'
import { loadSnapcall } from 'src/embeds/talk/actions'
import { CAPABILITY_TYPE_CODES } from 'src/redux/modules/talk/talk-capability-types'

export function talkEmbeddableConfigEventToAction(socket, reduxStore) {
  socket.on('socket.embeddableConfig', config => {
    if (config.capability === CAPABILITY_TYPE_CODES.CLICK_TO_CALL) {
      reduxStore.dispatch(loadSnapcall())
    }
    reduxStore.dispatch(updateTalkEmbeddableConfig(config))
  })

  socket.on('disconnect', () => {
    reduxStore.dispatch(talkDisconnect())
  })
}

export function talkAgentAvailabilityEventToAction(socket, reduxStore) {
  socket.on('socket.availability', availabilityPayload => {
    reduxStore.dispatch(updateTalkAgentAvailability(availabilityPayload))
  })
}

export function talkAverageWaitTimeEventToAction(socket, reduxStore) {
  socket.on('socket.waitTimeChange', averageWaitTimePayload => {
    reduxStore.dispatch(updateTalkAverageWaitTime(averageWaitTimePayload))
  })
}
