import restrictedImages from '../restrictedImages'
import * as actionTypes from 'embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'

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
