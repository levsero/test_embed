import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import contactButton from '../contactButton'

const badPayload = {
  foo: 'bar',
}
const goodPayload = {
  webWidget: {
    contactOptions: {
      contactButton: { '*': 'button' },
    },
  },
}

testReducer(contactButton, [
  { type: undefined, payload: '' },
  { type: 'DERP DERP', payload: '' },
  { type: UPDATE_SETTINGS, payload: badPayload },
  { type: UPDATE_SETTINGS, payload: goodPayload },
])
