import { _ } from 'lodash'; /* jslint ignore:line */
import { sendData } from './utils/backend';
import { getBuid, store, retrieve, parseUrl, win, document } from './utils/utils';
import { identity } from './identity';
import { transport } from "./transport";
import { launcher } from './services/launcher/Launcher';

var url = location.origin;
var now = Date.now();
var buid = getBuid();
var referrer = parseUrl(document.referrer);
var previousTime = retrieve('currentTime', 'session') || 0;
var beacon = function(opts) {
  url = opts.url || '';

  sendData(opts, function(response) {
    console.log(response);
  });
};

function timeOnLastPage() {
  return referrer.origin === url && previousTime ? (now - previousTime) : 0;
}

store('currentTime', now, 'session');

beacon({
  url: location.href,
  buid: buid,
  useragent: navigator.userAgent,
  referrer: referrer.href,
  time: timeOnLastPage(),
  metrics: ['beacon']
});

launcher.create('demoLauncher', {
  onClick: function() {
    alert('This is Demo Launcher');
  }
});

launcher.render('demoLauncher');

win.Zd = module.exports = {
  identity: identity,
  transport: transport,
  services: {
    launcher: launcher
  }
};
