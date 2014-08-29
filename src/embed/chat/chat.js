import { document, win }   from 'utility/globals';
import { isMobileBrowser } from 'utility/devices';
import { i18n }            from 'service/i18n';

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

  if (_.isFunction(config.onShow)) {
    config.onShow();
  }
}

function hide(name) {
  var config = get(name).config,
      zopim = win.$zopim;

  zopim(function() {
    zopim.livechat.hideAll();
  });

  if (_.isFunction(config.onHide)) {
    config.onHide();
  }
}

function isOnline(name) {
  return get(name).isOnline;
}

function update(name, isActive) {
  var zopim = win.$zopim,
      chat = get(name),
      config = chat.config;

  zopim(function() {
    if (isActive && zopim.livechat.window.getDisplay()) {
      hide(name);

      if (isOnline(name)) {
        config.setLabel(i18n.t('embeddable_framework.launcher.label.chat'));
      } else {
        config.setLabel(i18n.t('embeddable_framework.launcher.label.help'));
      }

    } else {

      if (isOnline(name) && !chat.isForm) {
        show(name);
      } else {
        handleForm(name);
      }
    }
  });
}

function handleForm(name) {
  var chat = get(name);

  if (chat.isForm) {
    chat.isForm = false;
    chat.config.updateForm(true);
  } else {
    chat.isForm = true;
    chat.config.updateForm(false);
  }
}

function setStatus(opts) {
  var { name, isOnline, icon, label } = opts,
      chat = get(name),
      config = chat.config;

  chat.isOnline = isOnline;
  config.setIcon(icon);
  config.setLabel(label);
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
}

function init(name) {
  var zopim = win.$zopim,
      chat = get(name),
      config = chat.config,
      onStatus = function(status) {
        if (status === 'online' && chat.connected) {
          setStatus({
            name: name,
            isOnline: true,
            icon: 'Icon--chat',
            label: i18n.t('embeddable_framework.launcher.label.chat')
          });
        } else {
          setStatus({
            name: name,
            isOnline: false,
            icon: 'Icon',
            label: i18n.t('embeddable_framework.launcher.label.help')
          });
        }
      },
      onConnect = function() {
        chat.connected = true;
      },
      onUnreadMsgs = function(unreadMessageCount) {
        if (chat.chatStarted && unreadMessageCount > 0 && !isMobileBrowser()) {
          show(name);
          chat.chatStarted = false;
        }

        if (unreadMessageCount > 0) {
          config.setLabel(i18n.t('embeddable_framework.chat.notification', {
            count: unreadMessageCount
          }));
        }
      },
      onChatStart = function() {
        chat.chatStarted = true;
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
    }

    zopimLive.setOnStatus(onStatus);
    zopimLive.setOnUnreadMsgs(onUnreadMsgs);
    zopimLive.setOnChatStart(onChatStart);
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
  update: update,
  render: render
};
