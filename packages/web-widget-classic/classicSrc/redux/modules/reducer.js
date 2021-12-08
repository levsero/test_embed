import answerBot from 'classicSrc/embeds/answerBot/reducers'
import helpCenter from 'classicSrc/embeds/helpCenter/reducers'
import support from 'classicSrc/embeds/support/reducers'
import talk from 'classicSrc/embeds/talk/reducers'
import webWidget from 'classicSrc/embeds/webWidget/reducers'
import { combineReducers } from 'redux'
import base from './base/reducer'
import chat from './chat/reducer'
import customerProvidedPrefill from './customerProvidedPrefill/reducer'
import form from './form/reducer'
import preview from './preview/reducer'
import rootReducer from './root/reducer/root'
import settings from './settings/reducer'

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
