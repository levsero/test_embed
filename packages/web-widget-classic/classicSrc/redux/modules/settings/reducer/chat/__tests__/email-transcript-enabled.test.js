import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import reducer from '../email-transcript-enabled'

const badPayload = {
  foo: 'bar',
}
const goodPayload = {
  webWidget: {
    chat: {
      menuOptions: {
        emailTranscript: false,
      },
    },
  },
}

testReducer(reducer, [
  { type: undefined, payload: '' },
  { type: 'DERP DERP', payload: '' },
  { type: UPDATE_SETTINGS, payload: badPayload },
  { type: UPDATE_SETTINGS, payload: goodPayload },
])
