import _ from 'lodash';

import { CALLBACK_ONLY, CALLBACK_AND_PHONE } from './talk-capability-types';
import { getTalkEmbed } from 'src/redux/modules/base/selectors';

export const getEmbeddableConfig = (state) => state.talk.embeddableConfig;
export const getCapability = (state) => getEmbeddableConfig(state).capability;
export const getAgentAvailability = (state) => state.talk.agentAvailability;
export const getFormState = (state) => state.talk.formState;
export const getScreen = (state) => state.talk.screen;
export const getCallback = (state) => state.talk.callback;
export const getAverageWaitTime = (state) => state.talk.averageWaitTime;
export const getInitialScreen = (state) => `${getCapability(state)}_SCREEN`;
export const getTalkAvailable = (state) => {
  return getEmbeddableConfig(state).enabled && getAgentAvailability(state) && getTalkEmbed(state);
};

export const isCallbackEnabled = (state) => {
  const { capability } = state.talk.embeddableConfig;

  return _.includes([CALLBACK_ONLY, CALLBACK_AND_PHONE], capability);
};
