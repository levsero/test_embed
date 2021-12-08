import * as actionTypes from 'classicSrc/embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'classicSrc/redux/modules/base/base-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import restrictedImages from '../restrictedImages'

testReducer(restrictedImages, [
  {
    action: { type: undefined },
    expected: {},
  },
  {
    action: { type: 'DERP DERP' },
    initialState: { abc: 123 },
    expected: { abc: 123 },
  },
  {
    action: {
      type: actionTypes.ADD_RESTRICTED_IMAGE,
      payload: {
        hello: 'world',
      },
    },
    initialState: { foo: 'bar' },
    expected: { hello: 'world', foo: 'bar' },
  },
  {
    action: { type: API_RESET_WIDGET },
    initialState: { blah: 123 },
    expected: {},
  },
])
