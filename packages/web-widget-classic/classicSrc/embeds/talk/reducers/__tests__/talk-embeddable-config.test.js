import * as actionTypes from 'classicSrc/embeds/talk/action-types'
import {
  CALLBACK_ONLY,
  PHONE_ONLY,
  CALLBACK_AND_PHONE,
} from 'classicSrc/embeds/talk/talk-capability-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import embeddableConfig from '../talk-embeddable-config'

const initialState = {
  averageWaitTimeSetting: null,
  capability: CALLBACK_ONLY,
  enabled: false,
  nickname: '',
  phoneNumber: '',
  supportedCountries: [],
  deferredStatusOnline: false,
  connected: false,
}

const mockConfig = {
  averageWaitTimeSetting: null,
  capability: '0',
  enabled: true,
  nickname: 'nickname',
  phoneNumber: '+61412345678',
  supportedCountries: 'CA,ID',
}

testReducer(embeddableConfig, [
  {
    action: { type: undefined },
    expected: initialState,
  },
  {
    action: { type: 'something' },
    initialState: { connected: true },
    expected: { connected: true },
  },
  {
    action: {
      type: actionTypes.TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
      payload: mockConfig,
    },
    expected: {
      ...mockConfig,
      supportedCountries: ['CA', 'ID'],
      capability: CALLBACK_ONLY,
      enabled: true,
      connected: true,
      deferredStatusOnline: false,
    },
  },
  {
    action: {
      type: actionTypes.TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
      payload: {
        ...mockConfig,
        capability: '2',
      },
    },
    expected: {
      ...mockConfig,
      supportedCountries: ['CA', 'ID'],
      capability: CALLBACK_AND_PHONE,
      enabled: true,
      connected: true,
      deferredStatusOnline: false,
    },
  },
  {
    action: {
      type: actionTypes.TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
      payload: {
        ...mockConfig,
        capability: '1',
      },
    },
    expected: {
      ...mockConfig,
      supportedCountries: ['CA', 'ID'],
      capability: PHONE_ONLY,
      enabled: true,
      connected: true,
      deferredStatusOnline: false,
    },
  },
])
