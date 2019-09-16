import { combineReducers } from 'redux'
import rootReducer from './root/reducer/root'

import base from './base/reducer'
import settings from './settings/reducer'
import chat from './chat/reducer'
import talk from './talk/reducer'
import helpCenter from 'embeds/helpCenter/reducers'
import zopimChat from './zopimChat/reducer'
import submitTicket from './submitTicket/reducer'
import answerBot from './answerBot/reducer'
import preview from './preview/reducer'
import support from 'embeds/support/reducers'

const combinedReducers = combineReducers({
  base,
  settings,
  chat,
  talk,
  helpCenter,
  zopimChat,
  submitTicket,
  answerBot,
  preview,
  support
})

export default function reducer(state, action) {
  const initialState = combinedReducers(state, action)
  const finalState = rootReducer(initialState, action)

  return finalState
}
