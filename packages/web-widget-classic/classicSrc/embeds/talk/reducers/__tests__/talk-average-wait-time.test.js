import * as actionTypes from 'classicSrc/embeds/talk/action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import averageWaitTime from '../talk-average-wait-time'

const initialState = {
  waitTime: '0',
  enabled: false,
}

testReducer(averageWaitTime, [
  {
    action: { type: undefined },
    expected: initialState,
  },
  {
    action: { type: 'DERP DERP' },
    initialState: { waitTime: '23', enabled: true },
    expected: { waitTime: '23', enabled: true },
  },
  {
    action: {
      type: actionTypes.TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
      payload: {
        averageWaitTime: '1',
        averageWaitTimeSetting: 'exact',
        averageWaitTimeEnabled: true,
      },
    },
    expected: {
      waitTime: '1',
      enabled: true,
    },
  },
  {
    action: {
      type: actionTypes.TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
      payload: {
        averageWaitTime: null,
        averageWaitTimeSetting: 'exact',
        averageWaitTimeEnabled: false,
      },
    },
    initialState,
    expected: {
      waitTime: '0',
      enabled: false,
    },
  },
  {
    action: {
      type: actionTypes.TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
      payload: {
        averageWaitTime: null,
        averageWaitTimeEnabled: false,
      },
    },
    expected: {
      waitTime: '0',
      enabled: false,
    },
  },
  {
    action: {
      type: actionTypes.TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT,
      payload: {
        averageWaitTime: '1',
        averageWaitTimeSetting: 'exact',
        averageWaitTimeEnabled: true,
      },
    },
    expected: {
      waitTime: '1',
      enabled: true,
    },
  },
  {
    action: {
      type: actionTypes.TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT,
      payload: {
        averageWaitTime: null,
        averageWaitTimeSetting: 'exact',
        averageWaitTimeEnabled: false,
      },
    },
    initialState,
    expected: {
      waitTime: '0',
      enabled: false,
    },
  },
  {
    action: {
      type: actionTypes.TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT,
      payload: {
        averageWaitTime: null,
        averageWaitTimeEnabled: false,
      },
    },
    expected: {
      waitTime: '0',
      enabled: false,
    },
  },
])
