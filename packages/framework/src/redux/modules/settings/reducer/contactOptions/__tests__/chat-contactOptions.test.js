import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import { testReducer } from 'src/util/testHelpers'
import chatContactOptions from '../chat-contactOptions'

const badPayload = {
  foo: 'bar',
}
const goodPayload = {
  webWidget: {
    contactOptions: {
      chatLabelOnline: { '*': 'online label' },
      chatLabelOffline: { '*': 'offline label' },
    },
  },
}

testReducer(chatContactOptions, [
  { type: undefined, payload: '' },
  { type: 'DERP DERP', payload: '' },
  { type: UPDATE_SETTINGS, payload: badPayload },
  { type: UPDATE_SETTINGS, payload: goodPayload },
])
