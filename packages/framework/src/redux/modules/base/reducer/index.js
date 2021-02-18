import { combineReducers } from 'redux'

import activeEmbed from './base-active-embed'
import widgetShown from './base-embed-shown'
import embeds from './base-embeds'
import backButtonVisible from './back-button-visibility'
import arturos from './base-arturos'
import embeddableConfig from './base-embeddable-config'
import isAuthenticationPending from './base-is-authentication-pending'
import queue from './base-queue'
import hasWidgetShown from './base-has-widget-shown'
import webWidgetOpen from './web-widget-open'
import launcherVisible from './launcher-visibility'
import widgetInitialised from './base-widget-initialised'
import hidden from './base-hidden'
import bootupTimeout from './base-bootupTimeout'
import locale from './base-locale'
import isChatBadgeMinimized from './base-is-chat-badge-minimized'
import afterWidgetShowAnimation from './base-after-widget-show-animation'

export default combineReducers({
  activeEmbed,
  afterWidgetShowAnimation,
  arturos,
  backButtonVisible,
  bootupTimeout,
  embeddableConfig,
  embeds,
  hasWidgetShown,
  hidden,
  isAuthenticationPending,
  isChatBadgeMinimized,
  launcherVisible,
  locale,
  queue,
  widgetInitialised,
  webWidgetOpen,
  widgetShown,
})
