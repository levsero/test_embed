import { testReducer } from 'src/util/testHelpers'
import getInTouchVisible from '../get-in-touch-visible'
import {
  GET_IN_TOUCH_SHOWN,
  GET_IN_TOUCH_CLICKED,
} from 'src/embeds/answerBot/actions/conversation/action-types'

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
