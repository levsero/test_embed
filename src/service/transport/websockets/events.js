import {
  updateTalkEmbeddableConfig,
  updateTalkAgentAvailability,
  updateTalkAverageWaitTime,
  resetTalkScreen } from 'src/redux/modules/talk';
import { mediator } from 'service/mediator';

export function talkEmbeddableConfigEventToAction(socket, reduxStore) {
  socket.on('socket.embeddableConfig', (config) => {
    mediator.channel.broadcast('talk.enabled', config.enabled);
    reduxStore.dispatch(updateTalkEmbeddableConfig(config));
    dispatchAgentAvailability(reduxStore, config);
    dispatchAverageWaitTime(reduxStore, config);

    reduxStore.dispatch(resetTalkScreen());
  });
}

export function talkAgentAvailabilityEventToAction(socket, reduxStore) {
  socket.on('socket.availability', (data) => {
    dispatchAgentAvailability(reduxStore, data);
  });
}

export function talkAverageWaitTimeEventToAction(socket, reduxStore) {
  socket.on('socket.waitTimeChange', (data) => {
    dispatchAverageWaitTime(reduxStore, data);
  });
}

function dispatchAgentAvailability(reduxStore, data) {
  const { agentAvailability } = data;

  if (agentAvailability) {
    reduxStore.dispatch(updateTalkAgentAvailability(agentAvailability));
    mediator.channel.broadcast('talk.agentAvailability', agentAvailability);
  }
}

function dispatchAverageWaitTime(reduxStore, data) {
  const { averageWaitTime, averageWaitTimeSetting } = data;

  if (averageWaitTime && averageWaitTimeSetting) {
    reduxStore.dispatch(updateTalkAverageWaitTime(averageWaitTime));
  }
}
