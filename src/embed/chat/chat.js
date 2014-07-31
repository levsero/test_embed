import { document, win } from 'util/globals';
require('imports?_=lodash!lodash');

var chats = {};

function create(name, config) {
  var configDefaults = {
    position: 'br',
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

function checkOnline(name) {
  return get(name).isOnline;
}

function update(name, isActive) {
  var zopim = win.$zopim,
      chat = get(name),
      config = chat.config;

  zopim(function() {
    if (isActive && zopim.livechat.window.getDisplay()) {
      hide(name);

      if (get(name).isOnline) {
        config.setLabel('Chat');
      } else {
        config.setLabel('Support');
      }

    } else {

      if (checkOnline(name) && !chat.isForm) {
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

function setStatus(name, isOnline, icon, label) {
  var config = get(name).config;

  get(name).isOnline = isOnline;
  config.setIcon(icon);
  config.setLabel(label);
}

function render(name) {
  /* jshint maxlen: false,
            quotmark: false,
            laxbreak: true,
            unused:false
  */
  var config = get(name).config,
      zopimId = config.zopimId,
      onChange = function(status) {
        if (status === 'online' && get(name).connected) {
          setStatus(name, true, 'icon--chat', 'Chat');
        } else {
          setStatus(name, false, 'icon', 'Support');
        }
      },
      onConnect = function() {
        get(name).connected = true;
      },
      onMsgChange = function(number) {
        if (number > 0) {
          config.setLabel(`${number} New`);
        }
      },
      snippet = `
        window.$zopim||
        (function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s= d.createElement(s),e=d.getElementsByTagName(s)[0];
        z.set=function(o){z.set. _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute('charset','utf-8');
        $.src='//v2.zopim.com/?${zopimId}';
        z.t=+new Date;$. type='text/javascript';e.parentNode.insertBefore($,e)})(document,'script');$zopim(function(){
        $zopim.livechat.clearAll();
        });
      `,
      scriptTag,
      zopim;

  scriptTag = document.createElement('script');
  scriptTag.type='text/javascript';
  document.body.appendChild(scriptTag);

  scriptTag.innerHTML = snippet;
  zopim = win.$zopim;

  zopim(function() {
    var zopimLive = win.$zopim.livechat;

    zopimLive.setOnConnected(_.debounce(onConnect, 2500));
    zopimLive.hideAll();
    zopimLive.setOnStatus(onChange);
    zopimLive.theme.setColor(config.color);
    zopimLive.theme.setTheme('classic');
    zopimLive.setOnUnreadMsgs(onMsgChange);
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
