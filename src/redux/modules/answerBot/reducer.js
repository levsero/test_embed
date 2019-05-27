import { combineReducers } from 'redux';

import messages from './conversation/reducer/messages';
import conversation from './conversation/reducer';
import sessions from './sessions/reducer/sessions';
import currentMessage from './root/reducer/current-message';
import currentSessionID from './root/reducer/current-session-id';
import currentArticle from './root/reducer/current-article';
import currentContextualArticle from './root/reducer/current-contextual-article';
import currentScreen from './root/reducer/current-screen';
import greeted from './root/reducer/greeted';
import contextualSearchFinished from './root/reducer/contextual-search-finished';
import initialFallbackSuggested from './root/reducer/initial-fallback-suggested';

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
  currentContextualArticle
});
