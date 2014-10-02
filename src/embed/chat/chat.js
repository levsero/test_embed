import { document, win }   from 'utility/globals';
import { isMobileBrowser } from 'utility/devices';
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
  mediator.channel.broadcast(name + '.onShow');
}

function hide(name) {
  var zopim = win.$zopim;

  zopim(function() {
    zopim.livechat.hideAll();
  });

  mediator.channel.broadcast(name + '.onHide');
}

function render(name) {
  /* jshint maxlen: false, unused:false, quotmark:false */
  var zopimId = get(name).config.zopimId,
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
  document.body.appendChild(styleTag);

  scriptTag.innerHTML = snippet;
  styleTag.innerHTML = css;

  init(name);

  mediator.channel.subscribe(name + '.show', function() {
    show(name);
  });

  mediator.channel.subscribe(name + '.hide', function() {
    hide(name);
  });
}

function init(name) {
  var zopim = win.$zopim,
      chat = get(name),
      config = chat.config,
      onStatus = function(status) {
        if (status === 'online' && chat.connected) {
          chat.isOnline = true;
          mediator.channel.broadcast(name + '.onOnline');
        } else {
          chat.isOnline = false;
          mediator.channel.broadcast(name + '.onOffline');
        }
      },
      onConnect = function() {
        chat.connected = true;
      },
      onUnreadMsgs = function(unreadMessageCount) {
        if (chat.chatStarted && unreadMessageCount > 0) {
          if (!isMobileBrowser()) {
            show(name);
            mediator.channel.broadcast(name + '.onShow');
          }
          mediator.channel.broadcast(name + '.onIsChatting');
          chat.chatStarted = false;
        }

        if (unreadMessageCount > 0) {
          mediator.channel.broadcast(name + '.onUnreadMsgs', unreadMessageCount);
        }
      },
      onChatStart = function() {
        chat.chatStarted = true;
      },
      onChatEnd = function() {
        mediator.channel.broadcast(name + '.onChatEnd');
        hide(name);
      },
      onHide = function() {
        if (!chat.isOnline) {
          mediator.channel.broadcast(name + '.onHide');
          mediator.channel.broadcast(name + '.onChatEnd');
        }
      };

  zopim(function() {
    var zopimLive = win.$zopim.livechat,
        zopimWin = zopimLive.window;

    // TODO: once zopim api is updated the debounce
    // shouldn't be needed and we can remove it.
    zopimLive.setOnConnected(_.debounce(onConnect, 10));

    if (!zopimWin.getDisplay()) {
      zopimLive.hideAll();
    } else {
      show(name);
      mediator.channel.broadcast(name + '.onIsChatting');
      mediator.channel.broadcast(name + '.onShow');
    }

    zopimWin.onHide(onHide);
    zopimLive.setOnStatus(onStatus);
    zopimLive.setOnUnreadMsgs(onUnreadMsgs);
    zopimLive.setOnChatStart(onChatStart);
    zopimLive.setOnChatEnd(onChatEnd);
    zopimLive.theme.setColor(config.color);
    zopimLive.theme.setTheme('zendesk');
  });
}

export var chat  = {
  create: create,
  list: list,
  get: get,
  show: show,
  hide: hide,
  render: render
};
