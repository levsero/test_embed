import { UPDATE_EMBEDDABLE_CONFIG } from '../base-action-types';

const initialState = {
  embeds: {
    helpCenterForm: {
      props: {
        contextualHelpEnabled: false,
        signInRequired: false
      }
    }
  }
};

const embeddableConfig = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_EMBEDDABLE_CONFIG:
      return {
        ...state,
        ...payload
      };
    default:
      return state;
  }
};

export default embeddableConfig;
