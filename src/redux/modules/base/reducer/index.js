import { combineReducers } from 'redux';

import activeEmbed from './base-active-embed';
import widgetShown from './base-embed-shown';
import embeds from './base-embeds';
import backButtonVisible from './back-button-visibility';
import arturos from './base-arturos';
import embeddableConfig from './base-embeddable-config';
import isAuthenticationPending from './base-is-authentication-pending';
import queue from './base-queue';
import onApiListeners from './base-on-api-listeners';
import hasWidgetShown from './base-has-widget-shown';

export default combineReducers({
  activeEmbed,
  widgetShown,
  embeds,
  backButtonVisible,
  arturos,
  embeddableConfig,
  isAuthenticationPending,
  queue,
  onApiListeners,
  hasWidgetShown
});
