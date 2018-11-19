import _ from 'lodash';

import { mediator } from 'service/mediator';
import { renderer } from 'service/renderer';
import {
  activateRecieved,
  legacyShowReceived } from 'src/redux/modules/base';
import { displayArticle } from 'src/redux/modules/helpCenter';
import {
  hideApi,
  identifyApi,
  logoutApi,
  prefill,
  setHelpCenterSuggestionsApi,
  setLocaleApi } from 'src/service/api/apis';
import tracker from 'service/logging/tracker';

export function apiSetup(win, reduxStore, embeddableConfig = {}) {
  const existingConfig = !_.isEmpty(embeddableConfig.embeds);

  win.zE.configureIPMWidget = (config) => {
    if (!existingConfig) {
      renderer.initIPM(config, embeddableConfig, reduxStore);
    }
  };
  win.zE.showIPMArticle = (articleId) => {
    reduxStore.dispatch(displayArticle(articleId));
  };
  win.zE.showIPMWidget = () => {
    reduxStore.dispatch(activateRecieved());
  };
  win.zE.hideIPMWidget = () => {
    hideApi(reduxStore);
  };
}

export function legacyApiSetup(win, reduxStore) {
  win.zE.identify = (user) => {
    identifyApi(reduxStore, user);

    if (!user || (!user.email || !user.name)) return;

    const prefillUser = {
      name: {
        value: user.name
      },
      email: {
        value: user.email
      }
    };

    prefill(reduxStore, prefillUser);
  };
  win.zE.logout = () => logoutApi(reduxStore);
  win.zE.setHelpCenterSuggestions = (options) => setHelpCenterSuggestionsApi(reduxStore, options);
  win.zE.activate = (options) => {
    mediator.channel.broadcast('.activate', options);
    reduxStore.dispatch(activateRecieved(options));
  };
  win.zE.activateIpm = () => {}; // no-op until rest of connect code is removed
  win.zE.hide = () => hideApi(reduxStore);
  win.zE.show = () => {
    reduxStore.dispatch(legacyShowReceived());
  };
  win.zE.setLocale = (locale) => setLocaleApi(reduxStore, locale);
  tracker.addTo(win.zE, 'zE');
}

export function setupDevApi(win, reduxStore) {
  return {
    devRender: (config) => {
      if (config.ipmAllowed) {
        apiSetup(win, reduxStore, config);
      }
      renderer.init(config, reduxStore);
    }
  };
}

export function setupPublicApi(postRenderQueueCallback, reduxStore) {
  return {
    version: __EMBEDDABLE_VERSION__,
    setLocale: (locale) => {
      tracker.track('zE.setLocale', locale);
      setLocaleApi(reduxStore, locale);
    },
    hide: () => {
      tracker.track('zE.hide');
      hideApi(reduxStore);
    },
    show: postRenderQueueCallback.bind('show'),
    setHelpCenterSuggestions: postRenderQueueCallback.bind('setHelpCenterSuggestions'),
    identify: postRenderQueueCallback.bind('identify'),
    logout: postRenderQueueCallback.bind('logout'),
    activate: postRenderQueueCallback.bind('activate'),
    configureIPMWidget: postRenderQueueCallback.bind('configureIPMWidget'),
    showIPMArticle: postRenderQueueCallback.bind('showIPMArticle'),
    hideIPMWidget: postRenderQueueCallback.bind('hideIPMWidget'),
    activateIpm: () => {} // no-op until rest of connect code is removed
  };
}
