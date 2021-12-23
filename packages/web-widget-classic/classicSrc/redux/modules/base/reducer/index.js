import { combineReducers } from 'redux'
import backButtonVisible from './back-button-visibility'
import activeEmbed from './base-active-embed'
import afterWidgetShowAnimation from './base-after-widget-show-animation'
import arturos from './base-arturos'
import bootupTimeout from './base-bootupTimeout'
import widgetShown from './base-embed-shown'
import embeddableConfig from './base-embeddable-config'
import embeds from './base-embeds'
import hasWidgetShown from './base-has-widget-shown'
import hidden from './base-hidden'
import isAuthenticationPending from './base-is-authentication-pending'
import isChatBadgeMinimized from './base-is-chat-badge-minimized'
import locale from './base-locale'
import queue from './base-queue'
import widgetInitialised from './base-widget-initialised'
import launcherVisible from './launcher-visibility'
import webWidgetOpen from './web-widget-open'

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
