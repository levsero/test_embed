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
  logoutApi,
  onApiObj,
  getDepartmentApi,
  getAllDepartmentsApi
} from 'src/service/api/apis';
import {
  API_ON_CHAT_CONNECTED_NAME,
  API_ON_CHAT_START_NAME,
  API_ON_CHAT_END_NAME,
  API_ON_CHAT_STATUS_NAME,
  API_ON_CHAT_UNREAD_MESSAGES_NAME,
  API_ON_CLOSE_NAME,
  API_ON_OPEN_NAME
} from 'constants/api';

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
    const onApis = onApiObj();

    win.$zopim = {
      livechat: {
        window: {
          toggle: () => toggleApi(store),
          hide: () => hideApi(store),
          show: () => openApi(store),
          getDisplay: () => displayApi(store),
          onHide: (callback) => onApis[API_ON_CLOSE_NAME](store, callback),
          onShow: (callback) => onApis[API_ON_OPEN_NAME](store, callback),
          setTitle: (title) => {
            const newSettings = {
              webWidget: {
                chat: {
                  title: {
                    '*': title
                  }
                }
              }
            };

            updateSettingsApi(store, newSettings);
          }
        },
        prechatForm: {
          setGreetings: (msg) => {
            const newSettings = {
              webWidget: {
                chat: {
                  prechatForm: {
                    greeting: {
                      '*': msg
                    }
                  }
                }
              }
            };

            updateSettingsApi(store, newSettings);
          }
        },
        offlineForm: {
          setGreetings: (msg) => {
            const newSettings = {
              webWidget: {
                chat: {
                  offlineForm: {
                    greeting: {
                      '*': msg
                    }
                  }
                }
              }
            };

            updateSettingsApi(store, newSettings);
          }
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
        clearAll: () => logoutApi(store),
        setOnConnected: (callback) => onApis.chat[API_ON_CHAT_CONNECTED_NAME](store, callback),
        setOnChatStart: (callback) => onApis.chat[API_ON_CHAT_START_NAME](store, callback),
        setOnChatEnd: (callback) => onApis.chat[API_ON_CHAT_END_NAME](store, callback),
        setOnStatus: (callback) => onApis.chat[API_ON_CHAT_STATUS_NAME](store, callback),
        setOnUnreadMsgs: (callback) => onApis.chat[API_ON_CHAT_UNREAD_MESSAGES_NAME](store, callback),
        departments: {
          setLabel: (label) => {
            const newSettings = {
              webWidget: {
                chat: {
                  prechatForm: {
                    departmentLabel: {
                      '*': label
                    }
                  }
                }
              }
            };

            updateSettingsApi(store, newSettings);
          },
          getDepartment: (id) => getDepartmentApi(store, id),
          getAllDepartments: () => getAllDepartmentsApi(store),
          filter: (...filteredDepartments) => {
            const newSettings = {
              webWidget: {
                chat: {
                  departments: {
                    enabled: [...filteredDepartments]
                  }
                }
              }
            };

            updateSettingsApi(store, newSettings);
          },
          setVisitorDepartment: (nameOrId) => {
            const newSettings = {
              webWidget: {
                chat: {
                  departments: {
                    select: nameOrId
                  }
                }
              }
            };

            updateSettingsApi(store, newSettings);
          },
          clearVisitorDepartment: () => {
            const newSettings = {
              webWidget: {
                chat: {
                  departments: {
                    select: ''
                  }
                }
              }
            };

            updateSettingsApi(store, newSettings);
          }
        },
        concierge: {
          setAvatar: (path) => {
            const newSettings = {
              webWidget: {
                chat: {
                  concierge: {
                    avatarPath: path
                  }
                }
              }
            };

            updateSettingsApi(store, newSettings);
          },
          setName: (name) => {
            const newSettings = {
              webWidget: {
                chat: {
                  concierge: {
                    name
                  }
                }
              }
            };

            updateSettingsApi(store, newSettings);
          },
          setTitle: (title) => {
            const newSettings = {
              webWidget: {
                chat: {
                  concierge: {
                    title: {
                      '*': title
                    }
                  }
                }
              }
            };

            updateSettingsApi(store, newSettings);
          }
        },
        theme: {
          setProfileCardConfig: (settings) => {
            const newSettings = {
              webWidget: {
                chat: {
                  profileCard: {}
                }
              }
            };
            const { profileCard } = newSettings.webWidget.chat;

            if (_.isBoolean(settings.avatar)) {
              profileCard.avatar = settings.avatar;
            }
            if (_.isBoolean(settings.title)) {
              profileCard.title = settings.title;
            }
            if (_.isBoolean(settings.rating)) {
              profileCard.rating = settings.rating;
            }

            updateSettingsApi(store, newSettings);
          }
        }
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
