import { combineReducers } from 'redux';

import activeEmbed from './base-active-embed';
import authenticated from './base-authenticated';
import embeds from './base-embeds';
import zopim from './zopim';
import backButtonVisible from './back-button-visibility';

export default combineReducers({
  activeEmbed,
  authenticated,
  embeds,
  zopim,
  backButtonVisible
});

