import { talkEmbeddableConfigEventToAction,
  talkAgentAvailabilityEventToAction,
  talkAverageWaitTimeEventToAction } from './events';
import { parseUrl } from 'utility/utils';

const io = (() => { try { return require('socket.io-client'); } catch (_) {} })();

const talkServicePath = '/talk_embeddables_service/socket.io';

function connect(serviceUrl, nickname) {
  const subdomain = parseUrl(serviceUrl).hostname.split('.')[0];

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
