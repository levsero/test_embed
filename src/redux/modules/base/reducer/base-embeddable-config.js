import { UPDATE_EMBEDDABLE_CONFIG } from '../base-action-types';
import { UPDATE_PREVIEWER_SETTINGS } from 'src/redux/modules/chat/chat-action-types';

import _ from 'lodash';

const initialState = {
  embeds: {
    ticketSubmissionForm: {
      props: {
        attachmentsEnabled: true
      }
    },
    helpCenterForm: {
      props: {
        contextualHelpEnabled: false,
        signInRequired: false
      }
    },
    zopimChat: {
      props: {
        zopimId: '',
        overrideProxy: '',
        standalone: false
      }
    },
    talk: {
      props: {
        color: '',
        serviceUrl: '',
        nickname: ''
      }
    }
  },
  position: 'right', // default position
  color: '#659700', // default base color
  textColor: undefined,
  cp4: false,
  hideZendeskLogo: false
};

const embeddableConfig = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_PREVIEWER_SETTINGS:
      return {
        ...state,
        cp4: true
      };
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
          },
          ticketSubmissionForm: {
            props: {
              ...state.embeds.ticketSubmissionForm.props,
              ..._.get(payload, 'embeds.ticketSubmissionForm.props')
            }
          },
          talk: {
            props: {
              color: _.get(payload, 'embeds.talk.props.color', state.embeds.talk.props.color),
              serviceUrl: _.get(payload, 'embeds.talk.props.serviceUrl', state.embeds.talk.props.serviceUrl),
              nickname: _.get(payload, 'embeds.talk.props.nickname', state.embeds.talk.props.nickname)
            }
          }
        },
        position: payload.position || state.position,
        color: payload.color || state.color.base,
        textColor: payload.textColor || state.color.text,
        cp4: _.get(payload, 'cp4', state.cp4),
        hideZendeskLogo: _.get(payload, 'hideZendeskLogo', state.hideZendeskLogo)
      };
    default:
      return state;
  }
};

export default embeddableConfig;
