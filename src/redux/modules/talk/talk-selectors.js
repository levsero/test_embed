export const getEmbeddableConfig = (state) => state.talk.embeddableConfig;
export const getCapability = (state) => getEmbeddableConfig(state).capability;
export const getAgentAvailability = (state) => state.talk.agentAvailability;
export const getFormState = (state) => state.talk.formState;
export const getScreen = (state) => state.talk.screen;
export const getCallback = (state) => state.talk.callback;
export const getAverageWaitTime = (state) => state.talk.averageWaitTime;
export const getInitialScreen = (state) => `${getCapability(state)}_SCREEN`;
