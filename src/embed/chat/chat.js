import _ from 'lodash';
import { i18n } from 'service/i18n';
import { settings } from 'service/settings';
import { mediator } from 'service/mediator';
import { getThemeColor } from 'utility/color/validate';
import { document, win,
  getDocumentHost } from 'utility/globals';
import { cappedTimeoutCall } from 'utility/utils';
import {
  updateZopimChatStatus,
  zopimHide,
  zopimConnectionUpdate,
  zopimShow,
  zopimOnClose,
  zopimIsChatting,
  zopimEndChat } from 'src/redux/modules/zopimChat';
import { updateSettingsChatSuppress, resetSettingsChatSuppress } from 'src/redux/modules/settings';
import { updateActiveEmbed } from 'src/redux/modules/base';

let chats = {};
const styleTag = document.createElement('style');

function create(name, config, store) {
  const configDefaults = {
    position: 'right',
    color: '#78A300',
    standalone: false,
    offsetVertical: parseInt(settings.get('offset').vertical), // Zopim api can accept numbers, this trims off the 'px' value
    offsetHorizontal: parseInt(settings.get('offset').horizontal) + settings.get('margin'),
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
    if (get(name).config.standalone) {
      if (showWindow) {
        win.$zopim.livechat.window.show();
      } else {
        win.$zopim.livechat.button.show();
      }
    } else {
      win.$zopim.livechat.window.show();
    }

    // TODO remove when zopim has release mobile notifications
    if (win.$zopim.livechat.mobileNotifications) {
      win.$zopim.livechat.mobileNotifications.setDisabled(false);
    }
  });
}

function hide() {
  win.$zopim(() => {
    win.$zopim.livechat.hideAll();

    // TODO remove when zopim has release mobile notifications
    if (win.$zopim.livechat.mobileNotifications) {
      win.$zopim.livechat.mobileNotifications.setDisabled(true);
    }
  });
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

  host.appendChild(scriptTag);
  scriptTag.innerHTML = snippet;

  if (config.brand) {
    const brandCount = config.brandCount;

    // if brandCount is more than 1, call addTag,
    // if brandCount is not sent down from config, it means we're using old config and we should call addTag
    // otherwise, skip addTag
    if (brandCount > 1 || brandCount === undefined) {
      win.$zopim(() => win.$zopim.livechat.addTags(config.brand));
    }
  }

  if (!config.standalone) {
    win.$zopim(() => {
      if (!win.$zopim.livechat.window.getDisplay()) {
        host.appendChild(styleTag);
      }
    });
    init(name);
  }

  mediator.channel.subscribe(`${name}.show`, () => show(name));
  mediator.channel.subscribe(`${name}.hide`, () => hide());
  mediator.channel.subscribe(`${name}.activate`, () => show(name, true));

  mediator.channel.subscribe(`${name}.refreshLocale`, () => {
    win.$zopim && win.$zopim(() => {
      win.$zopim.livechat.setLanguage(i18n.getLocale());
    });
  });

  mediator.channel.subscribe(`${name}.setUser`, (user) => {
    win.$zopim && win.$zopim(() => {
      if (_.isString(user.name)) {
        win.$zopim.livechat.setName(user.name);
      }

      if (_.isString(user.email)) {
        win.$zopim.livechat.setEmail(user.email);
      }
    });
  });
}

function init(name) {
  let originalZopimShow, originalZopimHide;
  let zopimApiOverwritten = false;
  const chat = get(name);
  const store = chat.store;
  const config = chat.config;
  const overwriteZopimApi = () => {
    if (!zopimApiOverwritten) {
      originalZopimShow = win.$zopim.livechat.window.show;
      originalZopimHide = win.$zopim.livechat.window.hide;
      zopimApiOverwritten = true;

      win.$zopim.livechat.window.show = () => {
        get(name).store.dispatch(zopimShow());
        originalZopimShow();
      };

      win.$zopim.livechat.window.hide = () => {
        get(name).store.dispatch(zopimHide());
        originalZopimHide();
      };
    }
  };

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
  };
  const onChatStart = () => {
    mediator.channel.broadcast(`${name}.onChatStart`);
    store.dispatch(updateSettingsChatSuppress(false));
  };
  const onChatEnd = () => {
    mediator.channel.broadcast(`${name}.onChatEnd`);
    store.dispatch(resetSettingsChatSuppress());
    store.dispatch(zopimEndChat());
  };
  const onHide = () => {
    mediator.channel.broadcast(`${name}.onHide`);
    store.dispatch(zopimOnClose());
    win.$zopim(() => win.$zopim.livechat.hideAll());
  };
  const onConnected = () => {
    mediator.channel.broadcast(`${name}.onConnected`);
    store.dispatch(zopimConnectionUpdate());
    overwriteZopimApi();
  };

  win.$zopim.onError = () => mediator.channel.broadcast(`${name}.onError`);

  win.$zopim(() => {
    const zopimLive = win.$zopim.livechat;
    const zopimWin = zopimLive.window;

    cappedTimeoutCall(() => {
      if (zopimWin.getDisplay() || zopimLive.isChatting()) {
        mediator.channel.broadcast(`${name}.onIsChatting`);

        store.dispatch(zopimIsChatting(zopimWin.getDisplay()));
        store.dispatch(updateActiveEmbed('zopimChat'));
        store.dispatch(updateSettingsChatSuppress(false));

        return true;
      }
    }, 1000, 10);

    zopimLive.hideAll();

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
    const position = getZopimPosition(
      settings.get('position.vertical'),
      settings.get('position.horizontal') || config.position
    );

    // configure zopim window
    zopimLive.theme.setColor(config.color && config.color.base);
    zopimLive.theme.setTheme('zendesk');
    zopimWin.setPosition(position);
    zopimWin.setSize(config.size);
    zopimWin.setOffsetVertical(config.offsetVertical);
    zopimWin.setOffsetHorizontal(config.offsetHorizontal);
  });
}

export const chat = {
  create: create,
  list: list,
  get: get,
  render: render
};
