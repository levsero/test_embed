import {
  API_GET_IS_CHATTING_NAME,
  API_GET_DEPARTMENTS_ALL_NAME,
  API_GET_DEPARTMENTS_DEPARTMENT_NAME,
  API_GET_DISPLAY_NAME
} from 'constants/api';
import {
  setLocaleApi,
} from 'src/service/api/apis';
import { renderer } from 'service/renderer';
import {
  apiExecute,
  apiStructurePostRenderSetup,
  apiStructurePreRenderSetup,
} from './setupApi';
import {
  setupPublicApi,
  setupDevApi
} from './setupLegacyApi';
import _ from 'lodash';

const newAPIPostRenderQueue = [];

const getApiPostRenderQueue = () => {
  const postRenderCallback = (_, ...args) => apiAddToPostRenderQueue(['webWidget:get', ...args]);

  return {
    [API_GET_IS_CHATTING_NAME]: postRenderCallback,
    [API_GET_DEPARTMENTS_ALL_NAME]: postRenderCallback,
    [API_GET_DEPARTMENTS_DEPARTMENT_NAME]: postRenderCallback,
    [API_GET_DISPLAY_NAME]: postRenderCallback
  };
};

const apiAddToPostRenderQueue = (...args) => {
  newAPIPostRenderQueue.push(args);
};

export function apisExecutePostRenderQueue(win, postRenderQueue, reduxStore) {
  _.forEach(postRenderQueue, (method) => {
    win.zE[method[0]](...method[1]);
  });

  _.forEach(newAPIPostRenderQueue, (item) => {
    apiExecute(apiStructurePostRenderSetup(), reduxStore, ...item);
  });

  renderer.postRenderCallbacks();
}

export function setupLegacyApiQueue(win, postRenderQueue, reduxStore) {
  let devApi;

  const postRenderCallback = (...args) => {
    if (_.isFunction(args[0])) {
      args[0]();
    } else {
      return apiExecute(apiStructurePostRenderSetup(), reduxStore, args);
    }
  };
  // no "fat arrow" because it binds `this` to the scoped environment and does not allow it to be re-set with .bind()
  const postRenderQueueCallback = function (...args) {
    // "this" is bound to the method name
    postRenderQueue.push([this, args]);
  };
  const publicApi = setupPublicApi(postRenderQueueCallback, reduxStore);
  const pairs = _.toPairs(win.zEmbed);

  if (__DEV__) {
    devApi = setupDevApi(win, reduxStore);
  }
  if (win.zE === win.zEmbed) {
    win.zE = win.zEmbed = postRenderCallback;
  } else {
    win.zEmbed = postRenderCallback;
  }

  pairs.forEach(([key, value]) => {
    if (win.zE) win.zE[key] = value;
    if (win.zEmbed) win.zEmbed[key] = value;
  });

  return {
    publicApi,
    devApi
  };
}

export function apisExecuteQueue(reduxStore, queue) {
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
      setLocaleApi(method[0].locale);
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
        apiExecute(apiStructurePreRenderSetup(apiAddToPostRenderQueue, getApiPostRenderQueue), reduxStore, method);
      } catch (e) {
        logApiError(`"${method[0]} ${method[1]}"`, e);
      }
    } else {
      logApiError(method);
    }
  });
}
