import * as actionTypes from 'src/embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET, API_CLEAR_FORM } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'
import searchFieldValue from '../searchFieldValue'

testReducer(searchFieldValue, [
  {
    action: { type: undefined },
    expected: '',
  },
  {
    action: { type: 'DERP DERP' },
    initialState: 'blah',
    expected: 'blah',
  },
  {
    action: {
      type: actionTypes.SEARCH_FIELD_CHANGED,
      payload: 'blah',
    },
    initialState: '',
    expected: 'blah',
  },
  {
    action: { type: API_RESET_WIDGET },
    initialState: 'blah',
    expected: '',
  },
  {
    action: { type: API_CLEAR_FORM },
    initialState: 'blah',
    expected: '',
  },
])
