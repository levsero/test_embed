import { combineReducers } from 'redux'

import messages from './conversation/messages'
import conversation from './conversation'
import sessions from './sessions/sessions'
import currentMessage from './root/current-message'
import currentSessionID from './root/current-session-id'
import currentArticle from './root/current-article'
import currentContextualArticle from './root/current-contextual-article'
import currentScreen from './root/current-screen'
import greeted from './root/greeted'
import contextualSearchFinished from './root/contextual-search-finished'
import initialFallbackSuggested from './root/initial-fallback-suggested'
import questionValueChangedTime from './root/question-value-changed-time'

export default combineReducers({
  messages,
  conversation,
  currentMessage,
  sessions,
  currentSessionID,
  currentArticle,
  currentScreen,
  greeted,
  initialFallbackSuggested,
  contextualSearchFinished,
  currentContextualArticle,
  questionValueChangedTime
})
