import _ from 'lodash';

const socketTalkEmbeddableConfigEvent = 'socket.embeddableConfig';
const socketTalkAgentAvailability = 'socket.availability';
const socketTalkAverageWaitTime = 'socket.waitTimeChange';

export function talkEmbeddableConfigEventToAction(socket, reduxStore) {
  socket.on(socketTalkEmbeddableConfigEvent, (config) => {
    const configActionType = `talk/${socketTalkEmbeddableConfigEvent}`;
    const availabilityActionType = `talk/${socketTalkAgentAvailability}`;
    const averageWaitTimeActionType = `talk/${socketTalkAverageWaitTime}`;

    reduxStore.dispatch({ type: configActionType, payload: _.omit(config, ['agentAvailability', 'averageWaitTime']) });
    reduxStore.dispatch({ type: availabilityActionType, payload: config.agentAvailability });

    // Right now the talk service returns these two values as null if the average wait time is enabled
    // in the talk widget admin. TODO: Consult with the foxes team and clean this up.
    if (config.hasOwnProperty('averageWaitTime') && config.hasOwnProperty('averageWaitTimeSetting')) {
      reduxStore.dispatch({ type: averageWaitTimeActionType, payload: config.averageWaitTime });
    }
  });
}

export function talkAgentAvailabilityEventToAction(socket, reduxStore) {
  socket.on(socketTalkAgentAvailability, (availability) => {
    const type = `talk/${socketTalkAgentAvailability}`;

    reduxStore.dispatch({ type, payload: availability.agentAvailability });
  });
}

export function talkAverageWaitTimeEventToAction(socket, reduxStore) {
  socket.on(socketTalkAverageWaitTime, (waitTime) => {
    const type = `talk/${socketTalkAverageWaitTime}`;

    reduxStore.dispatch({ type, payload: waitTime });
  });
}
