import { combineReducers } from 'redux'
import rootReducer from './root/reducer/root'

import base from './base/reducer'
import settings from './settings/reducer'
import chat from './chat/reducer'
import talk from './talk/reducer'
import helpCenter from 'embeds/helpCenter/reducers'
import preview from './preview/reducer'
import support from 'embeds/support/reducers'
import webWidget from 'embeds/webWidget/reducers'
import answerBot from 'embeds/answerBot/reducers'
import customerProvidedPrefill from './customerProvidedPrefill/reducer'

const combinedReducers = combineReducers({
  base,
  settings,
  chat,
  talk,
  helpCenter,
  answerBot,
  preview,
  support,
  webWidget,
  customerProvidedPrefill
})

export default function reducer(state, action) {
  const initialState = combinedReducers(state, action)
  const finalState = rootReducer(initialState, action)

  return finalState
}
