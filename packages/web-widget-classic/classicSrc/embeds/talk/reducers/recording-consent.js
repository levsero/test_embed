import { TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT } from 'classicSrc/embeds/talk/action-types'
import {
  RECORDING_CONSENT_ACCEPTED,
  RECORDING_CONSENT_DENIED,
} from 'classicSrc/embeds/talk/actions/action-types'

const initialState = null

const OPT_IN = 'opt-in'
const OPT_OUT = 'opt-out'

const userRecordingConsent = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case RECORDING_CONSENT_ACCEPTED:
      return OPT_IN
    case RECORDING_CONSENT_DENIED:
      return OPT_OUT
    case TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT:
      const { recordingConsent } = payload

      switch (recordingConsent) {
        case OPT_IN:
          return OPT_OUT
        case OPT_OUT:
          return OPT_IN
        default:
          return state
      }

    default:
      return state
  }
}

export { userRecordingConsent as default, OPT_IN, OPT_OUT }
