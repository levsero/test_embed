import * as actionTypes from 'classicSrc/embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'classicSrc/redux/modules/base/base-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import manualContextualSuggestions from '../manualContextualSuggestions'

const initialState = {
  query: '',
  labels: [],
  url: false,
}

testReducer(manualContextualSuggestions, [
  {
    action: { type: undefined },
    expected: initialState,
  },
  {
    action: { type: 'DERP DERP' },
    initialState: { query: 'blah', labels: ['hello'], url: false },
    expected: { query: 'blah', labels: ['hello'], url: false },
  },
  {
    action: {
      type: actionTypes.CONTEXTUAL_SUGGESTIONS_MANUALLY_SET,
      payload: {
        search: 'yolo search',
        labels: ['y', 'o', 'l', 'o'],
      },
    },
    expected: {
      query: 'yolo search',
      labels: [],
      url: false,
    },
  },
  {
    action: {
      type: actionTypes.CONTEXTUAL_SUGGESTIONS_MANUALLY_SET,
      payload: {
        labels: ['yo', 'this', 'a', 'label'],
        url: true,
      },
    },
    expected: {
      query: '',
      labels: ['yo', 'this', 'a', 'label'],
      url: false,
    },
  },
  {
    action: {
      type: actionTypes.CONTEXTUAL_SUGGESTIONS_MANUALLY_SET,
      payload: {
        url: true,
      },
    },
    expected: {
      query: '',
      labels: [],
      url: true,
    },
  },
  {
    action: {
      type: API_RESET_WIDGET,
      labels: ['yo', 'this', 'a', 'label'],
      url: true,
    },
    initialState: {
      query: 'Hello David, my name is HAL',
      labels: ['destroy', 'all', 'humans'],
      url: 'DoYouTrustMe.com',
    },
    expected: initialState,
  },
])
