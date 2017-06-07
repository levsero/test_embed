import { combineReducers } from 'redux';

import activeEmbed from './base-active-embed';
import embeds from './base-embeds';
import zopim from './zopim';

export default combineReducers({
  activeEmbed,
  embeds,
  zopim
});

