import _ from 'lodash';
import { i18n } from 'service/i18n';
import { settings } from 'service/settings';
import { mediator } from 'service/mediator';
import { validSettingsColor } from 'utility/color';
import { document, win,
         getDocumentHost } from 'utility/globals';
import { cappedIntervalCall } from 'utility/utils';

let chats = {};
const styleTag = document.createElement('style');

function create(name, config) {
  const configDefaults = {
    position: 'right',
    color: '#78A300',
    standalone: false,
    offsetVertical: parseInt(settings.get('offset').vertical), // Zopim api can accept numbers, this trims off the 'px' value
    offsetHorizontal: parseInt(settings.get('offset').horizontal) + settings.get('margin'),
    size: 'large'
  };

  if (validSettingsColor()) {
    config.color = validSettingsColor();
  }

  chats[name] = {
    config: _.extend(configDefaults, config)
  };
}

function list() {
  return chats;
}

function get(name) {
  return chats[name];
}

function show(name) {
  const zopim = win.$zopim;

  zopim(() => {
    if (get(name).config.standalone) {
      if (zopim.livechat.window.getDisplay()) {
        zopim.livechat.window.show();
      } else {
        zopim.livechat.button.show();
      }
    } else {
      zopim.livechat.window.show();
    }

    // TODO remove when zopim has release mobile notifications
    if (zopim.livechat.mobileNotifications) {
      zopim.livechat.mobileNotifications.setDisabled(false);
    }
  });
}

function hide() {
  const zopim = win.$zopim;

  zopim(() => {
    zopim.livechat.hideAll();

    // TODO remove when zopim has release mobile notifications
    if (zopim.livechat.mobileNotifications) {
      zopim.livechat.mobileNotifications.setDisabled(true);
    }
  });
}

function render(name) {
  const config = get(name).config;
  const zopimId = config.zopimId;
  const snippet = `
    (function(d,s){var z=$zopim,$=z.s= d.createElement(s),e=d.getElementsByTagName(s)[0];
    $.async=!0;$.setAttribute('charset','utf-8');
    $.src='https://v2.zopim.com/?${zopimId}';
    z.t=+new Date;$. type='text/javascript';e.parentNode.insertBefore($,e)})(document,'script');
  `;
  const scriptTag = document.createElement('script');
  const host = getDocumentHost();

  host.appendChild(scriptTag);
  scriptTag.innerHTML = snippet;

  if (config.brand) {
    win.$zopim(() => win.$zopim.livechat.addTags(config.brand));
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
  mediator.channel.subscribe(`${name}.activate`, () => show(name));

  mediator.channel.subscribe(`${name}.setLocale`, () => {
    win.$zopim && win.$zopim(() => {
      win.$zopim.livechat.setLanguage(i18n.getLocale());
    });
  });

  mediator.channel.subscribe(`${name}.setUser`, (user) => {
    win.$zopim && win.$zopim(() => {
      win.$zopim.livechat.setName(user.name);
      win.$zopim.livechat.setEmail(user.email);
    });
  });
}

function init(name) {
  let zopimShow, zopimHide;
  let zopimApiOverwritten = false;
  const zopim = win.$zopim;
  const chat = get(name);
  const config = chat.config;
  const overwriteZopimApi = () => {
    if (!zopimApiOverwritten) {
      zopimShow = win.$zopim.livechat.window.show;
      zopimHide = win.$zopim.livechat.window.hide;
      zopimApiOverwritten = true;

      win.$zopim.livechat.window.show = () => {
        mediator.channel.broadcast('.zopimShow');
        zopimShow();
      };

      win.$zopim.livechat.window.hide = () => {
        mediator.channel.broadcast('.zopimHide');
        zopimHide();
      };
    }
  };

  const broadcastStatus = () => {
    if (chat.online && chat.connected) {
      mediator.channel.broadcast(`${name}.onOnline`);
    } else {
      mediator.channel.broadcast(`${name}.onOffline`);
    }
  };
  const onStatus = (status) => {
    chat.online = (status !== 'offline');
    broadcastStatus();

    overwriteZopimApi();
  };
  const onConnect = () => {
    chat.connected = true;
    broadcastStatus();
  };
  const onUnreadMsgs = (unreadMessageCount) => {
    mediator.channel.broadcast(`${name}.onUnreadMsgs`, unreadMessageCount);
  };
  const onChatEnd = () => {
    mediator.channel.broadcast(`${name}.onChatEnd`);
  };
  const onHide = () => {
    mediator.channel.broadcast(`${name}.onHide`);
    win.$zopim(() => win.$zopim.livechat.hideAll());
  };

  chat.online = false;
  chat.connected = false;

  zopim.onError = () => mediator.channel.broadcast(`${name}.onError`);

  zopim(() => {
    const zopimLive = win.$zopim.livechat;
    const zopimWin = zopimLive.window;

    cappedIntervalCall(() => {
      if (zopimWin.getDisplay() || zopimLive.isChatting()) {
        mediator.channel.broadcast(`${name}.onIsChatting`);
        return true;
      }
    }, 1000, 10);

    zopimLive.hideAll();

    zopimWin.onHide(onHide);
    zopimLive.setLanguage(i18n.getLocale());
    zopimLive.setOnConnected(onConnect);
    zopimLive.setOnStatus(onStatus);
    zopimLive.setOnUnreadMsgs(onUnreadMsgs);
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
    zopimLive.theme.setColor(config.color);
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
