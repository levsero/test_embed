import _ from 'lodash';

import {
  TALK_EMBEDDABLE_CONFIG,
  TALK_AGENT_AVAILABILITY,
  TALK_AVERAGE_WAIT_TIME } from 'src/redux/modules/talk/talk-action-types';
import { resetTalkScreen } from 'src/redux/modules/talk';

export function talkEmbeddableConfigEventToAction(socket, reduxStore) {
  socket.on('socket.embeddableConfig', (config) => {
    reduxStore.dispatch({
      type: TALK_EMBEDDABLE_CONFIG,
      payload: _.omit(config, ['agentAvailability', 'averageWaitTime'])
    });
    reduxStore.dispatch({ type: TALK_AGENT_AVAILABILITY, payload: config.agentAvailability });

    // Right now the talk service returns these two values as null if the average wait time is enabled
    // in the talk widget admin. TODO: Consult with the foxes team and clean this up.
    if (config.hasOwnProperty('averageWaitTime') && config.hasOwnProperty('averageWaitTimeSetting')) {
      reduxStore.dispatch({ type: TALK_AVERAGE_WAIT_TIME, payload: config.averageWaitTime });
    }

    reduxStore.dispatch(resetTalkScreen());
  });
}

export function talkAgentAvailabilityEventToAction(socket, reduxStore) {
  socket.on('socket.availability', (availability) => {
    reduxStore.dispatch({ type: TALK_AGENT_AVAILABILITY, payload: availability.agentAvailability });
  });
}

export function talkAverageWaitTimeEventToAction(socket, reduxStore) {
  socket.on('socket.waitTimeChange', (waitTime) => {
    reduxStore.dispatch({ type: TALK_AVERAGE_WAIT_TIME, payload: waitTime });
  });
}
