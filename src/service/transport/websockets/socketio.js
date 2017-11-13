import io from 'socket.io-client';

import { talkEmbedableConfigEventToAction,
         talkAgentAvailabilityEventToAction } from './events';

const talkServiceUrl = 'http://talkintegration-pod999.zendesk-staging.com';
const talkServicePath = '/talk_embeddables_service/socket.io';

function connect(subdomain, keyword) {
  return io(talkServiceUrl, {
    query: `subdomain=${subdomain}&keyword=${keyword}`,
    path: talkServicePath
  });
}

function mapEventsToActions(socket, reduxStore) {
  talkEmbedableConfigEventToAction(socket, reduxStore);
  talkAgentAvailabilityEventToAction(socket, reduxStore);
}

export const socketio = {
  connect,
  mapEventsToActions
};
