import {
  GET_IN_TOUCH_SHOWN,
  GET_IN_TOUCH_CLICKED,
} from 'classicSrc/embeds/answerBot/actions/conversation/action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import getInTouchVisible from '../get-in-touch-visible'

testReducer(getInTouchVisible, [
  {
    action: {
      type: GET_IN_TOUCH_SHOWN,
    },
    initialState: false,
    expected: true,
  },
  {
    action: {
      type: GET_IN_TOUCH_CLICKED,
    },
    initialState: true,
    expected: false,
  },
  {
    action: {
      type: 'SOME_NONSENSE_ACTION',
    },
    initialState: false,
    expected: false,
  },
])
