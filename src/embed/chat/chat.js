import { document, win } from 'util/globals';
require('imports?_=lodash!lodash');

var chats = {};

function create(name, config) {
  var configDefaults = {
    position: 'br',
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

  if(_.isFunction(config.onShow)) {
    config.onShow();
  }
}

function hide(name) {
  var config = get(name).config,
      zopim = win.$zopim;

  zopim(function() {
    zopim.livechat.hideAll();
  });

  if(_.isFunction(config.onHide)) {
    config.onHide();
  }
}

function checkOnline(name) {
  return get(name).isOnline;
}

function update(name, isActive) {
  win.$zopim(function() {
    if (isActive && win.$zopim.livechat.window.getDisplay()) {
      hide(name);
    } else {

      if(checkOnline(name) && !get(name).isForm) {
        show(name);
      } else {
        handleForm(name);
      }
    }
  });
}

function handleForm(name) {
  var chat = get(name);

  if(chat.isForm) {
    chat.isForm = false;
    chat.config.updateForm(true);
  } else {
    chat.isForm = true;
    chat.config.updateForm(false);
  }
}

function render(name) {
  /* jshint maxlen: false,
            quotmark: false,
            laxbreak: true,
            unused:false
  */
  var zopimId = get(name).config.zopimId,
      scriptTag,
      onChange = function(status) {
        if(status === 'online') {
          get(name).isOnline = true;
          get(name).config.changeIcon('icon--chat');
        } else {
          get(name).isOnline = false;
          get(name).config.changeIcon('icon');
        }
      },
      snippet = `
        window.$zopim||
        (function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s= d.createElement(s),e=d.getElementsByTagName(s)[0];
        z.set=function(o){z.set. _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute('charset','utf-8');
        $.src='//v2.zopim.com/?${zopimId}';
        z.t=+new Date;$. type='text/javascript';e.parentNode.insertBefore($,e)})(document,'script');$zopim(function(){
        $zopim.livechat.hideAll();
        $zopim.livechat.clearAll();
        });
      `;

  scriptTag = document.createElement('script');
  scriptTag.type='text/javascript';
  document.body.appendChild(scriptTag);

  scriptTag.innerHTML = snippet;

  win.$zopim(function() {
    win.$zopim.livechat.hideAll();
    win.$zopim.livechat.setOnStatus(onChange);
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
