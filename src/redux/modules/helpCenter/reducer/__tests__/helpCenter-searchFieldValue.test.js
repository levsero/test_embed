import searchFieldValue from '../helpCenter-searchFieldValue'
import * as actionTypes from 'embeds/helpCenter/actions/action-types'
import { API_CLEAR_HC_SEARCHES } from '../../../base/base-action-types'
import { testReducer } from 'src/util/testHelpers'

testReducer(searchFieldValue, [
  {
    action: { type: undefined },
    expected: ''
  },
  {
    action: { type: 'DERP DERP' },
    initialState: 'blah',
    expected: 'blah'
  },
  {
    action: {
      type: actionTypes.SEARCH_FIELD_CHANGED,
      payload: 'blah'
    },
    initialState: '',
    expected: 'blah'
  },
  {
    action: { type: API_CLEAR_HC_SEARCHES },
    initialState: 'blah',
    expected: ''
  }
])
