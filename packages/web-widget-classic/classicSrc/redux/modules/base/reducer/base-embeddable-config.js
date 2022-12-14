import { DEFAULT_BASE_COLOR } from 'classicSrc/constants/shared'
import { UPDATE_PREVIEWER_SETTINGS } from 'classicSrc/redux/modules/chat/chat-action-types'
import _ from 'lodash'
import { UPDATE_EMBEDDABLE_CONFIG } from '../base-action-types'

const initialState = {
  embeds: {
    ticketSubmissionForm: {
      props: {
        attachmentsEnabled: false,
        nameFieldEnabled: true,
        nameFieldRequired: false,
      },
    },
    chat: {
      props: {
        zopimId: null,
        overrideProxy: null,
        standalone: false,
      },
    },
    talk: {
      props: {
        color: '',
        serviceUrl: '',
        nickname: '',
      },
    },
  },
  position: 'right', // default position
  color: DEFAULT_BASE_COLOR,
  textColor: undefined,
  cp4: false,
  hideZendeskLogo: false,
  brand: undefined,
  brandCount: undefined,
  brandLogoUrl: undefined,
  disableStatusPolling: false,
  prefetchWidgetContainer: false,
}

const embeddableConfig = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_PREVIEWER_SETTINGS:
      return {
        ...state,
        cp4: true,
      }
    case UPDATE_EMBEDDABLE_CONFIG:
      return {
        ...state,
        embeds: {
          chat: {
            props: {
              ...state.embeds.chat.props,
              ..._.get(payload, 'embeds.chat.props'),
            },
          },
          ticketSubmissionForm: {
            props: {
              ...state.embeds.ticketSubmissionForm.props,
              ..._.get(payload, 'embeds.ticketSubmissionForm.props'),
            },
          },
          talk: {
            props: {
              color: _.get(payload, 'embeds.talk.props.color', state.embeds.talk.props.color),
              serviceUrl: _.get(
                payload,
                'embeds.talk.props.serviceUrl',
                state.embeds.talk.props.serviceUrl
              ),
              nickname: _.get(
                payload,
                'embeds.talk.props.nickname',
                state.embeds.talk.props.nickname
              ),
            },
          },
        },
        position: payload.position || state.position,
        color: payload.color || _.get(state, 'color.base'),
        textColor: payload.textColor || _.get(state, 'color.text'),
        cp4: _.get(payload, 'cp4', state.cp4),
        hideZendeskLogo: _.get(payload, 'hideZendeskLogo', state.hideZendeskLogo),
        brand: _.get(payload, 'brand', state.brand),
        brandCount: _.get(payload, 'brandCount', state.brandCount),
        brandLogoUrl: _.get(payload, 'brandLogoUrl', state.brandLogoUrl),
        disableStatusPolling: _.get(payload, 'disableStatusPolling', state.disableStatusPolling),
        prefetchWidgetContainer: _.get(
          payload,
          'prefetchWidgetContainer',
          state.prefetchWidgetContainer
        ),
      }
    default:
      return state
  }
}

export default embeddableConfig
