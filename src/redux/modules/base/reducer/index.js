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
import webWidgetVisible from './web-widget-visibility';
import launcherVisible from './launcher-visibility';
import widgetInitialised from './base-widget-initialised';
import hidden from './base-hidden';
import bootupTimeout from './base-bootupTimeout';

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
  hasWidgetShown,
  webWidgetVisible,
  launcherVisible,
  widgetInitialised,
  hidden,
  bootupTimeout
});
