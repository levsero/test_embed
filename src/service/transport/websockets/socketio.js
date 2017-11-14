import io from 'socket.io-client';

import { talkEmbeddableConfigEventToAction,
         talkAgentAvailabilityEventToAction } from './events';

const talkServicePath = '/talk_embeddables_service/socket.io';

function connect(serviceUrl, subdomain, keyword) {
  return io(serviceUrl, {
    query: `subdomain=${subdomain}&keyword=${keyword}`,
    path: talkServicePath
  });
}

function mapEventsToActions(socket, reduxStore) {
  talkEmbeddableConfigEventToAction(socket, reduxStore);
  talkAgentAvailabilityEventToAction(socket, reduxStore);
}

export const socketio = {
  connect,
  mapEventsToActions
};
