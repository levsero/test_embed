import _ from 'lodash';
import { i18n } from 'service/i18n';
import { settings } from 'service/settings';
import { mediator } from 'service/mediator';
import { getThemeColor } from 'utility/color/validate';
import {
  document, win,
  getDocumentHost
} from 'utility/globals';
import { cappedTimeoutCall } from 'utility/utils';
import {
  updateZopimChatStatus,
  zopimHide,
  zopimConnectionUpdate,
  zopimShow,
  zopimOnClose,
  zopimIsChatting,
  zopimEndChat,
  zopimOpen,
  zopimClose,
  zopimUpdateUnreadMessages
} from 'src/redux/modules/zopimChat';
import { updateActiveEmbed } from 'src/redux/modules/base';
import { closeApi, openApi } from 'src/service/api/apis';
import {
  getStylingOffsetVertical,
  getStylingOffsetHorizontal,
  getStylingPositionVertical
} from 'src/redux/modules/settings/settings-selectors';
import { getHorizontalPosition } from 'src/redux/modules/selectors';
import { zopimExistsOnPage, trackZopimApis } from 'service/api/zopimApi/helpers';
import tracker from 'service/logging/tracker';

let chats = {};
let zopimApiOverwritten = false;
const styleTag = document.createElement('style');

function create(name, config, store) {
  const configDefaults = {
    color: '#78A300',
    standalone: false,
    size: 'large',
    endpoint: 'v2.zopim.com'
  };

  if (getThemeColor()) {
    config.color = getThemeColor();
  }

  chats[name] = {
    config: _.extend(configDefaults, config),
    store
  };
}

function list() {
  return chats;
}

function get(name) {
  return chats[name];
}

function show(name, showWindow = false) {
  win.$zopim(() => {
    const chat = get(name);
    const store = chat.store;

    tracker.suspend(() => {
      if (chat.config.standalone) {
        if (showWindow) {
          win.$zopim.livechat.window.show();
        } else {
          win.$zopim.livechat.button.show();
        }
      } else {
        win.$zopim.livechat.window.show();
        store.dispatch(zopimOpen());
      }

      // TODO remove when zopim has release mobile notifications
      if (win.$zopim.livechat.mobileNotifications) {
        win.$zopim.livechat.mobileNotifications.setDisabled(false);
      }
    });
  });
}

function hide(name) {
  win.$zopim(() => {
    const chat = get(name);
    const store = chat.store;

    tracker.suspend(() => {
      win.$zopim.livechat.hideAll();
      store.dispatch(zopimClose());

      // TODO remove when zopim has release mobile notifications
      if (win.$zopim.livechat.mobileNotifications) {
        win.$zopim.livechat.mobileNotifications.setDisabled(true);
      }
    });
  });
}

function toggle(name) {
  win.$zopim(() => {
    const store = get(name).store;

    tracker.suspend(() => {
      if (win.$zopim.livechat.window.getDisplay()) {
        closeApi(store);
      } else {
        openApi(store);
      }
    });
  });
}

function setUser(user) {
  if (!zopimExistsOnPage(win)) return;

  win.$zopim(() => {
    tracker.suspend(() => {
      if (_.isString(user.name)) {
        win.$zopim.livechat.setName(user.name);
      }

      if (_.isString(user.email)) {
        win.$zopim.livechat.setEmail(user.email);
      }
    });
  });
}

// to be able to instrument zopim apis,
// we need to insert the instrumentation before the queue
// is executed. To do this, we insert the instrumentation
// at the start of the zopim queue, which we know is in
// $zopim._
function insertInstrumentation() {
  if (win.$zopim && win.$zopim._setByWW) {
    win.$zopim._.unshift(() => {
      trackZopimApis(win);
    });
  }
}

function render(name) {
  const config = get(name).config;
  const zopimId = config.zopimId;
  const zopimEndpoint = config.endpoint;
  const snippet = `
    (function(d,s){var z=$zopim,$=z.s= d.createElement(s),e=d.getElementsByTagName(s)[0];
    $.async=!0;$.setAttribute('charset','utf-8');
    $.src='https://${zopimEndpoint}/?${zopimId}';
    z.t=+new Date;$. type='text/javascript';e.parentNode.insertBefore($,e)})(document,'script');
  `;
  const scriptTag = document.createElement('script');
  const host = getDocumentHost();

  insertInstrumentation();
  host.appendChild(scriptTag);
  scriptTag.innerHTML = snippet;

  if (config.brand) {
    const brandCount = config.brandCount;

    // if brandCount is more than 1, call addTag,
    // if brandCount is not sent down from config, it means we're using old config and we should call addTag
    // otherwise, skip addTag
    if (brandCount > 1 || brandCount === undefined) {
      win.$zopim(() => {
        tracker.suspend(() => {
          win.$zopim.livechat.addTags([config.brand]);
        });
      });
    }
  }

  if (!config.standalone) {
    win.$zopim(() => {
      tracker.suspend(() => {
        if (!win.$zopim.livechat.window.getDisplay()) {
          host.appendChild(styleTag);
        }
      });
    });
    init(name);
  }

  mediator.channel.subscribe(`${name}.show`, () => show(name));
  mediator.channel.subscribe(`${name}.hide`, () => hide(name));
  mediator.channel.subscribe(`${name}.activate`, () => show(name, true));
  mediator.channel.subscribe(`${name}.toggle`, () => toggle(name));

  mediator.channel.subscribe(`${name}.refreshLocale`, () => {
    win.$zopim && win.$zopim(() => {
      tracker.suspend(() => {
        win.$zopim.livechat.setLanguage(i18n.getLocale());
      });
    });
  });
}

function init(name) {
  const chat = get(name);
  const store = chat.store;
  const config = chat.config;

  const onStatus = (status) => {
    if (status === 'online' || status === 'away') {
      mediator.channel.broadcast(`${name}.onOnline`);
    } else {
      mediator.channel.broadcast(`${name}.onOffline`);
    }

    store.dispatch(updateZopimChatStatus(status));
  };
  const onUnreadMsgs = (unreadMessageCount) => {
    mediator.channel.broadcast(`${name}.onUnreadMsgs`, unreadMessageCount);
    store.dispatch(zopimUpdateUnreadMessages(unreadMessageCount));
  };
  const onChatStart = () => {
    mediator.channel.broadcast(`${name}.onChatStart`);
    store.dispatch(zopimIsChatting());
  };
  const onChatEnd = () => {
    mediator.channel.broadcast(`${name}.onChatEnd`);
    store.dispatch(zopimEndChat());
  };
  const onHide = () => {
    mediator.channel.broadcast(`${name}.onHide`);
    store.dispatch(zopimOnClose());
    win.$zopim(() => {
      tracker.suspend(() => {
        win.$zopim.livechat.hideAll();
      });
    });
  };
  const onConnected = () => {
    mediator.channel.broadcast(`${name}.onConnected`);
    store.dispatch(zopimConnectionUpdate());
    overwriteZopimApi(store);
  };

  win.$zopim.onError = () => mediator.channel.broadcast(`${name}.onError`);

  win.$zopim(() => {
    tracker.suspend(() => {
      const zopimLive = win.$zopim.livechat;
      const zopimWin = zopimLive.window;

      zopimLive.hideAll();

      cappedTimeoutCall(() => {
        if (zopimLive.isChatting()) {
          store.dispatch(zopimIsChatting());
        }

        if (zopimWin.getDisplay() || zopimLive.isChatting()) {
          mediator.channel.broadcast(`${name}.onIsChatting`, zopimWin.getDisplay());

          store.dispatch(updateActiveEmbed('zopimChat'));

          return true;
        }
      }, 1000, 10);

      zopimWin.onHide(onHide);
      zopimLive.setLanguage(i18n.getLocale());
      zopimLive.setOnConnected(onConnected);
      zopimLive.setOnStatus(onStatus);
      zopimLive.setOnUnreadMsgs(onUnreadMsgs);
      zopimLive.setOnChatStart(onChatStart);
      zopimLive.setOnChatEnd(onChatEnd);

      // TODO remove when zopim has release mobile notifications
      if (win.$zopim.livechat.mobileNotifications) {
        zopimLive.mobileNotifications.setIgnoreChatButtonVisibility(true);
      }

      const getZopimPosition = (vertical = 'bottom', horizontal = 'right') => {
        const vert = vertical === 'top' ? 't' : 'b';
        const hor = horizontal === 'left' ? 'l' : 'r';

        return vert + hor;
      };
      const state = store.getState();
      const position = getZopimPosition(
        getStylingPositionVertical(state),
        getHorizontalPosition(state)
      );

      // configure zopim window
      zopimLive.theme.setColor(config.color && config.color.base);
      zopimLive.theme.setTheme('zendesk');
      zopimWin.setPosition(position);
      zopimWin.setSize(config.size);
      zopimWin.setOffsetVertical(getStylingOffsetVertical(state));
      zopimWin.setOffsetHorizontal(getStylingOffsetHorizontal(state) + settings.get('margin'));
    });
  });
}

function overwriteZopimApi(store) {
  let originalZopimShow,
    originalZopimHide;

  if (!zopimApiOverwritten) {
    originalZopimShow = win.$zopim.livechat.window.show;
    originalZopimHide = win.$zopim.livechat.window.hide;

    zopimApiOverwritten = true;

    win.$zopim.livechat.window.show = () => {
      store.dispatch(zopimShow());
      originalZopimShow();
    };

    win.$zopim.livechat.window.hide = () => {
      store.dispatch(zopimHide());
      originalZopimHide();
    };
  }
}

export const chat = {
  create,
  list,
  get,
  render,
  setUser,
  overwriteZopimApi // for testing purposes
};
