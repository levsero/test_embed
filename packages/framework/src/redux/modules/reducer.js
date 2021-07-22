import { combineReducers } from 'redux'
import answerBot from 'embeds/answerBot/reducers'
import helpCenter from 'embeds/helpCenter/reducers'
import support from 'embeds/support/reducers'
import webWidget from 'embeds/webWidget/reducers'
import base from './base/reducer'
import chat from './chat/reducer'
import customerProvidedPrefill from './customerProvidedPrefill/reducer'
import form from './form/reducer'
import preview from './preview/reducer'
import rootReducer from './root/reducer/root'
import settings from './settings/reducer'
import talk from './talk/reducer'

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
  customerProvidedPrefill,
  form,
})

export default function reducer(state, action) {
  const initialState = combinedReducers(state, action)
  const finalState = rootReducer(initialState, action)

  return finalState
}
