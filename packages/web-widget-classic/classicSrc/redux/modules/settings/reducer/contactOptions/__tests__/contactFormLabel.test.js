import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import contactFormLabel from '../contactFormLabel'

const badPayload = {
  foo: 'bar',
}
const goodPayload = {
  webWidget: {
    contactOptions: {
      contactFormLabel: { '*': 'form label' },
    },
  },
}

testReducer(contactFormLabel, [
  { type: undefined, payload: '' },
  { type: 'DERP DERP', payload: '' },
  { type: UPDATE_SETTINGS, payload: badPayload },
  { type: UPDATE_SETTINGS, payload: goodPayload },
])
