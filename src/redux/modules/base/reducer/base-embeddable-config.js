import { UPDATE_EMBEDDABLE_CONFIG } from '../base-action-types';
import _ from 'lodash';

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
        embeds: {
          helpCenterForm: {
            props: {
              ...state.embeds.helpCenterForm.props,
              ..._.get(payload, 'embeds.helpCenterForm')
            }
          }
        }
      };
    default:
      return state;
  }
};

export default embeddableConfig;
