var config = {};

function init(_config) {
  config = _config;
}

function send(payload) {
  var xhr = new XMLHttpRequest();

  xhr.open(
    payload.method.toUpperCase(), 
    buildFullUrl(payload.path),
    true
  );

  xhr.onreadystatechange = function(e) {
    if(xhr.readyState === 4)  {
      if (xhr.status >= 200 && xhr.status <= 300) {
        payload.callbacks.done(xhr.responseText, xhr.status, xhr);
      }
      else if (xhr.status >= 400) {
        payload.callbacks.fail(xhr, xhr.status);
      }
    }
  };

  xhr.send(payload.parameters);
}

function buildFullUrl(path) {
  return 'https://' + config.zendesk_host + path;
}

export var transport = {
  init: init,
  send: send
};
