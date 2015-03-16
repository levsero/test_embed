import { document, win,
         getDocumentHost } from 'utility/globals';
import { i18n }            from 'service/i18n';
import { mediator }        from 'service/mediator';
import { store }           from 'service/persistence';

require('imports?_=lodash!lodash');

var chats = {},
    styleTag = document.createElement('style');

function create(name, config) {
  var configDefaults = {
    position: 'right',
    title: i18n.t('embeddable_framework.chat.title'),
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

function show() {
  win.$zopim(function() {
    win.$zopim.livechat.window.show();
  });

  store.set('zopimOpen', true, 'session');
}

function postRender(name) {
  if (store.get('zopimOpen', 'session')) {
    mediator.channel.broadcast(`${name}.onShow`);
  }
}

function hide() {
  win.$zopim(function() {
    win.$zopim.livechat.hideAll();
  });
}

function render(name) {
  /* jshint maxlen: false, unused:false, quotmark:false */
  var config = get(name).config,
      zopimId = config.zopimId,
      snippet = `
        (function(d,s){var z=$zopim,$=z.s= d.createElement(s),e=d.getElementsByTagName(s)[0];
        $.async=!0;$.setAttribute('charset','utf-8');
        $.src='//v2.zopim.com/?${zopimId}';
        z.t=+new Date;$. type='text/javascript';e.parentNode.insertBefore($,e)})(document,'script');
      `,
      scriptTag = document.createElement('script'),
      host = getDocumentHost();

  host.appendChild(scriptTag);
  scriptTag.innerHTML = snippet;

  if (config.brand) {
    win.$zopim(function() {
      win.$zopim.livechat.addTags(config.brand);
    });
  }

  if (store.get('zopimOpen', 'session')) {
    show(name);
  }

  if (!config.standalone) {
    if (!store.get('zopimOpen', 'session')) {
      host.appendChild(styleTag);
    }
    init(name);
  }

  // Hack to override previous zopim hideAll state
  if (config.standalone && store.get('zopimHideAll') !== false) {
    store.set('zopimHideAll', false);
    win.$zopim(function() {
      setTimeout(function() {
        win.$zopim.livechat.button.show();
      }, 1500);
    });
  }

  mediator.channel.subscribe(
    [`${name}.show`,
     `${name}.showWithAnimation`].join(', '),
    function() {
      show(name);
    }
  );

  mediator.channel.subscribe(`${name}.hide`, function() {
    hide();
  });

  mediator.channel.subscribe('.identify', function(user) {
    win.$zopim && win.$zopim(function() {
      win.$zopim.livechat.setName(user.name);
      win.$zopim.livechat.setEmail(user.email);
    });
  });
}

function init(name) {
  var zopim = win.$zopim,
      chat = get(name),
      config = chat.config,
      position = (config.position === 'right') ? 'br' : 'bl',
      zopimShow,
      zopimHide,
      zopimEventsDelay = 3000,
      zopimApiOverwritten = false,
      overwriteZopimApi = function() {
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
      },
      broadcastStatus = function() {
        setTimeout(() => {
          if (chat.online && chat.connected) {
            mediator.channel.broadcast(`${name}.onOnline`);
          } else {
            mediator.channel.broadcast(`${name}.onOffline`);
          }
        }, zopimEventsDelay);
      },
      onStatus = function(status) {
        chat.online = (status === 'online');
        broadcastStatus();

        overwriteZopimApi();
      },
      onConnect = function() {
        chat.connected = true;
        broadcastStatus();
      },
      onUnreadMsgs = function(unreadMessageCount) {
        if (unreadMessageCount > 0) {
          mediator.channel.broadcast(`${name}.onUnreadMsgs`, unreadMessageCount);
        }
      },
      onChatEnd = function() {
        mediator.channel.broadcast(`${name}.onChatEnd`);
      },
      onHide = function() {
        mediator.channel.broadcast(`${name}.onHide`);
        store.set('zopimOpen', false, 'session');

        win.$zopim(function() {
          win.$zopim.livechat.hideAll();
        });
      };

  chat.online = false;
  chat.connected = false;

  zopim(function() {
    var zopimLive = win.$zopim.livechat,
        zopimWin = zopimLive.window;

    store.set('zopimHideAll', true);

    if (!store.get('zopimOpen', 'session')) {
      zopimLive.hideAll();
    }

    zopimWin.onHide(onHide);
    zopimLive.setLanguage(i18n.getLocale());
    zopimLive.setOnConnected(onConnect);
    zopimLive.setOnStatus(onStatus);
    zopimLive.setOnUnreadMsgs(onUnreadMsgs);
    zopimLive.setOnChatEnd(onChatEnd);

    //configure zopim window
    zopimLive.theme.setColor(config.color);
    zopimLive.theme.setTheme('zendesk');
    zopimWin.setPosition(position);
    zopimWin.setTitle(config.title);
    zopimWin.setSize(config.size);
    zopimWin.setOffsetVertical(config.offsetVertical);
  });

  setTimeout(() => {
    zopimEventsDelay = 0;
  }, 5000);
}

export var chat = {
  create: create,
  list: list,
  get: get,
  render: render,
  postRender: postRender
};
