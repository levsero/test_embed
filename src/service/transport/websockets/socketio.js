import { talkEmbeddableConfigEventToAction,
  talkAgentAvailabilityEventToAction,
  talkAverageWaitTimeEventToAction } from './events';
import { parseUrl } from 'utility/utils';

const TALK_SERVICE_PATH = '/talk_embeddables_service/socket.io';

function buildQuery(subdomain, nickname) {
  const encSubdomain = encodeURIComponent(subdomain);
  const encNickname = encodeURIComponent(nickname);

  return `subdomain=${encSubdomain}&keyword=${encNickname}`;
}

function connect(io, serviceUrl, nickname) {
  const subdomain = parseUrl(serviceUrl).hostname.split('.')[0];

  return io(serviceUrl, {
    query: buildQuery(subdomain, nickname),
    path: TALK_SERVICE_PATH,
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
