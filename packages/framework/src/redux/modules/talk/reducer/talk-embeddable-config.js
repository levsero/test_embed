import _ from 'lodash'
import isFeatureEnabled from 'src/embeds/webWidget/selectors/feature-flags/index'
import {
  TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
  TALK_DISCONNECT_SOCKET_EVENT,
  RECEIVED_DEFERRED_TALK_STATUS,
} from '../talk-action-types'
import {
  CALLBACK_ONLY,
  PHONE_ONLY,
  CALLBACK_AND_PHONE,
  CLICK_TO_CALL,
} from '../talk-capability-types'

const capabilityMap = {
  0: CALLBACK_ONLY,
  1: PHONE_ONLY,
  2: CALLBACK_AND_PHONE,
  3: CLICK_TO_CALL,
}

const initialState = {
  averageWaitTimeSetting: null,
  capability: isFeatureEnabled(null, 'digital_voice_enabled') ? CLICK_TO_CALL : CALLBACK_ONLY,
  enabled: false,
  nickname: '',
  phoneNumber: '',
  supportedCountries: [],
  connected: false,
  deferredStatusOnline: false,
}

const embeddableConfig = (state = initialState, action) => {
  const { payload } = action
  switch (action.type) {
    case TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT:
      let supportedCountries = payload.supportedCountries

      supportedCountries = supportedCountries ? supportedCountries.split(',') : []

      return {
        ...payload,
        supportedCountries: _.pull(supportedCountries, '', null),
        capability: isFeatureEnabled(null, 'digital_voice_enabled')
          ? CLICK_TO_CALL
          : capabilityMap[payload.capability],
        enabled: payload.enabled === true,
        connected: true,
        deferredStatusOnline: false,
      }
    case TALK_DISCONNECT_SOCKET_EVENT:
      return {
        ...state,
        enabled: false,
      }
    case RECEIVED_DEFERRED_TALK_STATUS:
      return {
        ...state,
        capability: isFeatureEnabled(null, 'digital_voice_enabled')
          ? CLICK_TO_CALL
          : capabilityMap[payload.capability],
        enabled: payload.enabled === true,
        deferredStatusOnline: payload.availability,
      }
    default:
      return state
  }
}

export default embeddableConfig
