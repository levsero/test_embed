import { win, document, navigator } from './utils/globals.js';
import { sendData } from './utils/backend';
import { getBuid, parseUrl  } from './utils/utils';
import { store } from './utils/persistence';
import { identity } from './identity';

var url = win.location.origin;
var now = Date.now();
var buid = getBuid();
var referrer = parseUrl(document.referrer);
var previousTime = store.get('currentTime', true) || 0;
var beacon = function(opts) {
  url = opts.url || '';

  sendData(opts, function(response) {
    console.log(response);
  });
};

function timeOnLastPage() {
  return referrer.origin === url && previousTime ? (now - previousTime) : 0;
}

store.set('currentTime', now, true);

beacon({
  url: location.href,
  buid: buid,
  useragent: navigator.userAgent,
  referrer: referrer.href,
  time: timeOnLastPage(),
  metrics: ['beacon']
});

win.Zd = module.exports = {
  identity: identity
};

