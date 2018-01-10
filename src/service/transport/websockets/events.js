import {
  updateTalkEmbeddableConfig,
  updateTalkAgentAvailability,
  updateTalkAverageWaitTime,
  updateTalkAverageWaitTimeEnabled,
  resetTalkScreen } from 'src/redux/modules/talk';
import { mediator } from 'service/mediator';

export function talkEmbeddableConfigEventToAction(socket, reduxStore) {
  socket.on('socket.embeddableConfig', (config) => {
    dispatchEmbeddableConfig(reduxStore, config);
    dispatchAgentAvailability(reduxStore, config);
    dispatchAverageWaitTime(reduxStore, config);
    reduxStore.dispatch(resetTalkScreen());
  });

  socket.on('disconnect', () => {
    dispatchEmbeddableConfig(reduxStore, { enabled: false });
    dispatchAgentAvailability(reduxStore, { agentAvailability: false });
  });
}

export function talkAgentAvailabilityEventToAction(socket, reduxStore) {
  socket.on('socket.availability', (availabilityPayload) => {
    dispatchAgentAvailability(reduxStore, availabilityPayload);
  });
}

export function talkAverageWaitTimeEventToAction(socket, reduxStore) {
  socket.on('socket.waitTimeChange', (averageWaitTimePayload) => {
    dispatchAverageWaitTime(reduxStore, averageWaitTimePayload);
  });
}

function dispatchEmbeddableConfig(reduxStore, config) {
  mediator.channel.broadcast('talk.enabled', config.enabled);
  reduxStore.dispatch(updateTalkEmbeddableConfig(config));
}

function dispatchAgentAvailability(reduxStore, availabilityPayload) {
  const agentAvailability = availabilityPayload.agentAvailability;

  reduxStore.dispatch(updateTalkAgentAvailability(agentAvailability));
  mediator.channel.broadcast('talk.agentAvailability', agentAvailability);
}

function dispatchAverageWaitTime(reduxStore, averageWaitTimePayload) {
  const { averageWaitTime, averageWaitTimeSetting, averageWaitTimeEnabled } = averageWaitTimePayload;

  if (averageWaitTime && averageWaitTimeSetting && averageWaitTimeEnabled) {
    reduxStore.dispatch(updateTalkAverageWaitTime(averageWaitTime));
    reduxStore.dispatch(updateTalkAverageWaitTimeEnabled(true));
  } else {
    reduxStore.dispatch(updateTalkAverageWaitTimeEnabled(false));
  }
}

