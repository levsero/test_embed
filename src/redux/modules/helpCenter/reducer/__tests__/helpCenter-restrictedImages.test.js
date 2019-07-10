import restrictedImages from '../helpCenter-restrictedImages'
import * as actionTypes from 'src/redux/modules/helpCenter/helpCenter-action-types'
import { API_CLEAR_HC_SEARCHES } from '../../../base/base-action-types'
import { testReducer } from 'src/util/testHelpers'

testReducer(restrictedImages, [
  {
    action: { type: undefined },
    expected: {}
  },
  {
    action: { type: 'DERP DERP' },
    initialState: { abc: 123 },
    expected: { abc: 123 }
  },
  {
    action: {
      type: actionTypes.ADD_RESTRICTED_IMAGE,
      payload: {
        hello: 'world'
      }
    },
    initialState: { foo: 'bar' },
    expected: { hello: 'world', foo: 'bar' }
  },
  {
    action: { type: API_CLEAR_HC_SEARCHES },
    initialState: { blah: 123 },
    expected: {}
  }
])
