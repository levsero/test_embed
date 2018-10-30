import _ from 'lodash';

import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { renderer } from 'service/renderer';
import {
  handleOnApiCalled,
  activateRecieved,
  legacyShowReceived } from 'src/redux/modules/base';
import { displayArticle } from 'src/redux/modules/helpCenter';
import {
  getDepartmentsList,
  getDepartment,
  getNotificationCount,
  getChatStatus } from 'src/redux/modules/chat/chat-selectors';
import {
  API_ON_CHAT_STATUS_NAME,
  API_ON_CLOSE_NAME,
  API_ON_CHAT_CONNECTED_NAME,
  API_ON_CHAT_START_NAME,
  API_ON_CHAT_END_NAME,
  API_ON_CHAT_UNREAD_MESSAGES_NAME,
  API_GET_IS_CHATTING_NAME,
  API_GET_DEPARTMENTS_ALL_NAME,
  API_GET_DEPARTMENTS_DEPARTMENT_NAME,
  API_GET_DISPLAY_NAME,
  API_ON_OPEN_NAME } from 'constants/api';
import {
  CLOSE_BUTTON_CLICKED,
  LAUNCHER_CLICKED } from 'src/redux/modules/base/base-action-types';
import {
  CHAT_CONNECTED,
  END_CHAT_REQUEST_SUCCESS,
  NEW_AGENT_MESSAGE_RECEIVED,
  CHAT_STARTED,
  SDK_ACCOUNT_STATUS } from 'src/redux/modules/chat/chat-action-types';
import {
  endChatApi,
  sendChatMsgApi,
  identifyApi,
  openApi,
  closeApi,
  toggleApi,
  setLocaleApi,
  updateSettingsApi,
  logoutApi,
  setHelpCenterSuggestionsApi,
  prefill,
  hideApi,
  showApi,
  updatePathApi,
  clearFormState,
  displayApi,
  isChattingApi
} from 'src/service/api/apis';

const newAPIPostRenderQueue = [];

const addToPostRenderQueue = (...args) => {
  newAPIPostRenderQueue.push(args);
};

const getWidgetChatApiObj = () => {
  return {
    end: endChatApi,
    send: sendChatMsgApi
  };
};

const onApiObj = () => {
  const chatEventMap = {
    [API_ON_CHAT_CONNECTED_NAME]: { actionType: CHAT_CONNECTED },
    [API_ON_CHAT_END_NAME]: { actionType: END_CHAT_REQUEST_SUCCESS },
    [API_ON_CHAT_START_NAME]: { actionType: CHAT_STARTED },
    [API_ON_CHAT_STATUS_NAME]: {
      actionType: SDK_ACCOUNT_STATUS,
      selectors: [getChatStatus]
    },
    [API_ON_CHAT_UNREAD_MESSAGES_NAME]: {
      actionType: NEW_AGENT_MESSAGE_RECEIVED,
      selectors: [getNotificationCount]
    }
  };

  const baseEventMap = {
    [API_ON_CLOSE_NAME]: { actionType: CLOSE_BUTTON_CLICKED },
    [API_ON_OPEN_NAME]: { actionType: LAUNCHER_CLICKED }
  };

  const eventDispatchWrapperFn = (actionType, selectors = []) => {
    return (reduxStore, callback) => {
      if (_.isFunction(callback)) {
        reduxStore.dispatch(handleOnApiCalled(actionType, selectors, callback));
      }
    };
  };

  const eventApiReducerFn = (eventMap) => {
    return _.reduce(eventMap, (apiObj, eventObj, eventName) => {
      const { actionType, selectors } = eventObj;

      apiObj[eventName] = eventDispatchWrapperFn(actionType, selectors);

      return apiObj;
    }, {});
  };

  return {
    'chat': eventApiReducerFn(chatEventMap),
    ...eventApiReducerFn(baseEventMap)
  };
};

const getApiObj = () => {
  return {
    chat: {
      [API_GET_IS_CHATTING_NAME]: isChattingApi,
      [API_GET_DEPARTMENTS_ALL_NAME]: (reduxStore, ...args) => getDepartmentsList(reduxStore.getState(), ...args),
      [API_GET_DEPARTMENTS_DEPARTMENT_NAME]: (reduxStore, ...args) => getDepartment(reduxStore.getState(), ...args),
    },
    [API_GET_DISPLAY_NAME]: displayApi
  };
};
const getApiPostRenderQueue = () => {
  const postRenderCallback = (_, ...args) => addToPostRenderQueue(['webWidget:get', ...args]);

  return {
    [API_GET_IS_CHATTING_NAME]: postRenderCallback,
    [API_GET_DEPARTMENTS_ALL_NAME]: postRenderCallback,
    [API_GET_DEPARTMENTS_DEPARTMENT_NAME]: postRenderCallback,
    [API_GET_DISPLAY_NAME]: postRenderCallback
  };
};

const newApiStructurePostRender = {
  webWidget: {
    hide: hideApi,
    show: showApi,
    open: openApi,
    close: closeApi,
    toggle: toggleApi,
    setLocale: setLocaleApi,
    identify: identifyApi,
    updateSettings: updateSettingsApi,
    logout: logoutApi,
    updatePath: updatePathApi,
    clear: clearFormState,
    prefill: prefill,
    chat: getWidgetChatApiObj(),
    on: onApiObj(),
    get: getApiObj(),
    helpCenter: {
      setSuggestions: setHelpCenterSuggestionsApi
    }
  }
};
const newApiStructurePreRender = {
  webWidget: {
    hide: hideApi,
    show: (_, ...args) => addToPostRenderQueue(['webWidget', 'show', ...args]),
    open: openApi,
    close: closeApi,
    toggle: toggleApi,
    setLocale: (_, locale) => i18n.setLocale(locale),
    identify: (_, ...args) => addToPostRenderQueue(['webWidget', 'identify', ...args]),
    updateSettings: (_, ...args) => addToPostRenderQueue(['webWidget', 'updateSettings', ...args]),
    logout: (_, ...args) => addToPostRenderQueue(['webWidget', 'logout', ...args]),
    updatePath: (_, ...args) => addToPostRenderQueue(['webWidget', 'updatePath', ...args]),
    clear: (reduxStore) => clearFormState(reduxStore),
    prefill: prefill,
    chat: getWidgetChatApiObj(),
    on: onApiObj(),
    get: getApiPostRenderQueue(),
    helpCenter: {
      setSuggestions: (_, ...args) => (
        addToPostRenderQueue(['webWidget', 'helpCenter:setSuggestions', ...args])
      )
    }
  }
};

const handleNewApi = (apiStructure, reduxStore, args) => {
  const getApiFunction = (methodAccessors) => {
    const keys = _.flatten(methodAccessors.map((accessor => {
      return accessor.split(':');
    }))).join('.');

    return _.get(apiStructure, keys, () => {});
  };
  const params = Array.from(args);

  /*
   Assume the first two arguments provided by the user will be method accessor params.
   Any subsequent parameters provided will be additional data for whatever api they are calling (eg. callbacks).
  */
  const methodAccessorParams = params.slice(0, 2);
  const apiMethodParams = params.slice(2);
  const apiFunction = getApiFunction(methodAccessorParams);

  return apiFunction(reduxStore, ...apiMethodParams);
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
    } else if (_.includes(method[0], 'webWidget')) {
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
    hide: () => hideApi(reduxStore),
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

function setupIPMApi(win, reduxStore, embeddableConfig = {}) {
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

function setupWidgetApi(win, reduxStore) {
  win.zE.identify = (user) => {
    identifyApi(reduxStore, user);

    if (!user || (!user.email || !user.name)) return;

    const prefillUser = {
      name: { value: user.name },
      email: { value: user.email }
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
  win.zE.show = () => { reduxStore.dispatch(legacyShowReceived()); };
  win.zE.setLocale = (locale) => setLocaleApi(null, locale);
}

export const webWidgetApi = {
  handleQueue,
  handlePostRenderQueue,
  setupWidgetQueue,
  setupWidgetApi,
  setupIPMApi
};
