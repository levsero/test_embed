import { combineReducers } from 'redux';

import activeEmbed from './base-active-embed';
import authenticated from './base-authenticated';
import embedShown from './base-embed-shown';
import embeds from './base-embeds';
import backButtonVisible from './back-button-visibility';

export default combineReducers({
  activeEmbed,
  authenticated,
  embedShown,
  embeds,
  backButtonVisible
});

