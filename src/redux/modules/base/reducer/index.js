import { combineReducers } from 'redux';

import activeEmbed from './base-active-embed';
import widgetShown from './base-embed-shown';
import embeds from './base-embeds';
import backButtonVisible from './back-button-visibility';
import arturos from './base-arturos';
import embeddableConfig from './base-embeddable-config';
import queue from './base-queue';

export default combineReducers({
  activeEmbed,
  widgetShown,
  embeds,
  backButtonVisible,
  arturos,
  queue,
  embeddableConfig
});

