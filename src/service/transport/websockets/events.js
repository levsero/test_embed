import {
  updateTalkEmbeddableConfig,
  updateTalkAgentAvailability,
  updateTalkAverageWaitTime,
  talkDisconnect
} from 'src/redux/modules/talk'
import { loadSnapcall } from 'src/embeds/talk/actions'

export function talkEmbeddableConfigEventToAction(socket, reduxStore) {
  socket.on('socket.embeddableConfig', config => {
    // config.capability = 3 // Uncomment this line to test snapcall functionality
    if (__DEV__ && config.capability === 3) {
      // Replace DEV when we get an arturo or otherwise
      // We want this check to roughly be here since it should be the first action to occur when we know whether snapcall is supported by Talk
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
