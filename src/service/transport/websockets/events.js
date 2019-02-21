import {
  updateTalkEmbeddableConfig,
  updateTalkAgentAvailability,
  updateTalkAverageWaitTime,
  resetTalkScreen,
  talkDisconnect
} from 'src/redux/modules/talk';

export function talkEmbeddableConfigEventToAction(socket, reduxStore) {
  socket.on('socket.embeddableConfig', (config) => {
    reduxStore.dispatch(updateTalkEmbeddableConfig(config));
    reduxStore.dispatch(resetTalkScreen());
  });

  socket.on('disconnect', () => {
    reduxStore.dispatch(talkDisconnect());
  });
}

export function talkAgentAvailabilityEventToAction(socket, reduxStore) {
  socket.on('socket.availability', (availabilityPayload) => {
    reduxStore.dispatch(updateTalkAgentAvailability(availabilityPayload));
  });
}

export function talkAverageWaitTimeEventToAction(socket, reduxStore) {
  socket.on('socket.waitTimeChange', (averageWaitTimePayload) => {
    reduxStore.dispatch(updateTalkAverageWaitTime(averageWaitTimePayload));
  });
}
