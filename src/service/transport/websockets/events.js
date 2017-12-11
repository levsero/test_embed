import {
  updateTalkEmbeddableConfig,
  updateTalkAgentAvailability,
  updateTalkAverageWaitTime,
  resetTalkScreen } from 'src/redux/modules/talk';

export function talkEmbeddableConfigEventToAction(socket, reduxStore) {
  socket.on('socket.embeddableConfig', (config) => {
    reduxStore.dispatch(updateTalkEmbeddableConfig(config));
    reduxStore.dispatch(updateTalkAgentAvailability(config.agentAvailability));
    reduxStore.dispatch(resetTalkScreen());
  });
}

export function talkAgentAvailabilityEventToAction(socket, reduxStore) {
  socket.on('socket.availability', (data) => {
    reduxStore.dispatch(updateTalkAgentAvailability(data.agentAvailability));
  });
}

export function talkAverageWaitTimeEventToAction(socket, reduxStore) {
  socket.on('socket.waitTimeChange', (data) => {
    reduxStore.dispatch(updateTalkAverageWaitTime(data.waitTime));
  });
}
