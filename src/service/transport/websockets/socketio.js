import { talkEmbeddableConfigEventToAction,
         talkAgentAvailabilityEventToAction,
         talkAverageWaitTimeEventToAction } from './events';

const io = (() => { try { return require('socket.io-client'); } catch (_) {} })();

const talkServicePath = '/talk_embeddables_service/socket.io';

function connect(serviceUrl, subdomain, nickname) {
  return io(serviceUrl, {
    query: `subdomain=${subdomain}&keyword=${nickname}`,
    path: talkServicePath,
    reconnectionAttempts: 6,
    transports: ['websocket']
  });
}

function mapEventsToActions(socket, reduxStore) {
  talkEmbeddableConfigEventToAction(socket, reduxStore);
  talkAgentAvailabilityEventToAction(socket, reduxStore);
  talkAverageWaitTimeEventToAction(socket, reduxStore);
}

export const socketio = {
  connect,
  mapEventsToActions
};
