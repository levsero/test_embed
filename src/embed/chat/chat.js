import _ from 'lodash';
import { i18n } from 'service/i18n';
import { store } from 'service/persistence';
import { mediator } from 'service/mediator';
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
    offsetVertical: 0,
    size: 'large'
  };

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

function showButton() {
  win.$zopim(function() {
    win.$zopim.livechat.button.show();
  });
}

function show() {
  win.$zopim(function() {
    win.$zopim.livechat.window.show();

    // TODO remove when zopim has release mobile notifications
    if (win.$zopim.livechat.mobileNotifications) {
      win.$zopim.livechat.mobileNotifications.setDisabled(false);
    }
  });
}

function hide() {
  win.$zopim(function() {
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
  const snippet = `
    (function(d,s){var z=$zopim,$=z.s= d.createElement(s),e=d.getElementsByTagName(s)[0];
    $.async=!0;$.setAttribute('charset','utf-8');
    $.src='//v2.zopim.com/?${zopimId}';
    z.t=+new Date;$. type='text/javascript';e.parentNode.insertBefore($,e)})(document,'script');
  `;
  const scriptTag = document.createElement('script');
  const host = getDocumentHost();

  host.appendChild(scriptTag);
  scriptTag.innerHTML = snippet;

  if (config.brand) {
    win.$zopim(function() {
      win.$zopim.livechat.addTags(config.brand);
    });
  }

  if (!config.standalone) {
    win.$zopim(function() {
      if (!win.$zopim.livechat.window.getDisplay()) {
        host.appendChild(styleTag);
      }
    });
    init(name);
  }

  // Hack to override previous zopim hideAll state
  if (config.standalone && store.get('zopimHideAll') === true) {
    store.set('zopimHideAll', false);
    win.$zopim(function() {
      setTimeout(function() {
        win.$zopim.livechat.button.show();
      }, 1500);
    });
  }

  mediator.channel.subscribe(`${name}.show`, function(params) {
    if (params && params.showButtonOnly) {
      showButton();
    } else {
      show();
    }
  });

  mediator.channel.subscribe(`${name}.hide`, function() {
    hide();
  });

  mediator.channel.subscribe(`${name}.setUser`, function(user) {
    win.$zopim && win.$zopim(function() {
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
  const position = (config.position === 'right') ? 'br' : 'bl';
  const overwriteZopimApi = function() {
    if (!zopimApiOverwritten) {
      zopimShow = win.$zopim.livechat.window.show;
      zopimHide = win.$zopim.livechat.window.hide;
      zopimApiOverwritten = true;

      win.$zopim.livechat.window.show = function() {
        mediator.channel.broadcast('.zopimShow');
        zopimShow();
      };

      win.$zopim.livechat.window.hide = function() {
        mediator.channel.broadcast('.zopimHide');
        zopimHide();
        win.$zopim(function() {
          win.$zopim.livechat.hideAll();
        });
      };
    }
  };

  const broadcastStatus = function() {
    if (chat.online && chat.connected) {
      mediator.channel.broadcast(`${name}.onOnline`);
    } else {
      mediator.channel.broadcast(`${name}.onOffline`);
    }
  };
  const onStatus = function(status) {
    chat.online = (status !== 'offline');
    broadcastStatus();

    overwriteZopimApi();
  };
  const onConnect = function() {
    chat.connected = true;
    broadcastStatus();
  };
  const onUnreadMsgs = function(unreadMessageCount) {
    mediator.channel.broadcast(`${name}.onUnreadMsgs`, unreadMessageCount);
  };
  const onChatEnd = function() {
    mediator.channel.broadcast(`${name}.onChatEnd`);
  };
  const onHide = function() {
    mediator.channel.broadcast(`${name}.onHide`);

    win.$zopim(function() {
      win.$zopim.livechat.hideAll();
    });
  };

  chat.online = false;
  chat.connected = false;

  zopim(function() {
    const zopimLive = win.$zopim.livechat;
    const zopimWin = zopimLive.window;

    store.set('zopimHideAll', true);

    cappedIntervalCall(function() {
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

    // configure zopim window
    zopimLive.theme.setColor(config.color);
    zopimLive.theme.setTheme('zendesk');
    zopimWin.setPosition(position);
    zopimWin.setSize(config.size);
    zopimWin.setOffsetVertical(config.offsetVertical);
  });
}

export const chat = {
  create: create,
  list: list,
  get: get,
  render: render
};
