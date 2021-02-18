import { combineReducers } from 'redux'

import lastScroll from './last-scroll'
import lastScreenClosed from './last-screen-closed'
import getInTouchVisible from './get-in-touch-visible'

export default combineReducers({
  lastScroll,
  lastScreenClosed,
  getInTouchVisible,
})
