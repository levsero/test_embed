import * as actionTypes from 'classicSrc/embeds/talk/action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import agentAvailability from '../talk-agent-availability'

testReducer(agentAvailability, [
  {
    action: { type: undefined },
    expected: false,
  },
  {
    action: { type: 'DERP DERP' },
    initialState: true,
    expected: true,
  },
  {
    action: {
      type: actionTypes.TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
      payload: { agentAvailability: true },
    },
    initialState: false,
    expected: true,
  },
  {
    action: {
      type: actionTypes.TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
      payload: { agentAvailability: true },
    },
    initialState: false,
    expected: true,
  },
  {
    action: {
      type: actionTypes.TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
      payload: { something: true },
    },
    expected: false,
  },
  {
    action: {
      type: actionTypes.TALK_DISCONNECT_SOCKET_EVENT,
    },
    initialState: true,
    expected: false,
  },
])
