import { combineReducers } from 'redux'
import conversation from './conversation'
import messages from './conversation/messages'
import contextualSearchFinished from './root/contextual-search-finished'
import currentArticle from './root/current-article'
import currentContextualArticle from './root/current-contextual-article'
import currentMessage from './root/current-message'
import currentScreen from './root/current-screen'
import currentSessionID from './root/current-session-id'
import greeted from './root/greeted'
import initialFallbackSuggested from './root/initial-fallback-suggested'
import questionValueChangedTime from './root/question-value-changed-time'
import sessions from './sessions/sessions'

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
  questionValueChangedTime,
})
