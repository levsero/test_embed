import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import enabled from '../enabled'

const badPayload = {
  foo: 'bar',
}
const goodPayload = {
  webWidget: {
    contactOptions: {
      enabled: true,
    },
  },
}

testReducer(enabled, [
  { type: undefined, payload: '' },
  { type: 'DERP DERP', payload: '' },
  { type: UPDATE_SETTINGS, payload: badPayload },
  { type: UPDATE_SETTINGS, payload: goodPayload },
])
