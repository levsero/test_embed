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
        payload.callbacks.done();
      }
      else if (xhr.status >= 400) {
        payload.callbacks.fail();
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
