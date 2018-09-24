import _ from 'lodash';

import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { renderer } from 'service/renderer';
import { handleIdentifyRecieved, logout, handleOnApiCalled } from 'src/redux/modules/base';
import { displayArticle, setContextualSuggestionsManually } from 'src/redux/modules/helpCenter';
import { updateSettings } from 'src/redux/modules/settings';
import { chatLogout } from 'src/redux/modules/chat';

const handleQueue = (queue) => {
  _.forEach(queue, (method) => {
    if (method[0].locale) {
      // Backwards compat with zE({locale: 'zh-CN'}) calls
      i18n.setLocale(method[0].locale);
    } else {
      try {
        method[0]();
      } catch (e) {
        const err = new Error([
          'An error occurred in your use of the Zendesk Widget API:',
          method[0],
          'Check out the Developer API docs to make sure you\'re using it correctly',
          'https://developer.zendesk.com/embeddables/docs/widget/api',
          e.stack
        ].join('\n\n'));

        err.special = true;
        throw err;
      }
    }
  });
};

const handlePostRenderQueue = (win, postRenderQueue) => {
  _.forEach(postRenderQueue, (method) => {
    win.zE[method[0]](...method[1]);
  });

  renderer.postRenderCallbacks();
};

const setupWidgetQueue = (win, postRenderQueue, reduxStore) => {
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
    on: postRenderQueueCallback.bind('on'),
    updateSettings: postRenderQueueCallback.bind('updateSettings'),
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
    win.zE = win.zEmbed = (callback) => {
      callback();
    };
  } else {
    win.zEmbed = (callback) => {
      callback();
    };
  }

  return {
    publicApi,
    devApi
  };
};

const setupZopimQueue = (win) => {
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
};

const setupIPMApi = (win, reduxStore, embeddableConfig = {}) => {
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
};

const setupWidgetApi = (win, reduxStore) => {
  win.zE.identify = (user) => {
    mediator.channel.broadcast('.onIdentify', user);

    reduxStore.dispatch(handleIdentifyRecieved(_.pick(user, ['name', 'email']), _.isString));
  };
  win.zE.logout = () => {
    reduxStore.dispatch(logout());
    mediator.channel.broadcast('.logout');
    reduxStore.dispatch(chatLogout());
  };
  win.zE.setHelpCenterSuggestions = (options) => {
    const onDone = () => mediator.channel.broadcast('.setHelpCenterSuggestions');

    reduxStore.dispatch(setContextualSuggestionsManually(options, onDone));
  };
  win.zE.activate = (options) => {
    mediator.channel.broadcast('.activate', options);
  };
  win.zE.activateIpm = () => {}; // no-op until rest of connect code is removed
  win.zE.hide = () => {
    mediator.channel.broadcast('.hide');
  };
  win.zE.show = () => {
    mediator.channel.broadcast('.show');
  };
  win.zE.setLocale = (locale) => {
    i18n.setLocale(locale, true);
    mediator.channel.broadcast('.onSetLocale', locale);
  };
  win.zE.updateSettings = (newSettings) => {
    reduxStore.dispatch(updateSettings(newSettings));
  };
  win.zE.on = (event, callback) => {
    if (_.isFunction(callback)) {
      reduxStore.dispatch(handleOnApiCalled(event, callback));
    }
  };
};

export const api = {
  handleQueue,
  handlePostRenderQueue,
  setupWidgetQueue,
  setupZopimQueue,
  setupWidgetApi,
};
