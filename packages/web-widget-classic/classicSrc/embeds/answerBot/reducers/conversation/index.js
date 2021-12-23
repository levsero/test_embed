import { combineReducers } from 'redux'
import getInTouchVisible from './get-in-touch-visible'
import lastScreenClosed from './last-screen-closed'
import lastScroll from './last-scroll'

export default combineReducers({
  lastScroll,
  lastScreenClosed,
  getInTouchVisible,
})
