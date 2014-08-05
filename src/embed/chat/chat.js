import { document, win } from 'util/globals';
require('imports?_=lodash!lodash');

var chats = {};

function create(name, config) {
  var configDefaults = {
    position: 'br',
    title: 'Zendesk Support',
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
        config.setLabel('Chat');
      } else {
        config.setLabel('Help');
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
  /* jshint maxlen: false, unused:false */
  var zopimId = get(name).config.zopimId,
      snippet = `
        window.$zopim||
        (function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s= d.createElement(s),e=d.getElementsByTagName(s)[0];
        z.set=function(o){z.set. _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute('charset','utf-8');
        $.src='//v2.zopim.com/?${zopimId}';
        z.t=+new Date;$. type='text/javascript';e.parentNode.insertBefore($,e)})(document,'script');
      `,
      scriptTag;

  scriptTag = document.createElement('script');
  document.body.appendChild(scriptTag);

  scriptTag.innerHTML = snippet;

  init(name);
}

function init(name) {
  var zopim = win.$zopim,
      chat = get(name),
      config = chat.config,
      onChange = function(status) {
        if (status === 'online' && chat.connected) {
          setStatus({
            name: name,
            isOnline: true,
            icon: 'Icon--chat',
            label: 'Chat'
          });
        } else {
          setStatus({
            name: name,
            isOnline: false,
            icon: 'Icon',
            label: 'Help'
          });
        }
      },
      onConnect = function() {
        chat.connected = true;
      },
      onMsgChange = function(number) {
        if (number > 0) {
          config.setLabel(`${number} New`);
        }
      };

  zopim(function() {
    var zopimLive = win.$zopim.livechat;

    // TODO: once zopim api is updated the debounce
    // shouldn't be needed and we can remove it.
    zopimLive.setOnConnected(_.debounce(onConnect, 2500));

    zopimLive.hideAll();
    zopimLive.clearAll();

    zopimLive.setOnStatus(onChange);
    zopimLive.setOnUnreadMsgs(onMsgChange);
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
