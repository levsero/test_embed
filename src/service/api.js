import _ from 'lodash';

import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { renderer } from 'service/renderer';
import { handleIdentifyRecieved, logout, handleOnApiCalled } from 'src/redux/modules/base';
import { displayArticle, setContextualSuggestionsManually } from 'src/redux/modules/helpCenter';
import { updateSettings } from 'src/redux/modules/settings';
import { chatLogout } from 'src/redux/modules/chat';
import { getIsChatting, getDepartmentsList, getDepartment } from 'src/redux/modules/chat/chat-selectors';

import {
  API_ON_CLOSE_NAME,
  API_GET_IS_CHATTING_NAME,
  API_GET_DEPARTMENTS_ALL_NAME,
  API_GET_DEPARTMENTS_DEPARTMENT_NAME } from 'constants/api';
import { CLOSE_BUTTON_CLICKED } from 'src/redux/modules/base/base-action-types';

const newAPIPostRenderQueue = [];

const addToPostRenderQueue = (...args) => {
  newAPIPostRenderQueue.push(args);
};
const identifyApi = (reduxStore, user) => {
  mediator.channel.broadcast('.onIdentify', user);

  reduxStore.dispatch(handleIdentifyRecieved(_.pick(user, ['name', 'email']), _.isString));
};
const setLocaleApi = (_, locale) => {
  i18n.setLocale(locale, true);
  mediator.channel.broadcast('.onSetLocale', locale);
};
const updateSettingsApi = (reduxStore, newSettings) => {
  reduxStore.dispatch(updateSettings(newSettings));
};
const logoutApi = (reduxStore) => {
  reduxStore.dispatch(logout());
  mediator.channel.broadcast('.logout');
  reduxStore.dispatch(chatLogout());
};
const setHelpCenterSuggestionsApi = (reduxStore, options) => {
  const onDone = () => mediator.channel.broadcast('.setHelpCenterSuggestions');

  reduxStore.dispatch(setContextualSuggestionsManually(options, onDone));
};
const onApi = (reduxStore, event, callback) => {
  const listenersMap = {
    [API_ON_CLOSE_NAME]: [ CLOSE_BUTTON_CLICKED ]
  };

  if (_.isFunction(callback) && listenersMap[event]) {
    reduxStore.dispatch(handleOnApiCalled(listenersMap[event], callback));
  }
};
const getApi = (reduxStore, ...args) => {
  const state = reduxStore.getState();
  const allowlist = {
    [API_GET_IS_CHATTING_NAME]: getIsChatting,
    [API_GET_DEPARTMENTS_ALL_NAME]: getDepartmentsList,
    [API_GET_DEPARTMENTS_DEPARTMENT_NAME]: getDepartment
  };
  const params = Array.from(args);
  const item = params[0];
  const getParams = params.slice(1);

  if (allowlist[item]) {
    return allowlist[item](state, ...getParams);
  }
};

const newApiStructurePostRender = {
  webwidget: {
    hide: () => mediator.channel.broadcast('.hide'),
    setLocale: setLocaleApi,
    identify: identifyApi,
    updateSettings: updateSettingsApi,
    logout: logoutApi,
    setHelpCenterSuggestions: setHelpCenterSuggestionsApi,
  },
  on: onApi,
  get: getApi
};
const newApiStructurePreRender = {
  webwidget: {
    hide: renderer.hide,
    setLocale: (_, locale) => i18n.setLocale(locale),
    identify: (_, ...args) => addToPostRenderQueue(['webWidget', 'identify', ...args]),
    updateSettings: (_, ...args) => addToPostRenderQueue(['webWidget', 'updateSettings', ...args]),
    logout: (_, ...args) => addToPostRenderQueue(['webWidget', 'logout', ...args]),
    setHelpCenterSuggestions: (_, ...args) => {
      addToPostRenderQueue(['webWidget', 'setHelpCenterSuggestions', ...args]);
    }
  },
  on: onApi,
  get: (_, ...args) => addToPostRenderQueue(['webWidget:get', ...args])
};

const handleNewApi = (apiStructure, reduxStore, args) => {
  const params = Array.from(args);
  const defaultPath = 'webwidget';
  const topMethod = params[0].split(':')[1] || defaultPath;
  const subMethod = params[1];

  if (apiStructure[topMethod][subMethod]) {
    const apiParams = params.slice(2);

    return apiStructure[topMethod][subMethod](reduxStore, ...apiParams);
  } else {
    const apiParams = params.slice(1);

    return apiStructure[topMethod](reduxStore, ...apiParams);
  }
};

function handleQueue(reduxStore, queue) {
  const logApiError = (api, e = {}) => {
    const err = new Error([
      'An error occurred in your use of the Zendesk Widget API:',
      api,
      'Check out the Developer API docs to make sure you\'re using it correctly',
      'https://developer.zendesk.com/embeddables/docs/widget/api',
      e.stack
    ].join('\n\n'));

    err.special = true;
    throw err;
  };

  _.forEach(queue, (method) => {
    if (method[0].locale) {
      // Backwards compat with zE({locale: 'zh-CN'}) calls
      i18n.setLocale(method[0].locale);
    } else if (_.isFunction(method[0])) {
      // Old API
      try {
        method[0]();
      } catch (e) {
        logApiError(method[0], e);
      }
    } else if (_.includes(method[0], 'webWidget')){
      // New API
      try {
        handleNewApi(newApiStructurePreRender, reduxStore, method);
      } catch (e) {
        logApiError(`"${method[0]} ${method[1]}"`, e);
      }
    } else {
      logApiError(method);
    }
  });
}

function handlePostRenderQueue(win, postRenderQueue, reduxStore) {
  _.forEach(postRenderQueue, (method) => {
    win.zE[method[0]](...method[1]);
  });

  _.forEach(newAPIPostRenderQueue, (item) => {
    handleNewApi(newApiStructurePostRender, reduxStore, ...item);
  });

  renderer.postRenderCallbacks();
}

function setupWidgetQueue(win, postRenderQueue, reduxStore) {
  let devApi;

  // no "fat arrow" because it binds `this` to the scoped environment and does not allow it to be re-set with .bind()
  const postRenderQueueCallback = function(...args) {
    // "this" is bound to the method name
    postRenderQueue.push([this, args]);
  };
  const publicApi = {
    version: __EMBEDDABLE_VERSION__,
    setLocale: i18n.setLocale,
    hide: renderer.hide,
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

  if (__DEV__) {
    devApi = {
      devRender: (config) => {
        if (config.ipmAllowed) {
          setupIPMApi(win, reduxStore, config);
        }
        renderer.init(config, reduxStore);
      }
    };
  }

  if (win.zE === win.zEmbed) {
    win.zE = win.zEmbed = (...args) => {
      if (_.isFunction(args[0])) {
        args[0]();
      } else {
        return handleNewApi(newApiStructurePostRender, reduxStore, args);
      }
    };
  } else {
    win.zEmbed = (...args) => {
      if (_.isFunction(args[0])) {
        args[0]();
      } else {
        return handleNewApi(newApiStructurePostRender, reduxStore, args);
      }
    };
  }

  return {
    publicApi,
    devApi
  };
}

function setupZopimQueue(win) {
  let $zopim = () => {};

  // To enable $zopim api calls to work we need to define the queue callback.
  // When we inject the snippet we remove the queue method and just inject
  // the script tag.
  if (!win.$zopim) {
    $zopim = win.$zopim = (callback) => {
      $zopim._.push(callback);
    };

    $zopim.set = (callback) => {
      $zopim.set._.push(callback);
    };
    $zopim._ = [];
    $zopim.set._ = [];
  }
}

function setupIPMApi(win, reduxStore, embeddableConfig = {}) {
  const existingConfig = !_.isEmpty(embeddableConfig.embeds);
  const prefix = existingConfig ? '' : 'ipm.';

  win.zE.configureIPMWidget = (config) => {
    if (!existingConfig) {
      renderer.initIPM(config, embeddableConfig, reduxStore);
    }
  };
  win.zE.showIPMArticle = (articleId) => {
    reduxStore.dispatch(displayArticle(articleId));
  };
  win.zE.showIPMWidget = () => {
    mediator.channel.broadcast(`${prefix}webWidget.show`);
  };
  win.zE.hideIPMWidget = () => {
    mediator.channel.broadcast(`${prefix}webWidget.hide`);
  };
}

function setupWidgetApi(win, reduxStore) {
  win.zE.identify = (user) => identifyApi(reduxStore, user);
  win.zE.logout = () => logoutApi(reduxStore);
  win.zE.setHelpCenterSuggestions = (options) => setHelpCenterSuggestionsApi(reduxStore, options);
  win.zE.activate = (options) => mediator.channel.broadcast('.activate', options);
  win.zE.activateIpm = () => {}; // no-op until rest of connect code is removed
  win.zE.hide = () => mediator.channel.broadcast('.hide');
  win.zE.show = () => mediator.channel.broadcast('.show');
  win.zE.setLocale = (locale) => setLocaleApi(null, locale);
}

export const api = {
  handleQueue,
  handlePostRenderQueue,
  setupWidgetQueue,
  setupZopimQueue,
  setupWidgetApi,
};
