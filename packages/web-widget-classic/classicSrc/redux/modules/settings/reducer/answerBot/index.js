import { combineReducers } from 'redux'
import avatar from './avatar'
import delayChannelChoice from './delay-channel-choice'
import search from './search'
import suppress from './suppress'
import title from './title'

export default combineReducers({
  avatar,
  title,
  search,
  suppress,
  delayChannelChoice,
})
