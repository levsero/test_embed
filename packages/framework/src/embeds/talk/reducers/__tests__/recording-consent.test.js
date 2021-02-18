import { testReducer } from 'utility/testHelpers'
import {
  RECORDING_CONSENT_ACCEPTED,
  RECORDING_CONSENT_DENIED,
} from 'src/embeds/talk/actions/action-types'

import { TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT } from 'src/redux/modules/talk/talk-action-types'

import userRecordingConsent, { OPT_IN, OPT_OUT } from '../recording-consent'

testReducer(userRecordingConsent, [
  {
    action: { type: RECORDING_CONSENT_ACCEPTED },
    initialState: OPT_OUT,
    expected: OPT_IN,
  },
  {
    action: { type: RECORDING_CONSENT_DENIED },
    initialState: OPT_IN,
    expected: OPT_OUT,
  },
  {
    action: { type: RECORDING_CONSENT_ACCEPTED },
    initialState: null,
    expected: OPT_IN,
  },
  {
    action: { type: RECORDING_CONSENT_DENIED },
    initialState: null,
    expected: OPT_OUT,
  },
  {
    action: { type: TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT, payload: { recordingConsent: OPT_IN } },
    initialState: null,
    expected: OPT_OUT,
  },
  {
    action: { type: TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT, payload: { recordingConsent: OPT_OUT } },
    initialState: null,
    expected: OPT_IN,
  },
  {
    action: { type: TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT, payload: { recordingConsent: null } },
    initialState: null,
    expected: null,
  },
])
