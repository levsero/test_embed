import { document, win }   from 'utility/globals';
import { i18n }            from 'service/i18n';
import { mediator }        from 'service/mediator';

require('imports?_=lodash!lodash');

var chats = {},
    styleTag = document.createElement('style');

function create(name, config) {
  var configDefaults = {
    position: 'br',
    title: i18n.t('embeddable_framework.chat.title'),
    color: '#78A300',
    standalone: false,
    offsetVertical: 70
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
      zopim = win.$zopim;

  zopim(function() {
    var zopimWin = zopim.livechat.window;

    zopimWin.setPosition(config.position);
    zopimWin.setTitle(config.title);
    zopimWin.setOffsetVertical(config.offsetVertical);
    zopimWin.show();
  });

  if (styleTag.parentNode) {
    styleTag.parentNode.removeChild(styleTag);
  }
}

function hide() {
  var zopim = win.$zopim;
  zopim(function() {
    zopim.livechat.hideAll();
  });
}

function render(name) {
  /* jshint maxlen: false, unused:false, quotmark:false */
  var config = get(name).config,
      zopimId = config.zopimId,
      snippet = `
        window.$zopim||
        (function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s= d.createElement(s),e=d.getElementsByTagName(s)[0];
        z.set=function(o){z.set. _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute('charset','utf-8');
        $.src='//v2.zopim.com/?${zopimId}';
        z.t=+new Date;$. type='text/javascript';e.parentNode.insertBefore($,e)})(document,'script');
      `,
      css = `
        .zopim[__jx__id] {
          display: none !important;
        }
      `,
      scriptTag = document.createElement('script');

  document.body.appendChild(scriptTag);
  scriptTag.innerHTML = snippet;

  if (!config.standalone) {
    document.body.appendChild(styleTag);
    styleTag.innerHTML = css;
    init(name);
  }

  mediator.channel.subscribe(name + '.show', function() {
    show(name);
  });

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
          mediator.channel.broadcast(name + '.onOnline');
        } else {
          mediator.channel.broadcast(name + '.onOffline');
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
          mediator.channel.broadcast(name + '.onUnreadMsgs', unreadMessageCount);
        }
      },
      onChatEnd = function() {
        mediator.channel.broadcast(name + '.onChatEnd');
      },
      onHide = function() {
        mediator.channel.broadcast(name + '.onHide');
      };

  chat.online = false;
  chat.connected = false;

  zopim(function() {
    var zopimLive = win.$zopim.livechat,
        zopimWin = zopimLive.window;

    zopimLive.setOnConnected(onConnect);

    zopimLive.hideAll();

    if (zopimLive.isChatting()) {
     mediator.channel.broadcast(name + '.onIsChatting');
    }

    zopimWin.onHide(onHide);
    zopimLive.setLanguage(i18n.getLocale());
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
