import _ from 'lodash';

const socketTalkEmbeddableConfigEvent = 'socket.embeddableConfig';
const socketTalkAgentAvailability = 'socket.availability';

export function talkEmbedableConfigEventToAction(socket, reduxStore) {
  socket.on(socketTalkEmbeddableConfigEvent, (embeddableConfig) => {
    const configActionType = `talk/${socketTalkEmbeddableConfigEvent}`;
    const availabilityActionType = `talk/${socketTalkAgentAvailability}`;

    reduxStore.dispatch({ type: configActionType, payload: _.omit(embeddableConfig, 'agentAvailability') });
    reduxStore.dispatch({ type: availabilityActionType, payload: embeddableConfig.agentAvailability });
  });
}

export function talkAgentAvailabilityEventToAction(socket, reduxStore) {
  socket.on(socketTalkAgentAvailability, (availability) => {
    const type = `talk/${socketTalkAgentAvailability}`;

    reduxStore.dispatch({ type, payload: availability.agentAvailability });
  });
}
