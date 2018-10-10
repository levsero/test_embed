import { UPDATE_EMBEDDABLE_CONFIG } from '../base-action-types';
import _ from 'lodash';

const initialState = {
  embeds: {
    helpCenterForm: {
      props: {
        contextualHelpEnabled: false,
        signInRequired: false
      }
    },
    zopimChat: {
      props: {
        zopimId: '',
        overrideProxy: ''
      }
    }
  },
  position: 'right', // default position
  color: '#659700', // default base color
  textColor: undefined,
  cp4: false
};

const embeddableConfig = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_EMBEDDABLE_CONFIG:
      return {
        ...state,
        ipmAllowed: payload.ipmAllowed,
        embeds: {
          helpCenterForm: {
            props: {
              ...state.embeds.helpCenterForm.props,
              ..._.get(payload, 'embeds.helpCenterForm.props')
            }
          },
          zopimChat: {
            props: {
              ...state.embeds.zopimChat.props,
              ..._.get(payload, 'embeds.zopimChat.props')
            }
          }
        },
        position: payload.position,
        color: payload.color || state.color.base,
        textColor: payload.textColor || state.color.text,
        cp4: _.get(payload, 'cp4', state.cp4)
      };
    default:
      return state;
  }
};

export default embeddableConfig;
