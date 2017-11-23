import _ from 'lodash';
import { createSelector } from 'reselect';

export const getEmbeddableConfig = createSelector(
  [(state) => state.talk.embeddableConfig],
  _.identity
);

export const getAgentAvailability = createSelector(
  [(state) => state.talk.agentAvailbility],
  _.identity
);

export const getFormState = createSelector(
  [(state) => state.talk.formState],
  _.identity
);

export const getScreen = createSelector(
  [(state) => state.talk.screen],
  _.identity
);

export const getPhoneNumber = createSelector(
  [(state) => state.talk.phoneNumber],
  _.identity
);
