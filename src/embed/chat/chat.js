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
  var config = get(name).config;

  win.$zopim(function() {
    win.$zopim.livechat.window.setPosition(config.position);
    win.$zopim.livechat.window.setOffsetVertical(config.offsetVertical);
    win.$zopim.livechat.window.show();
  });

  if(_.isFunction(config.onShow)) {
    config.onShow();
  }
}

function hide(name) {
  var config = get(name).config;

  win.$zopim(function() {
    win.$zopim.livechat.hideAll();
  });

  if(_.isFunction(config.onHide)) {
    config.onHide();
  }
}

function toggleVisibility(name, isActive) {
  win.$zopim(function() {
    if (isActive && win.$zopim.livechat.window.getDisplay()) {
      hide(name);
    } else {
      show(name);
    }
  });
}

function render(name) {

  var zopimId = get(name).config.zopimId,
      scriptTag,
      snippet;

  /* jshint maxlen: false   */
  /* jshint quotmark: false */
  /* jshint laxbreak: true */
  snippet = "window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s= d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set. _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute('charset','utf-8'); $.src='//v2.zopim.com/?<%= zopimId %>';z.t=+new Date;$. type='text/javascript';e.parentNode.insertBefore($,e)})(document,'script');$zopim(function(){"
          + "$zopim.livechat.hideAll();"
          + "$zopim.livechat.clearAll();"
          + "});";

  scriptTag = document.createElement('script');
  scriptTag.type='text/javascript';
  document.body.appendChild(scriptTag);

  scriptTag.innerHTML = _.template(snippet, {zopimId: zopimId});

  win.$zopim(function() {
    win.$zopim.livechat.hideAll();
  });
}

export var chat  = {
  create: create,
  list: list,
  get: get,
  show: show,
  hide: hide,
  toggleVisibility: toggleVisibility,
  render: render
};
