import {
  updateTalkEmbeddableConfig,
  updateTalkAgentAvailability,
  updateTalkAverageWaitTime,
  resetTalkScreen } from 'src/redux/modules/talk';

export function talkEmbeddableConfigEventToAction(socket, reduxStore) {
  socket.on('socket.embeddableConfig', (config) => {
    reduxStore.dispatch(updateTalkEmbeddableConfig(config));
    reduxStore.dispatch(updateTalkAgentAvailability(config.agentAvailability));

    // Right now the talk service returns these two values as null if the average wait time is enabled
    // in the talk widget admin. TODO: Consult with the foxes team and clean this up.
    if (config.hasOwnProperty('averageWaitTime') && config.hasOwnProperty('averageWaitTimeSetting')) {
      reduxStore.dispatch(updateTalkAverageWaitTime(config.averageWaitTime));
    }

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
