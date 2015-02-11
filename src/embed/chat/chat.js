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

function show(name) {
  var config = get(name).config,
      position = (config.position === 'right') ? 'br' : 'bl';

  win.$zopim(function() {
    var zopimWin = win.$zopim.livechat.window;

    zopimWin.setPosition(position);
    zopimWin.setTitle(config.title);
    zopimWin.setSize(config.size);
    zopimWin.setOffsetVertical(config.offsetVertical);
    zopimWin.show();
  });

  store.set('zopimOpen', true);

  // Need to wait for mediator to be initialized so it
  // can pick up the call
  setTimeout(function() {
    mediator.channel.broadcast(`${name}.onShow`);
  }, 100);

  if (styleTag.parentNode) {
    styleTag.parentNode.removeChild(styleTag);
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
      css = `
        .zopim[__jx__id] {
          display: none !important;
        }
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

  if (store.get('zopimOpen') === true) {
    show(name);
  }

  if (!config.standalone) {
    if (store.get('zopimOpen') === false) {
      host.appendChild(styleTag);
    }
    styleTag.innerHTML = css;
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
    [name + '.show',
     name + '.showWithAnimation'].join(', '),
    function() {
      show(name);
    }
  );

  mediator.channel.subscribe(name + '.hide', function() {
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
      broadcastStatus = function() {
        if (chat.online && chat.connected) {
          mediator.channel.broadcast(`${name}.onOnline`);
        } else {
          mediator.channel.broadcast(`${name}.onOffline`);
        }
      },
      onStatus = function(status) {
        chat.online = (status === 'online');
        broadcastStatus();
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
        store.set('zopimOpen', false);

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

    if (store.get('zopimOpen') === false) {
      zopimLive.hideAll();
    }

    zopimWin.onHide(onHide);
    zopimLive.setLanguage(i18n.getLocale());
    zopimLive.setOnConnected(onConnect);
    zopimLive.setOnStatus(onStatus);
    zopimLive.setOnUnreadMsgs(onUnreadMsgs);
    zopimLive.setOnChatEnd(onChatEnd);
    zopimLive.theme.setColor(config.color);
    zopimLive.theme.setTheme('zendesk');
  });
}

export var chat = {
  create: create,
  list: list,
  get: get,
  render: render
};
