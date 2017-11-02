import io from 'socket.io-client';

import { talkEmbedableConfigEventToAction } from './events';

const talkServiceUrl = 'http://talkintegration-pod999.zendesk-staging.com';
const talkServicePath = '/talk_embeddables_service/socket.io';

function connect(accountId, subdomain) {
  return io(talkServiceUrl, {
    query: `accountId=${accountId}&subdomain=${subdomain}`,
    path: talkServicePath
  });
}

function mapEventsToActions(socket, reduxStore) {
  talkEmbedableConfigEventToAction(socket, reduxStore);
}

export const socketio = {
  connect,
  mapEventsToActions
};
