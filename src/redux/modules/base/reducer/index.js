import { combineReducers } from 'redux';

import activeEmbed from './base-active-embed';
import embeds from './base-embeds';

export default combineReducers({
  activeEmbed,
  embeds
});

