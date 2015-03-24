var updateFrameName = 'zE-update';

function bustCache(versionHash) {
  var iframe = document.createElement('iframe'),
      onMessage = function(message) {
        if (message.data === 'cache_bust_done') {
          iframe.parentNode.removeChild(iframe);
          window.removeEventListener('message', onMessage);
        }
      },
      scriptSrc,
      updateUrl,
      updatePath = [
        'update.html?',
        (new Date()).getTime(),
        `#${versionHash}`,
      ].join(''),
      /* jshint laxbreak: true */
      script = document.getElementById('js-iframe-async')
               || document.querySelector('script[data-ze-csp="true"]');

  if (script) {
    scriptSrc = script.src;
    updateUrl = scriptSrc.replace('main.js', updatePath);
    iframe.setAttribute('style', 'position:absolute;visbility:hidden;left:-999em');
    iframe.src = updateUrl;
    iframe.name = updateFrameName;
    document.body.appendChild(iframe);
    window.addEventListener('message', onMessage, false);
  }
}

function isCacheBusting(name) {
  return name === updateFrameName;
}

export var cacheBuster = {
  bustCache: bustCache,
  isCacheBusting: isCacheBusting
};
