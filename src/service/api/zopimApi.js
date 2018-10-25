import _ from 'lodash';
import { getSettingsChatTags } from 'src/redux/modules/settings/settings-selectors';
import {
  endChatApi,
  sendChatMsgApi,
  openApi,
  closeApi,
  toggleApi,
  updateSettingsApi,
  hideApi,
  showApi,
  displayApi,
  isChattingApi,
  prefill,
  updatePathApi,
  logoutApi
} from 'src/service/api/apis';

let zopimExistsOnPage = false;

function setZopimExistsOnPage(val) {
  zopimExistsOnPage = val;
}

function setupZopimQueue(win, queue) {
  let $zopim = () => {};

  zopimExistsOnPage = !!win.$zopim;

  // To enable $zopim api calls to work we need to define the queue callback.
  // When we inject the snippet we remove the queue method and just inject
  // the script tag.
  if (!zopimExistsOnPage) {
    $zopim = win.$zopim = (callback) => {
      $zopim._.push(callback);

      queue.push(callback);
    };

    $zopim.set = (callback) => {
      $zopim.set._.push(callback);
    };
    $zopim._ = [];
    $zopim.set._ = [];
  }
}

function setUpZopimApiMethods(win, store) {
  if (!zopimExistsOnPage) {
    win.$zopim = {
      livechat: {
        window: {
          toggle: () => toggleApi(store),
          hide: () => hideApi(store),
          show: () => openApi(store),
          getDisplay: () => displayApi(store)
        },
        button: {
          hide: () => hideApi(store),
          show: () => {
            showApi(store);
            closeApi(store);
          }
        },
        hideAll: () => hideApi(store),
        set: (newSettings) => updateSettingsApi(store, newSettings),
        isChatting: () => isChattingApi(store),
        say: (msg) => sendChatMsgApi(store, msg),
        endChat: () => endChatApi(store),
        removeTags: (...tagsToRemove) => {
          const oldTags = getSettingsChatTags(store.getState());
          const newTags = oldTags.filter((oldTag) => {
            return !_.includes(tagsToRemove, oldTag);
          });

          const newSettings = {
            webWidget: {
              chat: {
                tags: newTags
              }
            }
          };

          updateSettingsApi(store, newSettings);
        },
        addTags: (...tagsToAdd) => {
          const oldTags = getSettingsChatTags(store.getState());
          const newSettings = {
            webWidget: {
              chat: {
                tags: [...oldTags, ...tagsToAdd]
              }
            }
          };

          updateSettingsApi(store, newSettings);
        },
        setName: (newName) => prefill(store, { name: { value: newName } }),
        setEmail: (newEmail) => prefill(store, { email: { value: newEmail } }),
        setPhone: (newPhone) => prefill(store, { phone: { value: newPhone } }),
        sendVisitorPath: (page) => updatePathApi(store, page),
        clearAll: () => logoutApi(store)
      }
    };
  }
}

function handleZopimQueue(queue) {
  _.forEach(queue, (method) => {
    try {
      method();
    } catch (e) {
      const err = new Error('An error occurred in your use of the $zopim Widget API');

      err.special = true;
      throw err;
    }
  });
}

export const zopimApi = {
  setupZopimQueue,
  handleZopimQueue,
  setUpZopimApiMethods,
  setZopimExistsOnPage
};
