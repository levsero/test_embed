import { combineReducers } from 'redux';

import activeEmbed from './base-active-embed';
import widgetShown from './base-embed-shown';
import embeds from './base-embeds';
import backButtonVisible from './back-button-visibility';
import arturos from './base-arturos';

export default combineReducers({
  activeEmbed,
  widgetShown,
  embeds,
  backButtonVisible,
  arturos
});

